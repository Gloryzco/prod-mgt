import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

export class ResponseFormat {
  /**
   * Sends a success response to the client.
   * @param res - Express Response object
   * @param data - Data to be sent in the response
   * @param message - Custom message for the response
   * @param code - HTTP status code (default: 200 OK)
   */
  static successResponse<T>(
    res: Response,
    data: T,
    message: string,
    code: HttpStatus = HttpStatus.OK,
  ) {
    this.sendResponse(res, 'success', data, message, code);
  }

  /**
   * Sends an OK response to the client.
   * @param res - Express Response object
   * @param message - Custom message for the response
   * @param code - HTTP status code (default: 200 OK)
   */
  static okResponse(
    res: Response,
    message: string,
    code: HttpStatus = HttpStatus.OK,
  ) {
    this.sendResponse(res, 'success', undefined, message, code);
  }

  /**
   * Sends a failure response to the client.
   * @param res - Express Response object
   * @param data - Data to be sent in the response
   * @param message - Custom message for the response
   * @param code - HTTP status code (default: 400 Bad Request)
   */
  static failureResponse<T>(
    res: Response,
    data: T,
    message: string,
    code: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    this.sendResponse(res, 'error', data, message, code);
  }

  /**
   * Sends a standardized response to the client.
   * @param res - Express Response object
   * @param status - Status of the response ('success' or 'error')
   * @param data - Data to be sent in the response
   * @param message - Custom message for the response
   * @param code - HTTP status code (default: 200 OK)
   */
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
