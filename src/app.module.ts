import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AxiosErrorInterceptor } from './interceptor/axios-error.interceptor';
import { NewsModule } from './news/news.module';

@Module({
  imports: [NewsModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AxiosErrorInterceptor,
    },
  ],
})
export class AppModule {}
