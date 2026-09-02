import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum SystemLogType {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export class CreateSystemLogDto {
  @IsEnum(SystemLogType)
  type: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  source?: string;
}
