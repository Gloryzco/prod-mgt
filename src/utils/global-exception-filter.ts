import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
  } from '@nestjs/common';
  import { AxiosError } from 'axios';
  import { Response } from 'express';
import AppError from './app-error';
import { ResponseFormat } from './response-format';
import { ErrorCode } from 'src/shared';
import { ResponseCodes } from './response-codes';
import AppValidationError from './app-validation-error';
  
  export interface ErrorLogDetails {
    filePath: string;
    lineNumber: number;
    methodName: string;
    responseCode: string;
    stackTrace: string;
    status: string;
    errorMessage: string;
  }
  
  function extractErrorLogDetails(error: any): ErrorLogDetails | null {
    const trace = error.stack ? error.stack.split('\n') : [];
    // Regex to match stack trace line with file path, line number, and column
    const stackTraceRegex = /at\s+(.*)\s+\((.*):(\d+):\d+\)/;
    // Look for the first valid stack trace entry (this is where your method failed)
    let filePath = 'Unknown file';
    let lineNumber = 0;
    let methodName = 'Unknown method';
    for (const line of trace) {
      const match = line.match(stackTraceRegex);
      if (match) {
        methodName = match[1].split('.').pop() || methodName;
        filePath = match[2];
        lineNumber = parseInt(match[3], 10);
        break;
      }
    }
    // Extracting additional custom fields (response code, status, error message)
    const responseCode = error.responseCode || 'Unknown code';
    const status = error.responseBody?.status || 'Unknown status';
    const errorMessage =
      error.responseBody?.message || error.message || 'No error message';
  
    return {
      filePath,
      lineNumber,
      methodName,
      responseCode,
      status,
      stackTrace: error.stack ? error.stack : '',
      errorMessage,
    };
  }
  
  @Catch()
  export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      console.error('APPLICATION ERROR: ', exception);
  
      if (exception instanceof AppError) {
        ResponseFormat.handleAppErrorResponse(
          response,
          exception.responseCode,
          exception.httpStatus(),
          exception.message,
        );
      } else if (exception instanceof AppValidationError) {
        ResponseFormat.sendResponse(
          response,
          ResponseCodes[ErrorCode['0002']],
          undefined,
          exception.message,
          400,
        );
      } else if (exception instanceof AxiosError) {
        ResponseFormat.handleAppErrorResponse(
          response,
          ErrorCode['0006'],
          HttpStatus.BAD_REQUEST,
        );
      } else if (
        exception.name === 'JsonWebTokenError' ||
        exception.name === 'TokenExpiredError'
      ) {
        ResponseFormat.handleAppErrorResponse(
          response,
          ErrorCode['0005'],
          HttpStatus.UNAUTHORIZED,
        );
      } else if (exception.name === 'CastError') {
        ResponseFormat.handleAppErrorResponse(
          response,
          ErrorCode['0002'],
          HttpStatus.BAD_REQUEST,
        );
      } else {
        ResponseFormat.handleAppErrorResponse(
          response,
          ErrorCode['0006'],
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }
  