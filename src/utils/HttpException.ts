import {
  ExceptionFilter,
  ArgumentsHost,
  Catch,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionHandler implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;

    if (status.toString().startsWith('4')) {
      return response.status(status).json({
        status: 'fail',
        message: message,
      });
    } else {
      return response.status(status).json({
        status: 'fail',
        message: 'Something went wrong!',
      });
    }
  }
}
