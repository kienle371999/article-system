import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  HttpException,
  HttpStatus,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AxiosError } from 'axios';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          return throwError(error);
        } else if (error instanceof AxiosError) {
          if (error.response) {
            // Axios error with response
            const { data, status } = error.response;
            return throwError(new HttpException(data, status));
          } else if (error.request) {
            // Axios error without response, e.g., network error
            return throwError(
              new HttpException(
                'Network Error',
                HttpStatus.SERVICE_UNAVAILABLE,
              ),
            );
          }
        }

        // Other axios errors
        return throwError(
          new HttpException('Unknown Error', HttpStatus.INTERNAL_SERVER_ERROR),
        );
      }),
    );
  }
}
