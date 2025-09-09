import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateStatusDto {
  @IsOptional()
  @IsString()
  @MaxLength(140, { message: 'Status must be 140 characters or less' })
  status?: string;
}