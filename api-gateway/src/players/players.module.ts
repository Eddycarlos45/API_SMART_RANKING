import { Module } from '@nestjs/common';
import { ProxyRQModule } from 'src/common/proxymrq/proxyrmq.module';
import { PlayersController } from './players.controller';
@Module({
  imports: [ProxyRQModule],
  controllers: [PlayersController],
  providers: [],
})
export class PlayersModule {}
