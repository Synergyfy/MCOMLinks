import { Module } from '@nestjs/common';
import { AgentCommController } from './comm.controller';
import { AgentCommService } from './comm.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AgentCommController],
  providers: [AgentCommService],
  exports: [AgentCommService],
})
export class AgentCommModule {}
