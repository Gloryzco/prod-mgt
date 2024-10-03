import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  NotFoundException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { Response } from 'express';
import AppError from './app-error.utils';
import AppValidationError from './app-validation-error';
import { ResponseFormat } from './response-format';

export interface ErrorLogDetails {
  filePath: string;
  lineNumber: number;
  methodName: string;
  stackTrace: string;
  status: string;
  errorMessage: string;
}

//Handle all unexpected exceptions
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = this.getStatusCode(exception);
    const message = this.getErrorMessage(exception);
    ResponseFormat.failureResponse(response, null, message, status);
  }

  private getStatusCode(exception: Error): HttpStatus {
    if (exception instanceof AppError) {
      return exception.httpStatus();
    }

    if (exception instanceof AppValidationError) {
      return HttpStatus.BAD_REQUEST;
    }

    if (exception instanceof NotFoundException) {
      return HttpStatus.NOT_FOUND;
    }

    if (exception instanceof MethodNotAllowedException) {
      return HttpStatus.METHOD_NOT_ALLOWED;
    }

    if (
      exception.name === 'JsonWebTokenError' ||
      exception.name === 'TokenExpiredError'
    ) {
      return HttpStatus.UNAUTHORIZED;
    }

    if (exception.name === 'CastError') {
      return HttpStatus.BAD_REQUEST;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getErrorMessage(exception: Error): string {
    if (exception instanceof NotFoundException) {
      return 'The requested resource was not found.';
    }

    if (exception instanceof MethodNotAllowedException) {
      return 'The HTTP method is not allowed for the requested resource.';
    }

    return exception.message || 'An unexpected error occurred.';
  }
}
