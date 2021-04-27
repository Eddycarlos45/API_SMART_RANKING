import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [ProxyRMQModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
