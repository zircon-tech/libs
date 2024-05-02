import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Exception, GenericExceptionReason } from './exception';

@Catch()
export class GenericExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GenericExceptionFilter.name);
  async catch(exception: unknown, host: ArgumentsHost) {
    const isDevEnv = process.env.NODE_ENV === 'development';
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof Exception) {
      this.logger.error(JSON.stringify(exception.getResponse()));
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    if (exception instanceof NotFoundException) {
      this.logger.error(`Resource Not found: ${request.url}`);
      return response.status(HttpStatus.NOT_FOUND).json({
        code: GenericExceptionReason.RESOURCE_NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    if (exception instanceof UnauthorizedException) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        code: GenericExceptionReason.AUTH_UNAUTHORIZED,
        statusCode: HttpStatus.UNAUTHORIZED,
        timestamp: new Date().toISOString(),
      });
    }

    if (exception instanceof Error) {
      isDevEnv
        ? this.logger.error(exception.message, exception.stack)
        : this.logger.error(
            JSON.stringify({
              code: GenericExceptionReason.UNEXPECTED_ERROR,
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              timestamp: new Date().toISOString(),
              message: exception.message,
              cause: exception.stack,
            }),
          );
    } else {
      isDevEnv
        ? this.logger.error(exception)
        : this.logger.error(
            JSON.stringify({
              code: GenericExceptionReason.UNEXPECTED_ERROR,
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              timestamp: new Date().toISOString(),
              body: request.body,
              path: request.url,
              exception: (exception && (exception as any).message) || exception,
            }),
          );
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: GenericExceptionReason.UNEXPECTED_ERROR,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
    });
  }
}
