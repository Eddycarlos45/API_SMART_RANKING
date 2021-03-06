import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as momentTimezone from 'moment-timezone'
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:bitnami@localhost:5672/smartranking'],
      noAck: false,
      queue: 'challenges',
    },
  });

  Date.prototype.toJSON = function (): any {
    return momentTimezone(this)
      .tz('America/Sao_paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen(() => logger.log('Microservice is listening'));
}
bootstrap();
