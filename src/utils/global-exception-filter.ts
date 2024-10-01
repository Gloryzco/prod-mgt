import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseFormat } from './response-format';
import AppError from './app-error';
import AppValidationError from './app-validation-error';

export interface ErrorLogDetails {
  filePath: string;
  lineNumber: number;
  methodName: string;
  stackTrace: string;
  status: string;
  errorMessage: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = this.getStatusCode(exception);
    const message = exception.message || 'An unexpected error occurred.';

    ResponseFormat.failureResponse(response, null, message, status);
  }

  private getStatusCode(exception: Error): HttpStatus {
    if (exception instanceof AppError) {
      return exception.httpStatus();
    }

    if (exception instanceof AppValidationError) {
      return HttpStatus.BAD_REQUEST;
    }

    if (exception.name === 'JsonWebTokenError' || exception.name === 'TokenExpiredError') {
      return HttpStatus.UNAUTHORIZED;
    }

    if (exception.name === 'CastError') {
      return HttpStatus.BAD_REQUEST;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
