import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { PlanService } from '../../mcom/plan/plan.service';
import { CreatePlanDto, UpdatePlanDto } from '../../mcom/plan/plan.dto';

@ApiTags('admin/plans')
@Controller('admin/plans')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminPlansController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  @ApiOperation({ summary: 'List all plans (active and inactive)' })
  listPlans() {
    return this.planService.listPlans();
  }

  @Get('schema')
  @ApiOperation({
    summary: 'Get plan schema descriptors for the admin configuration form',
  })
  getSchema() {
    return this.planService.getSchema();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single plan by ID' })
  getPlan(@Param('id') id: string) {
    return this.planService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new plan' })
  createPlan(@Body() dto: CreatePlanDto) {
    return this.planService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing plan (partial)' })
  updatePlan(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.planService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Archive/soft-delete a plan' })
  removePlan(@Param('id') id: string) {
    return this.planService.remove(id);
  }
}
