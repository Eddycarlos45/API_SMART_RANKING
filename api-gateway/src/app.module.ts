import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { ChallengesModule } from './challenges/challenges.module';
@Module({
  imports: [CategoriesModule, PlayersModule, ChallengesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
