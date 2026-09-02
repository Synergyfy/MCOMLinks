import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class McomCallbackDto {
  @ApiProperty({
    example: 'abc123',
    description: 'Authorization code returned by Central Hub',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 'xyz456',
    description: 'CSRF state token issued by /auth/mcom/login',
  })
  @IsString()
  @IsNotEmpty()
  state: string;
}
