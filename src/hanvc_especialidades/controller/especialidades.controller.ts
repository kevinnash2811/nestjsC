import { EspecialidadesGetService } from '../service/especialidades-get.service';
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Especialidades')
@Controller('specialties')
export class EspecialidadesController {

  constructor(private readonly speService: EspecialidadesGetService) {}

  @Get()
  @ApiOperation({ summary: 'Get all specialties' })
  @ApiResponse({ status: 200, description: 'Return all specialties.' })
  async getAll(): Promise<any[]> {
    return this.speService.getAll();
  }
}