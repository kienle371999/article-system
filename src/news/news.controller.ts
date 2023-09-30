import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { Article } from './interfaces/new.interface';
import { NewsService } from './news.service';

@Controller('news')
@UseInterceptors(CacheInterceptor)
export class NewsController {
  constructor(private newsServices: NewsService) {}

  @Get()
  async getAll(): Promise<Article[]> {
    return this.newsServices.getAll();
  }

  @Get()
  async getArticles(@Query('pageSize') pageSize: number): Promise<Article[]> {
    return this.newsServices.getArticles(pageSize);
  }

  @Get()
  async getArticlesByTitle(@Query('title') title: string): Promise<Article> {
    return this.newsServices.getArticlesByTitile(title);
  }

  @Get('search')
  async getArticlesByKeyword(
    @Query('keyworld') keyworld: string,
  ): Promise<Article[]> {
    return this.newsServices.getArticleByKeyworld(keyworld);
  }
}
