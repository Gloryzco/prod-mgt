import { Module } from '@nestjs/common';
import { RedisService } from './service';
import { RedisClientProvider, redisClientFactory } from './repository';
import { LoggerService } from 'src/logger';

@Module({
  providers: [LoggerService, RedisService, RedisClientProvider, redisClientFactory],
  exports: [RedisService, RedisClientProvider],
})
export class RedisModule {}
