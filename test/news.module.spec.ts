import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('API test cases for the news module', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Test the api/v1/news
  it('Should return that the keyword is a required param when the keyword is not filled', () => {
    return request(app.getHttpServer()).get('/api/v1/news').expect(400, {
      statusCode: 400,
      message: 'The keyword is a required param.',
    });
  });

  it('Should return that the maximum displayed articles are 10 when the limit is greater than 10', () => {
    return request(app.getHttpServer())
      .get('/api/v1/news')
      .query({ keyword: 'example', limit: 15 })
      .expect(400, {
        statusCode: 400,
        message: 'The maximum displayed articles are 10.',
      });
  });

  it('Should return the valid news when the keyword is filled', () => {
    return request(app.getHttpServer())
      .get('/api/v1/news')
      .query({ keyword: 'example' })
      .expect(200);
  });

  it('Should return the valid news when the query params are corect', () => {
    return request(app.getHttpServer())
      .get('/api/v1/news')
      .query({ keyword: 'example', limit: 5 })
      .expect(200);
  });

  // Test api/v1/news/search/title
  it('Should return that the keyword is a required param when the keyword is not filled', () => {
    return request(app.getHttpServer())
      .get('/api/v1/news/search/title')
      .expect(400, {
        statusCode: 400,
        message: 'The keyword is a required param.',
      });
  });

  it('Should return that the title is a required param when the title is not filled', () => {
    return request(app.getHttpServer())
      .get('/api/v1/news/search/title')
      .query({ keyword: 'example' })
      .expect(400, {
        statusCode: 400,
        message: 'The title is a required param.',
      });
  });

  it('Should return that no article is found with this title when the title is not found', () => {
    return request(app.getHttpServer())
      .get('/api/v1/news/search/title')
      .query({ keyword: 'example', title: 'Hello world' })
      .expect(404, {
        statusCode: 404,
        message: 'No article is found with this title.',
      });
  });

  it('Should return the valid article when the query params are corect', () => {
    return request(app.getHttpServer())
      .get('/api/v1/news/search/title')
      .query({
        keyword: 'example',
        title:
          'Manchester United fans told to look to Pep Guardiola for guidance on Alejandro Garnacho',
      })
      .expect(200);
  });

  // Test api/v1/news/search/language
  it('Should return that the keyword is a required param when the keyword is not filled', () => {
    return request(app.getHttpServer())
      .get('/api/v1/news/search/language')
      .expect(400, {
        statusCode: 400,
        message: 'The keyword is a required param.',
      });
  });

  it('Should return that the language is a required param when the language is not filled', () => {
    return request(app.getHttpServer())
      .get('/api/v1/news/search/language')
      .query({ keyword: 'example' })
      .expect(400, {
        statusCode: 400,
        message: 'The language is a required param.',
      });
  });

  it('Should return that the language is not supported param when the language is not included in the supported', () => {
    return request(app.getHttpServer())
      .get('/api/v1/news/search/language')
      .query({ keyword: 'example', language: 'vi' })
      .expect(400, {
        statusCode: 400,
        message: 'The language is not supported.',
      });
  });

  it('Should return the valid news when the query params are corect', () => {
    return request(app.getHttpServer())
      .get('/api/v1/news/search/language')
      .query({
        keyword: 'A Genève',
        language: 'fr',
      })
      .expect(200);
  });
});
