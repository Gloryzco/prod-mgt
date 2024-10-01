import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required.' })
  readonly email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  readonly password: string;
}
