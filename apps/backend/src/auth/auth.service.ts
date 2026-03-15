import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) { }

    async validateUser(loginDto: LoginDto): Promise<any> {
        const { email, password } = loginDto;

        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (user && user.password === password) {
            const { password, ...result } = user;
            return result;
        }

        throw new UnauthorizedException('Invalid credentials');
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto);
        const payload = { email: user.email, sub: user.id, role: user.role };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }

    async register(body: any) {
        const { name, email, password, role } = body;

        const existing = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existing) {
            throw new UnauthorizedException('User already exists with this email');
        }

        const user = await this.prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    name,
                    email,
                    password,
                    role: role || 'BUSINESS',
                },
            });

            // If user is a business owner, create a default profile
            if (newUser.role === 'BUSINESS') {
                await tx.businessProfile.create({
                    data: {
                        userId: newUser.id,
                        name: newUser.name || 'My Business',
                        description: 'Business description',
                        contactEmail: newUser.email,
                    },
                });
            }

            return newUser;
        });

        return this.login({ email, password });
    }
}
