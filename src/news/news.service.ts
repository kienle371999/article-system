import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { Language } from './enums/news.enum';
import { News, Article } from './interfaces/news.interface';

@Injectable()
export class NewsService {
  constructor(
    private httpService: HttpService,
    private newsConfigService: ConfigService,
  ) {}

  private async fetchNews(params: any): Promise<News> {
    const observableNews = this.httpService
      .get<News>(this.newsConfigService.get('API_URL'), {
        headers: {
          'Content-Type': 'application/json',
        },
        params,
      })
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

    const { data } = await firstValueFrom(observableNews);
    return data;
  }

  async getArticles(keyword: string, limit: number): Promise<News> {
    if (!keyword || limit > 10) {
      let errorMessage = '';

      if (!keyword) {
        errorMessage = 'The keyword is a required param.';
      } else if (limit > 10) {
        errorMessage = 'The maximum displayed articles are 10.';
      }

      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    const params = {
      apikey: this.newsConfigService.get('API_KEY'),
      q: keyword,
      max: limit,
    };

    const response = await this.fetchNews(params);
    return {
      totalArticles: response.articles.length,
      articles: response.articles,
    };
  }

  async getArticlesByTitile(keyword: string, title: string): Promise<Article> {
    if (!keyword || !title) {
      let errorMessage = '';

      if (!keyword) {
        errorMessage = 'The keyword is a required param.';
      } else if (!title) {
        errorMessage = 'The title is a required param.';
      }

      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    const params = {
      apikey: this.newsConfigService.get('API_KEY'),
      q: keyword,
      in: title,
    };

    const response = await this.fetchNews(params);
    const correctArticle = response.articles.find(
      (article) => article.title === title,
    );

    if (!correctArticle) {
      throw new HttpException(
        'No article is found with this title',
        HttpStatus.NOT_FOUND,
      );
    }

    return correctArticle;
  }

  async getArticlesByLanguage(keyword: string, language: string) {
    if (
      !keyword ||
      !language ||
      !Object.values(Language).includes(language as Language)
    ) {
      let errorMessage = '';

      if (!keyword) {
        errorMessage = 'The keyword is a required param.';
      } else if (!language) {
        errorMessage = 'The language is a required param.';
      } else if (!Object.values(Language).includes(language as Language)) {
        errorMessage = 'The language is not supported.';
      }

      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    const params = {
      apikey: this.newsConfigService.get('API_KEY'),
      q: keyword,
      lang: language,
    };

    const response = await this.fetchNews(params);
    return {
      totalArticles: response.articles.length,
      articles: response.articles,
    };
  }
}
