import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HansVehiculosPostService } from '../service';
import { FilterAdvancedVehiculosDto } from '../dto'
@ApiBearerAuth()
@ApiTags('Vehiculos')
@Controller('hans_vehiculos')
export class HansVehiculosPostController {
  constructor(
    private readonly hansVehiculosPostService: HansVehiculosPostService,
  ) {}

  @Post('list')
  @ApiOperation({
    summary: 'Obtener la lista de vehiculos paginados y filtrados',
  })
  allHansVehiculos(@Body() filterAdvancedDto: FilterAdvancedVehiculosDto) {
    return this.hansVehiculosPostService.listHansVehiculos(filterAdvancedDto);
  }

  @Post('hans-vehiculos-total')
  @ApiOperation({
    summary: 'Obtener el total del listado de vehiculos paginados y filtrados',
  })
  allTotalHansVehiculos(@Body() filterAdvancedDto: FilterAdvancedVehiculosDto) {
    return this.hansVehiculosPostService.listTotalHansVehiculos(
      filterAdvancedDto,
    );
  }
}
