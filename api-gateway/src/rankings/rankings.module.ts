import { Module } from '@nestjs/common';
import { ProxyRQModule } from 'src/common/proxymrq/proxyrmq.module';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';

@Module({
  imports: [ProxyRQModule],
  controllers: [RankingsController],
  providers: [RankingsService]
})
export class RankingsModule {}
