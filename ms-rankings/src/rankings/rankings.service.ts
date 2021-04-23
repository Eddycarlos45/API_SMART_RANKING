import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import momentTimezone from 'moment-timezone';
import { Model } from 'mongoose';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { EventName } from './event-name.enum';
import { ICategory } from './interfaces/category.interface';
import { IChallenge } from './interfaces/challenge.interface';
import { IMatch } from './interfaces/match.interface';
import { IHistoric, IRankingResponse } from './interfaces/ranking-response.interface';
import { Ranking } from './interfaces/ranking.schema';
import * as _ from 'lodash'

@Injectable()
export class RankingsService {
    constructor(@InjectModel('Ranking') private readonly challengeModel: Model<Ranking>,
    private clientProxySmartRanking: ClientProxySmartRanking
    ){}

    private readonly logger = new Logger(RankingsService.name)
    private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance()

    private clientChallenge = this.clientProxySmartRanking.getClientProxyChallengeInstance()


    async processMatch(idMatch: string, match: IMatch): Promise<void> {
        try {   

            const category: ICategory = await this.clientAdminBackend
            .send('get-categories', match.category).toPromise()

            await Promise.all(match.players.map( async player => {
                const ranking = new this.challengeModel()
    
                ranking.category = match.category
                ranking.challenge = match.challenge
                ranking.match = idMatch
                ranking.player = player
    
                if(player ==  match.def){
                    const eventFilter = category.events.filter(
                        event => event.name === EventName.VICTORY
                    )
                    ranking.event = EventName.VICTORY
                    ranking.operation = eventFilter[0].operation
                    ranking.points = eventFilter[0].value
                } else {
                    const eventFilter = category.events.filter(
                        event => event.name === EventName.DEFEAT
                    )
                    ranking.event = EventName.DEFEAT
                    ranking.operation = eventFilter[0].operation
                    ranking.points = eventFilter[0].value
                }
                this.logger.log(`ranking: ${JSON.stringify(ranking)}`)
                 await ranking.save()
    
            }))
        } catch (error) {
            this.logger.error(`error: ${error}`)
            throw new RpcException(error.message)
        }

       
    }
    
    async queryRankings(idCategory: any, dataRef: string): Promise<IRankingResponse[] | IRankingResponse> {

        try {

            this.logger.log(`idCategory: ${idCategory} dataRef: ${dataRef}`)

            if (!dataRef) {

                dataRef = momentTimezone().tz("America/Sao_Paulo").format('YYYY-MM-DD')
                this.logger.log(`dataRef: ${dataRef}`)

            }

            const recordsRanking = await this.challengeModel.find()
            .where('category')
            .equals(idCategory)
            .exec()

            const challenges: IChallenge[] = await this.clientChallenge.send('query-challenges-performed',
            { idCategory: idCategory, dataRef: dataRef }).toPromise()

            _.remove(recordsRanking, function(item) {
                return challenges.filter(challenge => challenge._id == item.challenge).length == 0
            })

            this.logger.log(`recordsRanking: ${JSON.stringify(recordsRanking)}`)

            const result = _(recordsRanking)
            .groupBy('player')
            .map((items, key) => ({
                'player': key,
                'historic': _.countBy(items, 'event'),
                'score': _.sumBy(items, 'points')
            }))
            .value()

            const orderedResult = _.orderBy(result, 'score', 'desc')

            this.logger.log(`orderedResult: ${JSON.stringify(orderedResult)}`)

            const rankingResponseList: IRankingResponse[] = []

            orderedResult.map((item, index) => {
                const rankingReponse: IRankingResponse = {}

                rankingReponse.player = item.player
                rankingReponse.position = index + 1
                rankingReponse.score = item.score
                
                const historic: IHistoric = {}

                historic.victories = item.historic.VICTORY ? item.historic.VICTORY : 0
                historic.defeats = item.historic.DEFEAT ? item.historic.DEFEAT : 0

                rankingReponse.matchhistoric = historic

                rankingResponseList.push(rankingReponse)

            })

            return rankingResponseList
        } catch (error ) {

            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)

        }

    }

}
