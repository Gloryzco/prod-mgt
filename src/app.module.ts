import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import {} from './modules';
import { AuthModule, UserModule, RedisModule, ProductModule } from './modules';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './utils';

const config = configuration();
@Module({
  imports: [
    MongooseModule.forRoot(config.mongodb.url),
    RedisModule,
    UserModule,
    AuthModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    AppService,
  ],
})
export class AppModule {}
