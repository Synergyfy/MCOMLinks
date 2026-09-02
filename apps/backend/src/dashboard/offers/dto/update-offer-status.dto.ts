import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OfferStatus } from './create-offer.dto';

export class UpdateOfferStatusDto {
  @IsEnum(OfferStatus)
  status: OfferStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
