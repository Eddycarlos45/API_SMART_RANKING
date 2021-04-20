import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ChallengesService } from './challenges.service';
import { IChallenge } from './interfaces/challenge.interface';

const ackErrors: string[] = ['E11000']

@Controller()
export class ChallengesController {

    constructor(private readonly challengeService: ChallengesService){}

    private readonly logger = new Logger(ChallengesController.name)

    @EventPattern('create-challenge')
    async createChallenge(@Payload() challenge: IChallenge, @Ctx() context: RmqContext){

        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()

        try {
            this.logger.log(`challenge: ${JSON.stringify(challenge)}`)
            await this.challengeService.createChallenge(challenge)
            await channel.ack(originalMsg)
        } catch (error) {
            this.logger.log(`error: ${JSON.stringify(error.message)}`)
            const filterAckError = ackErrors.filter(
                ackErrors => error.message.includes(ackErrors))
                if(filterAckError){
                    await channel.ack(originalMsg)
                }
        }
    }

    @EventPattern('update-challenge')
    async updateChallenge(@Payload() data: any, @Ctx() context: RmqContext){

        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()

        try {
            this.logger.log(`challenge: ${JSON.stringify(data)}`)
            const _id: string = data.id
            const challenge: IChallenge = data.challenge
            await this.challengeService.updateChallenge(_id, challenge)
            await channel.ack(originalMsg)
        } catch (error) {
            this.logger.log(`error: ${JSON.stringify(error.message)}`)
            const filterAckError = ackErrors.filter(
                ackErrors => error.message.includes(ackErrors))
                if(filterAckError){
                    await channel.ack(originalMsg)
                }
        }
    }

    @EventPattern('update-challenge-match')
    async updateChallengeMatch(@Payload() data: any, @Ctx() context: RmqContext){

        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()

        try {
            this.logger.log(`idMatch: ${data}`)
            const idMatch: string = data.idPartida
            const challenge: IChallenge = data.challenge
            await this.challengeService.updateChallengeMatch(idMatch, challenge)
            await channel.ack(originalMsg)
        } catch (error) {
            this.logger.log(`error: ${JSON.stringify(error.message)}`)
            const filterAckError = ackErrors.filter(
                ackErrors => error.message.includes(ackErrors))
                if(filterAckError){
                    await channel.ack(originalMsg)
                }
        }
    }

    @EventPattern('delete-challenge')
    async deleteChallenge(@Payload() challenge: IChallenge, @Ctx() context: RmqContext){

        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()

        try {
            await this.challengeService.deleteChallenge(challenge)
            await channel.ack(originalMsg)
        } catch (error) {
            this.logger.log(`error: ${JSON.stringify(error.message)}`)
            const filterAckError = ackErrors.filter(
                ackErrors => error.message.includes(ackErrors))
                if(filterAckError){
                    await channel.ack(originalMsg)
                }
        }
    }

    @MessagePattern('get-challenges')
    async getChallenges(@Payload() data: any, @Ctx() context: RmqContext): Promise<IChallenge[] | IChallenge>{

        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()

        try {
            const { idPlayer, _id} = data
            this.logger.log(`data: ${JSON.stringify(data)}`)

            if(idPlayer){
                return await this.challengeService.findChallengeByPlayer(idPlayer)
            } else if(_id){
                return await this.challengeService.findChallengeById(_id)
            } else {
                return await this.challengeService.findAllChallenges()
            }
        } finally {
            await channel.ack(originalMsg)
        }
    }

}
