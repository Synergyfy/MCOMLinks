import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupportMessageDto, SupportMessageDto } from './dto/support.dto';

@Injectable()
export class SupportService {
    constructor(private readonly prisma: PrismaService) { }

    async getMessages(userId?: string): Promise<SupportMessageDto[]> {
        const messages = await this.prisma.supportMessage.findMany({
            where: userId ? { userId } : {},
            orderBy: { createdAt: 'asc' },
        });

        return messages.map((msg: any) => ({
            id: msg.id,
            text: msg.text,
            sender: msg.sender as 'user' | 'agent',
            time: msg.time,
            userId: msg.userId ?? undefined,
            createdAt: msg.createdAt,
        }));
    }

    async createMessage(data: CreateSupportMessageDto, userId?: string): Promise<SupportMessageDto> {
        const msg = await this.prisma.supportMessage.create({
            data: {
                text: data.text,
                sender: data.sender,
                time: data.time || new Date().toLocaleString(),
                userId: userId,
            },
        });

        return {
            id: msg.id,
            text: msg.text,
            sender: msg.sender as 'user' | 'agent',
            time: msg.time,
            userId: msg.userId ?? undefined,
            createdAt: msg.createdAt,
        };
    }
}
