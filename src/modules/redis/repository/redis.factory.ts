import {
  FactoryProvider,
  HttpStatus,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import configuration from 'src/config/configuration';
import { LoggerService } from 'src/logger';
import AppError from 'src/shared/utils/app-error.utils';

const config = configuration();

export class RedisClientProvider implements OnModuleInit, OnModuleDestroy {
  private redisInstance: Redis | null = null;
  private loggerService = new LoggerService();

  async onModuleInit() {
    this.redisInstance = new Redis({
      host: config.redis.host,
      port: +config.redis.port,
    });

    this.redisInstance.on('error', (e) => {
      this.loggerService.error(`Redis connection failed: ${e}`);
      throw new AppError(
        'Redis connection failed. Application will not start.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    this.redisInstance.on('connect', () => {
      this.loggerService.log(
        `Redis Server Connected on port: ${config.redis.port}`,
      );
    });
  }

  onModuleDestroy(): void {
    this.redisInstance.disconnect();
  }

  getRedisInstance(): Redis | null {
    return this.redisInstance;
  }
}

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: async (redisClientProvider: RedisClientProvider) => {
    return redisClientProvider.getRedisInstance();
  },
  inject: [RedisClientProvider],
};
