import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { ICategory } from './interfaces/categories/category.interface';

const ackErrors: string[] = ['E11000']; //error cases where you can delete message in rabbitmq

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: ICategory,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    this.logger.log(`category: ${JSON.stringify(category)}`);
    try {
      await this.appService.createCategory(category);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackErrors) =>
        error.message.includes(ackErrors),
      );
      if (filterAckError) {
        await channel.ack(originalMessage);
      }
    }
  }

  @MessagePattern('get-categories')
  async getCategories(@Payload() _id: string) {
    if (_id) {
      return await this.appService.getCategoryById(_id);
    } else {
      return await this.appService.getCategories();
    }
  }
}
