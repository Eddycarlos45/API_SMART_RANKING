import { Module } from '@nestjs/common';
import { ProxyRQModule } from 'src/common/proxymrq/proxyrmq.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
@Module({
  imports: [ProxyRQModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
