import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { News, Article } from './interfaces/new.interface';

@Injectable()
export class NewsService {
  constructor(
    private httpService: HttpService,
    private newsConfigService: ConfigService,
  ) {}

  async getAll(): Promise<Article[]> {
    const observableNews = this.httpService
      .get<News>(this.newsConfigService.get('API_URL'), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

    const { data } = await firstValueFrom(observableNews);
    return data.articles;
  }

  async getArticles(pageSize: number): Promise<Article[]> {
    const observableNews = this.httpService
      .get<News>(this.newsConfigService.get('API_URL'), {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          max: pageSize,
        },
      })
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

    const { data } = await firstValueFrom(observableNews);
    return data.articles;
  }

  async getArticlesByTitile(title: string): Promise<Article> {
    const observableNews = this.httpService
      .get<News>(this.newsConfigService.get('API_URL'), {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          in: title,
        },
      })
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

    const { data } = await firstValueFrom(observableNews);
    const correctArticle = data.articles.find(
      (article) => article.title === title,
    );

    if (!correctArticle) {
      throw new HttpException(
        'No article found with this title',
        HttpStatus.NOT_FOUND,
      );
    }

    return correctArticle;
  }

  async getArticleByKeyworld(keyword: string): Promise<Article[]> {
    console.log(keyword);
    const observableNews = this.httpService
      .get<News>(this.newsConfigService.get('API_URL'), {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          in: 'title, description, content',
        },
      })
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

    const { data } = await firstValueFrom(observableNews);
    return data.articles;
  }
}
