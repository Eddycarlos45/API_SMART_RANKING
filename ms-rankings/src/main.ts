import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import {Logger} from '@nestjs/common'

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:bitnami@localhost:5672/smartranking'],
      noAck: false,
      queue: 'rankings',
    },
  });

  await app.listen(() => logger.log('Microservice is listening'));
}
bootstrap();
