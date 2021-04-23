import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { IMatch } from './interfaces/match.interface';
import { IRankingResponse } from './interfaces/ranking-response.interface';
import { RankingsService } from './rankings.service';

const ackErrors: string[] = ['E11000']

@Controller('rankings')
export class RankingsController {

    constructor(private readonly rankingsService: RankingsService){}

    private readonly logger = new Logger(RankingsController.name)

    @EventPattern('process-match')
    async processMatch(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ){
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()

        try {
            this.logger.log(`data: ${JSON.stringify(data)}`)
            const idMatch: string = data.idMatch
            const match: IMatch = data.match

            await this.rankingsService.processMatch(idMatch,match)
            await channel.ack(originalMsg)
        } catch (error) {
            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError)
            )
            if(filterAckError.length > 0) {
                await channel.ack(originalMsg)
            }
        }
    }
    
    @MessagePattern('query-rankings')
    async queryRankings(

        @Payload() data: any,
        @Ctx() context: RmqContext) : Promise<IRankingResponse[] | IRankingResponse>
       
     {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()

        try {

            const { idCategory, dataRef } = data

            return await this.rankingsService.queryRankings(idCategory, dataRef)


        } finally {

            await channel.ack(originalMsg)

        }

    }

}
