import { Module } from '@nestjs/common';
import { ProxyRQMOdule } from 'src/proxymrq/proxyrmq.module';
import { CategoriesController } from './categories.controller';
@Module({
  imports: [ProxyRQMOdule],
  controllers: [CategoriesController],
  providers: [],
})
export class CategoriesModule {}
