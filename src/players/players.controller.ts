import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { IPlayer } from './interfaces/player.interface';
import { PlayersService } from './players.service';

const ackErrors: string[] = ['E11000']; //error cases where you can delete message in rabbitmq

@Controller('api/v1')
export class PlayersController {
    constructor(private readonly playersService: PlayersService) {}

    logger = new Logger(PlayersController.name);

    @EventPattern('create-player')
    async createCategory(
      @Payload() player: IPlayer,
      @Ctx() context: RmqContext,
    ) {
      const channel = context.getChannelRef();
      const originalMessage = context.getMessage();
      this.logger.log(`player: ${JSON.stringify(player)}`);
      try {
        await this.playersService.createPlayer(player);
        await channel.ack(originalMessage);
      } catch (error) {
        this.logger.error(`error: ${JSON.stringify(error.message)}`);
        const filterAckError = ackErrors.filter((ackError) =>
          error.message.includes(ackError),
        );
        if (filterAckError) {
          await channel.ack(originalMessage);
        }
      }
    }

    @MessagePattern('get-players')
    async getCategories(@Payload() _id: string, @Ctx() context: RmqContext) {
      const channel = context.getChannelRef();
      const originalMessage = context.getMessage();
      try {
        if (_id) {
          return await this.playersService.findPlayerbyId(_id);
        } else {
          return await this.playersService.listAllPlayers();
        }
      } finally {
        await channel.ack(originalMessage);
      }
    }
}
