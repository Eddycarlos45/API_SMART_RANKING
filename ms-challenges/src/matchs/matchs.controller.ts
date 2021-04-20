import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { IMatch } from './interfaces/match.interface';
import { MatchsService } from './matchs.service';

const ackErrors: string[] = ['E11000']

@Controller()
export class MatchsController {
    constructor(private readonly matchService: MatchsService){}

    private readonly logger = new Logger(MatchsController.name)

    @EventPattern('create-match')
    async createMatch(
        @Payload() match: IMatch,
        @Ctx() context: RmqContext
    ){
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()

        try {
        this.logger.log(`match: ${JSON.stringify(match)}`)
        await this.matchService.createMatch(match)    
        await channel.ack(originalMsg)    
        } catch (error) {
            this.logger.log(`error: ${JSON.stringify(error.message)}`)
            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError))
                if(filterAckError){
                    await channel.ack(originalMsg)
                }
        }
    }
}
