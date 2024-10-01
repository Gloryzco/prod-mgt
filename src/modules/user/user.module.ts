import { Module } from '@nestjs/common';
import { UserService } from './services';
import { UserController } from './controllers';
import { userSchema } from 'src/schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'users',
        schema: userSchema,
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
