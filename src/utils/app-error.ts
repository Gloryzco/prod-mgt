import { HttpStatus } from '@nestjs/common';
import { ResponseCodes } from './response-codes';

class AppError extends Error {
  message: string;
  isOperational: boolean;
  responseCode: string;
  responseBody: any;

  constructor(responseCode: string, message?: string) {
    super();

    this.isOperational = true;
    this.message = message ? message : ResponseCodes[responseCode].message;
    this.responseCode = responseCode;
    this.responseBody = ResponseCodes[responseCode];

    Error.captureStackTrace(this, this.constructor);
  }

  httpStatus() {
    switch (this.responseBody?.status) {
      case 'OK':
        if (this.responseBody.code == '00') {
          return HttpStatus.OK;
        }

        if (this.responseBody.code == '01') {
          return HttpStatus.ACCEPTED;
        }

      case 'FAIL':
        if (this.responseBody.code == '02') {
          return HttpStatus.BAD_REQUEST;
        }

        if (this.responseBody.code == '03') {
          return HttpStatus.BAD_REQUEST;
        }

        if (this.responseBody.code == '05') {
          return HttpStatus.UNAUTHORIZED;
        }

        if (this.responseBody.code == '08') {
          return HttpStatus.NOT_FOUND;
        }

        if (this.responseBody.code == '09') {
          return HttpStatus.FORBIDDEN;
        }

        return HttpStatus.BAD_REQUEST;

      case 'DENIED':
        return HttpStatus.BAD_REQUEST;

      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}

export default AppError;
