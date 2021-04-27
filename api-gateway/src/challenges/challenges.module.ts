import { Module } from '@nestjs/common';
import { ProxyRQModule } from 'src/common/proxymrq/proxyrmq.module';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';

@Module({
  imports:[ProxyRQModule],
  controllers: [ChallengesController],
  providers: [ChallengesService]
})
export class ChallengesModule {}
