import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengesModule } from './challenges/challenges.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import * as dotenv from 'dotenv';
import { MatchsModule } from './matchs/matchs.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }),
  ChallengesModule,
  ProxyRMQModule,
  MatchsModule
],
  controllers: [],
  providers: [],
})
export class AppModule {}
