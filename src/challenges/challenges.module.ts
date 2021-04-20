import { Module } from '@nestjs/common';
import { ProxyRQModule } from 'src/common/proxymrq/proxyrmq.module';
import { ChallengesController } from './challenges.controller';

@Module({
  imports:[ProxyRQModule],
  controllers: [ChallengesController]
})
export class ChallengesModule {}
