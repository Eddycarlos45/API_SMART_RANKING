import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { EventName } from './event-name.enum';
import { ICategory } from './interfaces/category.interface';
import { IMatch } from './interfaces/match.interface';
import { Ranking } from './interfaces/ranking.schema';

@Injectable()
export class RankingsService {
    constructor(@InjectModel('Ranking') private readonly challengeModel: Model<Ranking>,
    private clientProxySmartRanking: ClientProxySmartRanking
    ){}

    private readonly logger = new Logger(RankingsService.name)
    private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance()

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
}
