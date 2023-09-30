import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Article, News } from './interfaces/news.interface';
import { NewsService } from './news.service';

@Controller('api/v1/news')
@UseInterceptors(CacheInterceptor)
export class NewsController {
  constructor(private newsServices: NewsService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false })
  @ApiOperation({
    summary: 'Get articles that match a search keyword with optional limit.',
    tags: ['News'], // Rename the default "default" tag to "CustomTag"
  })
  async getArticles(
    @Query('keyword') keyword: string,
    @Query('limit') limit?: number,
  ): Promise<News> {
    return this.newsServices.getArticles(keyword, limit);
  }

  @Get('search/title')
  @ApiOperation({
    summary:
      'Get articles that match the search keyword and have a specific title.',
    tags: ['News'], // Rename the default "default" tag to "CustomTag"
  })
  async getArticlesByTitle(
    @Query('keyword') keyword: string,
    @Query('title') title: string,
  ): Promise<Article> {
    return this.newsServices.getArticlesByTitile(keyword, title);
  }

  @Get('search/language')
  @ApiOperation({
    summary:
      'Get articles that match the search keyword and are written by a specific language.',
    tags: ['News'], // Rename the default "default" tag to "CustomTag"
  })
  async getArticlesByLanguage(
    @Query('keyword') keyword: string,
    @Query('language') language: string,
  ): Promise<News> {
    return this.newsServices.getArticlesByLanguage(keyword, language);
  }
}
