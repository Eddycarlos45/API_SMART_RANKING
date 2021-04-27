import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { ChallengesModule } from './challenges/challenges.module';
import { RankingsModule } from './rankings/rankings.module';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    CategoriesModule, 
    PlayersModule, 
    ChallengesModule, 
    RankingsModule, 
    AuthModule, 
    AwsModule,
    ConfigModule.forRoot({isGlobal: true}),],
  controllers: [],
  providers: [],
})
export class AppModule {}
