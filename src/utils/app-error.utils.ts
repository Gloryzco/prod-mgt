import { HttpStatus } from '@nestjs/common';

class AppError extends Error {
  isOperational: boolean;
  statusCode: HttpStatus;

  constructor(message: string, statusCode: HttpStatus) {
    super(message);
    this.isOperational = true;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }

  httpStatus() {
    return this.statusCode;
  }
}

export default AppError;
