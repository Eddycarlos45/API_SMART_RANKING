import { Module } from '@nestjs/common';
import { ProxyRQModule } from 'src/common/proxymrq/proxyrmq.module';
import { CategoriesController } from './categories.controller';
@Module({
  imports: [ProxyRQModule],
  controllers: [CategoriesController],
  providers: [],
})
export class CategoriesModule {}
