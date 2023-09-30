import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot(), CacheModule.register()],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
