import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const config: ConfigService = new ConfigService();

export default () => ({
  app: {
    name: config.get<string>('APP_NAME'),
    port: config.get<number>('APP_PORT') || 3000,
    debug: config.get<string>('APP_DEBUG') || 'false',
    url: config.get<string>('API_URL'),
  },

  redis: {
    host: config.get<any>('REDIS_HOST'),
    port: config.get<number>('REDIS_PORT'),
  },

  mongodb: {
    url: config.get<string>('MONGODB_URL'),
  },

  jwt: {
    access_tokenSecret: config.get<string>('ACCESS_TOKEN_SECRET'),
    refresh_tokenSecret: config.get<string>('REFRESH_TOKEN_SECRET'),
    access_tokenExpiration: config.get<string>('ACCESS_TOKEN_EXPIRATION'),
    refresh_tokenExpiration: config.get<string>('REFRESH_TOKEN_EXPIRATION'),
  },
});
