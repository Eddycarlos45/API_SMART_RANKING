import { Module } from '@nestjs/common';
import { ProxyRQMOdule } from 'src/proxymrq/proxyrmq.module';
import { PlayersController } from './players.controller';
@Module({
  imports: [ProxyRQMOdule],
  controllers: [PlayersController],
  providers: [],
})
export class PlayersModule {}
