import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch()
export class CustomExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    console.log(exception);

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const err = exception.getResponse();

      response.status(status).json(err);
    } else {
      response.status(500).json(new HttpException(exception, 500));
    }
  }
}
