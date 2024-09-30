import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { ResponseCodes } from './response-codes';
import { ErrorCode } from 'src/shared';

export class ResponseFormat {
  /**
   * Sends default JSON resonse to client
   * @param {*} code
   * @param {*} data
   * @param {*} message
   * @param {*} code
   */
  static successResponse<T>(
    res: Response,
    data: T,
    message: string,
    code: HttpStatus = HttpStatus.OK,
  ) {
    this.sendResponse(res, ResponseCodes['0000'], data, message, code);
  }

  /**
   * Sends default JSON resonse to client
   * @param {*} code
   * @param {*} data
   * @param {*} message
   * @param {*} code
   */
  static okResponse(
    res: Response,
    message: string,
    code: HttpStatus = HttpStatus.OK,
  ) {
    const response = {
      status: 'OK',
      code: '00',
      message: message,
    };

    res.status(code).json(response);
  }

  /**
   * Sends default JSON resonse to client
   * @param {*} code
   * @param {*} data
   * @param {*} message
   * @param {*} code
   */
  static requeryResponse<T>(
    res: Response,
    data: T,
    message: string,
    code: HttpStatus = HttpStatus.ACCEPTED,
  ) {
    this.sendResponse(
      res,
      ResponseCodes[ErrorCode['0001']],
      data,
      message,
      code,
    );
  }

  /**
   * Sends default JSON resonse to client
   * @param {*} code
   * @param {*} data
   * @param {*} message
   * @param {*} code
   */
  static failureResponse<T>(
    res: Response,
    data: T,
    message: string,
    code: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    this.sendResponse(res, ResponseCodes['0002'], data, message, code);
  }

  static handleAppErrorResponse(
    res: Response,
    errorCode: string,
    code: HttpStatus = HttpStatus.OK,
    message?: string,
  ) {
    this.sendResponse(
      res,
      ResponseCodes[errorCode],
      undefined,
      message || undefined,
      code,
    );
  }

  static sendResponse(
    res: Response,
    resDataType,
    data,
    message: string,
    code: HttpStatus = HttpStatus.OK,
  ) {
    const response = {
      status: resDataType?.status ?? 'FAILED',
      code: resDataType?.code ?? '06',
      message: message ?? resDataType?.message,
      data: data ?? undefined,
    };

    res.status(code).json(response);
  }
}
