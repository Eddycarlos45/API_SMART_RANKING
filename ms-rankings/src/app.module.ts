import { Module } from '@nestjs/common';
import { RankingsModule } from './rankings/rankings.module';
import { MongooseModule} from '@nestjs/mongoose'
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import * as dotenv from 'dotenv'

dotenv.config()

@Module({
  imports: [RankingsModule,
    MongooseModule.forRoot(process.env.DB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,}),
    ProxyrmqModule
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
