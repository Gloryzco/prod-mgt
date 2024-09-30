import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';
import { winstonConfig } from '../config/winston.config';

@Injectable()
export class LoggerService {
  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger(winstonConfig);
  }

  log(message: string, context?: string) {
    this.logger.info(this.formatMessage(message, context));
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(this.formatMessage(message, context), trace);
  }

  warn(message: string, context?: any) {
    this.logger.warn(this.formatMessage(message, context));
  }

  debug(message: string, context?: string) {
    this.logger.debug(this.formatMessage(message, context));
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(this.formatMessage(message, context));
  }

  private formatMessage(message: string, context?: string): string {
    return context ? `[${context}] ${message}` : message;
  }
}
