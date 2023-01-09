import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from '../user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  role: Role;
}

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
