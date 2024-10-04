import { Injectable } from '@nestjs/common';
import { RedisClientProvider } from '../repository';
import { LoggerService } from 'src/logger';

const fiveSeconds = 10;

@Injectable()
export class RedisService {
  constructor(
    private readonly redisClient: RedisClientProvider,
    private readonly loggerService: LoggerService,
  ) {}

  async set(
    key: string,
    value: any,
    keyType: string = 'store',
    expiry: number = fiveSeconds,
  ): Promise<void> {
    try {
      const redisKey = `${keyType}:${key}`;
      await this.redisClient
        .getRedisInstance()
        .set(redisKey, JSON.stringify(value), 'EX', expiry);
    } catch (error) {
      this.loggerService.error(
        `Failed to set cache for key ${key}: ${error.message}`,
        error.stack,
      );
    }
  }
  
  async get(
    key: string,
    keyType: string = 'store',
    pagination?: { page: number; limit: number },
  ): Promise<any> {
    try {
      const redisKey = `${keyType}:${key}`;
      const data = await this.redisClient.getRedisInstance().get(redisKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.loggerService.error(
        `Failed to get cache for key ${key}: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  async delete(key: string, keyType: string = 'store'): Promise<void> {
    try {
      const redisKey = `${keyType}:${key}`;
      await this.redisClient.getRedisInstance().del(redisKey);
    } catch (error) {
      this.loggerService.error(
        `Failed to delete cache for key ${key}: ${error.message}`,
        error.stack,
      );
    }
  }

  async clearAllCache(): Promise<void> {
    try {
      const redisClient = this.redisClient.getRedisInstance();
      await redisClient.flushall();
    } catch (error) {
      this.loggerService.error(
        `Failed to clear all cache: ${error.message}`,
        error.stack,
      );
    }
  }
}
