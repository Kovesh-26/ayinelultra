import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(3)
  handle: string;

  @IsString()
  @MinLength(2)
  displayName: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    handle: string;
    displayName: string;
    avatar?: string;
    role: string;
  };
  accessToken: string;
}
