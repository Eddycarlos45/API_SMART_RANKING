import { Module } from '@nestjs/common';
import { ProxyRQModule } from 'src/common/proxymrq/proxyrmq.module';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
@Module({
  imports: [ProxyRQModule],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
