import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ToggleEmergencyPauseDto {
  @IsBoolean()
  pause: boolean;
}

export class UpdateGlobalConfigDto {
  @IsOptional()
  @IsBoolean()
  emergencyPause?: boolean;

  @IsOptional()
  @IsString()
  priorityRule?: string;
}
