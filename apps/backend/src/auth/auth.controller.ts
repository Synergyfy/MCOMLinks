import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Authenticate user and return JWT token' })
    @ApiResponse({
        status: 200,
        description: 'Successfully authenticated',
        schema: {
            type: 'object',
            properties: {
                access_token: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        role: { type: 'string' },
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    @ApiResponse({ status: 400, description: 'Registration failed' })
    async register(@Body() body: any) {
        return this.authService.register(body);
    }
}
