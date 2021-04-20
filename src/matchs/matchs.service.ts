import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IChallenge } from 'src/challenges/interfaces/challenge.interface';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { IMatch } from './interfaces/match.interface';

@Injectable()
export class MatchsService {
    constructor(@InjectModel('Match') private readonly matchModel: Model<IMatch>,
    private clientProxySmartRanking: ClientProxySmartRanking){}
    
    private readonly logger = new Logger(MatchsService.name)

    private clientChallenge = this.clientProxySmartRanking.getClientProxyChallengeInstance()

    async createMatch(match: IMatch): Promise<IMatch> {
        try {
            const createdMatch = new this.matchModel(match)
            this.logger.log(`createdMatch: ${JSON.stringify(createdMatch)}`)

            const result = await createdMatch.save()
            this.logger.log(`result: ${JSON.stringify(result)}`)
            const idMatch = result._id

            const challenge: IChallenge = await this.clientChallenge
            .send('get-challenges',
            {idPlayer: '', _id: match.challenge})
            .toPromise()

            return await this.clientChallenge.emit('update-challenge-match',
            {idMatch: idMatch, challenge: challenge})
            .toPromise()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }
}
