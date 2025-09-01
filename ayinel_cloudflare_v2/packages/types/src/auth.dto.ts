import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;
}

export class MagicLinkDto {
  @IsEmail()
  email: string;
  
  @IsOptional()
  @IsString()
  redirectUrl?: string;
}

export class GoogleAuthDto {
  @IsString()
  token: string;
}

export class VerifyTokenDto {
  @IsString()
  token: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export class LogoutDto {
  @IsString()
  refreshToken: string;
}
