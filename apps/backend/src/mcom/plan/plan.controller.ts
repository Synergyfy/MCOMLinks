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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { McomSolutionApiKeyGuard } from '../mcom-solution-api-key.guard';
import { CreatePlanDto, UpdatePlanDto } from './plan.dto';
import { PlanService } from './plan.service';

@ApiTags('MCOM System Plans')
@Controller('api/v1/system/plans')
@UseGuards(McomSolutionApiKeyGuard)
export class SystemPlansController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  @ApiOperation({ summary: 'List all plans (active and inactive)' })
  listAll() {
    return this.planService.listPlans();
  }

  @Get('schema')
  @ApiOperation({
    summary: 'Get plan schema descriptors for dynamic Console form generation',
  })
  getSchema() {
    return this.planService.getSchema();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single plan by ID' })
  findOne(@Param('id') id: string) {
    return this.planService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new plan' })
  create(@Body() dto: CreatePlanDto) {
    return this.planService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing plan (partial)' })
  update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.planService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Archive/soft-delete a plan' })
  remove(@Param('id') id: string) {
    return this.planService.remove(id);
  }
}
