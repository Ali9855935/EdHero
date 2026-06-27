import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EnrollmentqueryService } from './enrollmentquery.service';
import { CreateEnrollmentqueryDto } from './dto/create-enrollmentquery.dto';
import { UpdateEnrollmentqueryDto } from './dto/update-enrollmentquery.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/admins/schemas/admin.schema';

@Controller('enrollmentquery')
export class EnrollmentqueryController {
  constructor(private readonly enrollmentqueryService: EnrollmentqueryService) { }

  @Post('create-enrollmentquery')
  create(@Body() dto: CreateEnrollmentqueryDto) {
    return this.enrollmentqueryService.create(dto);
  }

  @Get('all-enrollmentqueries')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  findAll() {
    return this.enrollmentqueryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentqueryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnrollmentqueryDto: UpdateEnrollmentqueryDto) {
    return this.enrollmentqueryService.update(+id, updateEnrollmentqueryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentqueryService.remove(+id);
  }
}
