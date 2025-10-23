import {
  Body,
  Controller,
  Header,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HanrtPlanificadorPostService } from '../service';
import {
  SavePlanningDto,
  FilterAdvancedPlanificacionesDto,
  FilterAdvancedRutasDto,
  UpdatePlanningQueryDto,
  ClonePlanDto,
} from '../dto';
import { HanrtItemgroupPostService } from 'src/hanrt_itemgroup/service';

import { ProducerRabbitService } from 'src/producer_rabbit/service';
import { QueueConfig } from 'src/types';

import { SendPlanningQueueDto } from '../dto/send-planning-queue.dto';
import { UpdatePlanningDto } from '../dto/update-hanrt_planificador.dto';
import { IHanrtPlanificador, IRutaPLanning } from '../interface';
import { CreatePlanningQueryDto } from '../dto/create-planning.dto';
import { HanrtPlanificadorService } from '../service/hanrt_planificador.service';
import { ClientException } from '../helpers/client-exceptions.helper';

@ApiBearerAuth()
@ApiTags('Planificaciones')
@Controller('hanrt_planificador')
export class HanrtPlanificadorPostController {
  private readonly logger = new Logger(HanrtPlanificadorPostController.name);
  constructor(
    private readonly hanrtPlanificadorPostService: HanrtPlanificadorPostService,
    private readonly hanrtItemgroupPostService: HanrtItemgroupPostService,
    private readonly producerRabbitService: ProducerRabbitService,
    @Inject('HANRT_PLANIFICADOR')
    private readonly clientCreatePlanning: ClientProxy,
    private readonly configService: ConfigService,
    private readonly planificadorService: HanrtPlanificadorService,
  ) {}

  //* API PARA LA CREACIÓN DE UNA PLANIFICACIÓN
  @Post('/save')
  @ApiOperation({
    summary: 'Creacion de una planificación V2',
  })
  @ApiBody({
    description: 'Datos para crear nueva planificacion V2',
    type: SavePlanningDto,
  })
  async savePostHanrtPlanificador(@Body() savePlanningDto: SavePlanningDto) {
    try {
      return this.hanrtPlanificadorPostService.saveHanrtPlanificador2(
        savePlanningDto,
      );
    } catch (error) {
      console.log(error);
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Creacion de una planificación-vehiculos-vendedores-rutas',
  })
  @ApiBody({
    description: 'Datos para crear nueva planificacion conjunta',
    type: SavePlanningDto,
  })
  async savePlanning(@Body() savePlanningDto: SavePlanningDto) {
    let result = {
      planificador_response: {},
      vehiculos_response: {},
      relaciones_response: {},
      itemgroup_response: {},
    };

    result['planificador_response'] = await this.saveHanrtPlanificador(
      savePlanningDto.hanrtPlanificadorData,
    );

    for (let i = 0; i < savePlanningDto.idVehiculosList.length; i++) {
      result['vehiculos_response'][i] =
        await this.saveRelationshipPlanificadorVehiculo(
          result['planificador_response']['id_created_planner'],
          savePlanningDto.idVehiculosList[i],
        );
    }

    for (let i = 0; i < savePlanningDto.rutasEntregasList.length; i++) {
      result['itemgroup_response'][i] =
        await this.saveItemgroupAllRelationships(
          result['planificador_response']['id_created_planner'],
          savePlanningDto.rutasEntregasList[i],
        );
    }

    return result;
  }

  saveHanrtPlanificador(hanrtPlanificador: IHanrtPlanificador) {
    return this.hanrtPlanificadorPostService.saveHanrtPlanificador(
      hanrtPlanificador,
    );
  }

  saveRelationshipPlanificadorVehiculo(
    idPlanificador: string,
    idVehiculo: string,
  ) {
    return this.hanrtPlanificadorPostService.saveRelationshipPlanificadorVehiculo(
      idPlanificador,
      idVehiculo,
    );
  }

  saveItemgroupAllRelationships(
    idPlanificador: string,
    rutaPLanning: IRutaPLanning,
  ) {
    return this.hanrtItemgroupPostService.saveItemgroupAllRelationships(
      idPlanificador,
      rutaPLanning,
    );
  }

  @Post('sendToCreateQueue')
  @ApiOperation({
    summary: 'Envio de una planificación a la cola para su creación',
  })
  async sendDataPlanningToCreateQueue(@Body() data: CreatePlanningQueryDto) {
    this.logger.log({ data });
    const { name: queue } = this.configService.getOrThrow<QueueConfig>(
      `RABBITMQ_QUEUES.hanrt_planificador_save`,
    );
    this.clientCreatePlanning.emit(queue, data);

    const {
      name,
      description,
      iddivision,
      idamercado,
      region,
      canal,
      tipo,
      userId,
    } = data.headerPlan;
    const now = new Date();

    return {
      planificacion_id: '',
      planificacion_name: name,
      planificacion_description: description,
      planificacion_date_entered: now,
      planificacion_iddivision_c: iddivision,
      planificacion_division: '',
      planificacion_idamercado_c: idamercado,
      planificacion_amercado: '',
      planificacion_region_c: region,
      planificacion_region: '',
      planificacion_canal_c: canal,
      planificacion_tipo: tipo,
      planificacion_tipo_label: '',
      planificacion_estado: 'EP06',
      planificacion_estado_label: 'Procesando',
      planificacion_id_user: userId,
      total_rutas: data.groups.length,
      rutas: [],
    };
  }

  @Post('sendToQueue')
  @ApiOperation({
    summary: 'Envio de una planificación de tipo entrega a la cola',
  })
  @ApiBody({
    description: 'Ids de los itemruta para su registro en la cola',
    type: SendPlanningQueueDto,
  })
  saveDataPLanningToQueue(@Body() data: SendPlanningQueueDto) {
    return this.producerRabbitService.sendDataPlanningToQueue(data);
  }

  @Post('updatePlanning')
  @ApiOperation({
    summary: 'Actualizacion de una planificación-vehiculos-vendedores-rutas',
  })
  @ApiBody({
    description: 'Datos para actualizar una planificacion conjunta',
    type: UpdatePlanningDto,
  })
  async updatePlanning(@Body() updatePlanningDto: UpdatePlanningDto) {
    return this.hanrtPlanificadorPostService.updateAllPlanificador(
      updatePlanningDto,
    );
  }

  @Post('list')
  @ApiOperation({
    summary:
      'Obtener la lista de planificaciones filtradas por sus campos y los Id de los promotores',
  })
  @ApiBody({
    description: 'Id de los promotores y campos para el filtro ',
    type: FilterAdvancedPlanificacionesDto,
  })
  listPlanningByFilter(
    @Body() filterAdvancedDto: FilterAdvancedPlanificacionesDto,
  ) {
    return this.hanrtPlanificadorPostService.listPlanningByFilter(
      filterAdvancedDto,
    );
  }

  @Post('hanrt_planificador_total')
  @ApiOperation({
    summary:
      'Obtener el total de planificaciones filtradas por sus campos y los Id de los promotores',
  })
  @ApiBody({
    description: 'Id de los promotores y campos para el filtro ',
    type: FilterAdvancedPlanificacionesDto,
  })
  listTotalPlanningByFilter(
    @Body() filterAdvancedDto: FilterAdvancedPlanificacionesDto,
  ) {
    return this.hanrtPlanificadorPostService.listTotalPlanningByFilter(
      filterAdvancedDto,
    );
  }

  @Post('hanrt_itemruta_list')
  @ApiOperation({
    summary:
      'Obtener el total de rutas planificadas filtradas por sus campos y los Id de los promotores',
  })
  @ApiBody({
    description: 'Id de los promotores y campos para el filtro ',
    type: FilterAdvancedRutasDto,
  })
  listTotalPlanningActivitiesByFilter(
    @Body() FilterAdvancedRutasDto: FilterAdvancedRutasDto,
  ) {
    return this.hanrtPlanificadorPostService.listTotalPlanningActivitiesByFilter(
      FilterAdvancedRutasDto,
    );
  }

  @Post('hanrt_itemruta_total')
  @ApiOperation({
    summary:
      'Obtener el total de rutas planificadas filtradas por sus campos y los Id de los promotores',
  })
  @ApiBody({
    description: 'Id de los promotores y campos para el filtro ',
    type: FilterAdvancedRutasDto,
  })
  listTotalVisitsByFilter(
    @Body() FilterAdvancedRutasDto: FilterAdvancedRutasDto,
  ) {
    return this.hanrtPlanificadorPostService.listTotalVisitsByFilter(
      FilterAdvancedRutasDto,
    );
  }

  @Post('create-v2')
  @ApiOperation({
    summary: 'V2 de creación de nueva planificación',
  })
  @ApiBody({
    description: 'Datos de creación',
    type: CreatePlanningQueryDto,
  })
  createV2(@Body() data: CreatePlanningQueryDto) {
    try {
      Logger.log({ data });
      return this.planificadorService.createNewPlanning(data);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('update-v2')
  @ApiOperation({
    summary: 'Version 2 de actualizacion de una planificacion',
  })
  @ApiBody({
    description: 'Datos de actualizacion de datos',
    type: UpdatePlanningQueryDto,
  })
  updateV2(@Body() data: UpdatePlanningQueryDto) {
    return this.planificadorService.updatePlanning(data);
  }

  @Post('reporte')
  @ApiOperation({
    summary: 'Obtener el reporte de una planificación por ID',
  })
  @ApiBody({
    type: 'object',
    schema: {
      type: 'array',
      items: {
        type: 'string',
        example: 'be724512-40f5-d80a-407d-6687fa2b0c4d',
      },
    },
  })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename="archivo.xlsx"')
  async getReporteByPlanificadorId(@Body() planificadorIds: string[]) {
    const buffer =
      await this.hanrtPlanificadorPostService.getReporteByPlanificadorId(
        planificadorIds,
      );

    return buffer;
  }

  @Post('clone')
  @ApiOperation({
    summary: 'Clona un plan promocional',
  })
  @ApiBody({
    description: 'Id de la planificación y nuevo nombre',
    type: ClonePlanDto,
  })
  clonePlan(@Body() data: ClonePlanDto) {
    return this.planificadorService.clonePlanning(data);
  }
}
