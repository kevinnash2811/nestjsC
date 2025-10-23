

import { Controller, Delete, Param }                         from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { HanrtPlanificadorDeleteService } from '../service';

@ApiBearerAuth()
@ApiTags('Planificaciones')
@Controller('hanrt_planificador')
export class HanrtPlanificadorDeleteController {

  constructor(private readonly hanrtPlanificadorDeleteService: HanrtPlanificadorDeleteService) {}

  @Delete('/delete/:idPlanificador')
  @ApiOperation({ summary: 'Elimina una planificación' })
  @ApiParam({
    name: 'idPlanificador',
    type: 'string',
    required: true,
    description: 'ID de un registro de planificación',
    example: 'be724512-40f5-d80a-407d-6687fa2b0c4d',
  })
  hanrtPlanificador(@Param('idPlanificador') idPlanificador: string){
    return this.hanrtPlanificadorDeleteService.deletePlanificador(idPlanificador)
  }
}