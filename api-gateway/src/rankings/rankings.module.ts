import { Module } from '@nestjs/common';
import { ProxyRQModule } from 'src/common/proxymrq/proxyrmq.module';
import { RankingsController } from './rankings.controller';

@Module({
  imports: [ProxyRQModule],
  controllers: [RankingsController]
})
export class RankingsModule {}
