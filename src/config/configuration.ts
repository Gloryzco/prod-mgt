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


  mongodb: {
    url: config.get<string>('MONGODB_URL'),
  },

  jwt: {
    accessTokenSecret: config.get<string>('accessTokenSecret'),
    refreshTokenSecret: config.get<string>('refreshTokenSecret'),
    accessTokenExpiration: config.get<string>('accessTokenExpiration'),
    refreshTokenExpiration: config.get<string>('refreshTokenExpiration'),
  },
});
