import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { HansVehiculosGetService } from "../service";

//@ApiBearerAuth()
@ApiTags('Vehiculos')
@Controller('hans_vehiculos')
export class HansVehiculosGetController {
  constructor(private readonly hansVehiculosGetService: HansVehiculosGetService) {}

  /**
   * 
   * @param plate placa del vehiculo por el cual se hace la busqueda
   * @returns JSON
   */
  
  @Get(':plate')
  @ApiOperation({ summary: 'Obtiene la información de un vehiculo y sus conductores de acuerdo a su placa' })
  @ApiParam({
    name: 'plate',
    type: 'string',
    required: true,
    description: 'placa del vehiculo para obtener su información',
    example: '7845 LOL',
  })
  findOneHansVehiculo(@Param('plate') plate: string){
    return this.hansVehiculosGetService.getHansVehiculosData(plate)
  }
}
