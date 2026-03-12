import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'The email address of the user',
        example: 'admin@mcomlinks.com',
    })
    @IsEmail({}, { message: 'Please enter a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({
        description: 'The password for the account',
        example: 'password123',
        minLength: 6,
    })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}
