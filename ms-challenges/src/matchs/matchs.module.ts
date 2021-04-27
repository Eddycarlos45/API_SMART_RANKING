import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { MatchSchema } from './interfaces/match.schema';
import { MatchsController } from './matchs.controller';
import { MatchsService } from './matchs.service';

@Module({
  imports:[
    MongooseModule.forFeature([
    {name: 'Match', schema: MatchSchema}
  ]),
  ProxyRMQModule
],
  controllers: [MatchsController],
  providers: [MatchsService]
})
export class MatchsModule {}
