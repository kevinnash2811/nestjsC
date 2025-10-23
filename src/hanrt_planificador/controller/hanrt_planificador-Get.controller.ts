import { Controller, Get, Header, HttpException, HttpStatus, Logger, Param, Res } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { HanrtPlanificadorGetService } from '../service';
import { Response } from 'express';
import { PlanificadorHeaderDto, PlanificadorLogisticsDto } from '../dto';
import { TareaLogisticDto } from 'src/hanrt_tareasplan/dto';
import { UserPlanningDto } from 'src/users/dto';

@ApiBearerAuth()
@ApiTags('Planificaciones')
@Controller('hanrt_planificador')
export class HanrtPlanificadorGetController {
  constructor(
    private readonly hanrtPlanificadorGetService: HanrtPlanificadorGetService,
  ) {}

  /**
   *
   * @param idPlanificador Id del planificador de la tabla hanrt_planificador
   * @returns Object
   */
  @Get(':idPlanificador')
  @ApiOperation({
    summary: 'Obtiene todo el detalle JSON de una planificación',
  })
  @ApiParam({
    name: 'idPlanificador',
    type: 'string',
    required: true,
    description: 'ID de un registro de planificación',
    example: 'be724512-40f5-d80a-407d-6687fa2b0c4d',
  })
  hanrtPlanificador(@Param('idPlanificador') idPlanificador: string) {
    return this.hanrtPlanificadorGetService.getPlanificador(idPlanificador);
  }

  @Get('rutas/:planificadorId')
  @ApiOperation({
    summary: 'Obtener las rutas de una planificación por ID',
  })
  @ApiParam({
    name: 'planificadorId',
    description: 'ID de la planificación',
  })
  getRutasByPlanificadorId(@Param('planificadorId') planificadorId: string) {
    return this.hanrtPlanificadorGetService.getRutasByPlanificadorId(
      planificadorId,
    );
  }

  /*** OBTIENE TODAS LAS PLANIFICACIONES */
  @Get()
  @ApiOperation({
    summary: 'Obtiene todo el detalle JSON de todas las planificaciones',
  })
  all_hanrt_planificador() {
    return this.hanrtPlanificadorGetService.getAllPlanificador();
  }

  @Get('vehiculos/:planificadorId')
  @ApiOperation({
    summary: 'Obtiene todos los vehiculos de una planificación de rutas',
  })
  async downloadAllHanrtPlanificador(
    @Param('planificadorId') planificadorId: string
  ) {
    try {
      return this.hanrtPlanificadorGetService.getVehiculosPlanificador(planificadorId);
    } catch (error) {
      console.error('Error al descargar el archivo JSON:', error);
      throw new HttpException('Error al resolver vehiculos del plan ', HttpStatus.BAD_REQUEST)
    }
  }

  @Get('/header/:planId')
  @ApiOperation({
    summary: 'Obtener el header de una planificación',
  })
  @ApiOkResponse({
    description: 'Devuelve el header de una planificación',
    type: PlanificadorHeaderDto,
  })
  @ApiNotFoundResponse({
    description: 'Planificador no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Planificador no encontrado',
      }
    }
  })
  async getPlanningHeader(@Param('planId') planId: string) {
    return this.hanrtPlanificadorGetService.getPlanningHeader(planId);
  }

  @Get('/logistics/:planId')
  @ApiOperation({
    summary: 'Obtener el header de una planificación',
  })
  @ApiOkResponse({
    description: 'Logisticas de planificacion',
    type: PlanificadorLogisticsDto
  })
  async getPlanningLogistics(@Param('planId') planId: string) {
    return this.hanrtPlanificadorGetService.getPlanningLogistics(planId);
  }
}
