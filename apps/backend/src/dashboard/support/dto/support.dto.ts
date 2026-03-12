import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSupportMessageDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsString()
    @IsNotEmpty()
    sender: 'user' | 'agent';

    @IsString()
    @IsOptional()
    time?: string;
}

export class SupportMessageDto {
    id: string;
    text: string;
    sender: 'user' | 'agent' | string;
    time: string;
    userId?: string;
    createdAt: Date;
}
