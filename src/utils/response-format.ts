import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

export class ResponseFormat {

  static successResponse<T>(
    res: Response,
    data: T,
    message: string,
    code: HttpStatus = HttpStatus.OK,
  ) {
    this.sendResponse(res, 'success', data, message, code);
  }

  static okResponse(
    res: Response,
    message: string,
    code: HttpStatus = HttpStatus.OK,
  ) {
    this.sendResponse(res, 'success', undefined, message, code);
  }

  static failureResponse<T>(
    res: Response,
    data: T,
    message: string,
    code: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    this.sendResponse(res, 'error', data, message, code);
  }

  static sendResponse(
    res: Response,
    status: 'success' | 'error',
    data: any,
    message: string,
    code: HttpStatus = HttpStatus.OK,
  ) {
    const response = {
      status,
      message,
      data: data ?? undefined,
    };

    res.status(code).json(response);
  }
}
