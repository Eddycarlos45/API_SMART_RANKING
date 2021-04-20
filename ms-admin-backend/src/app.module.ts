import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
dotenv.config();
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }),
    CategoriesModule,
    PlayersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
