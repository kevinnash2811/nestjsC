import { Controller, Patch, Param, Body, Inject, Logger } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HanrtPlanificadorPatchService } from '../service/hanrt_planificador-patch.service';
import { UpdateStateHanrtPlanificadorDto } from '../dto/update-hanrt_planificador.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@ApiBearerAuth()
@ApiTags('Planificaciones')
@Controller('hanrt_planificador')
export class HanrtPlanificadorPatchController {
  constructor(
    private readonly hanrtPlanificadorPatchService: HanrtPlanificadorPatchService,
    @Inject('PLANNING_STATE') private readonly clientPlanningState: ClientProxy,
    @Inject('PLANNING_AUDIT') private readonly clientPlanningAudit: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  @Patch('state/:idPlanificador')
  @ApiOperation({ summary: 'Actualiza el estado de una planificacion' })
  @ApiResponse({ status: 200, description: 'Actualización exitosa' })
  @ApiResponse({ status: 400, description: 'Actualización fallida' })
  @ApiParam({
    name: 'idPlanificador',
    type: 'string',
    required: true,
    description: 'ID de la cuenta',
    example: '63f305c2-4135-7f58-4492-66a6e4c5527f',
  })
  @ApiBody({
    description: 'Estado a cambiar',
    type: UpdateStateHanrtPlanificadorDto,
  })
  async updateStatus(
    @Param('idPlanificador') idPlanificador: string,
    @Body() nuevoEstado: UpdateStateHanrtPlanificadorDto,
  ) {
    const queue = `${this.configService.getOrThrow<string>(
      'RABBITMQ_QUEUES.hanrt_planificador_reject.name',
    )}`;
    const queue_audit = `${this.configService.getOrThrow<string>(
      'RABBITMQ_QUEUES.hanrt_planificador_audit.name',
    )}`;
    if (nuevoEstado.estado === 'EP03') {
      this.clientPlanningState.emit(queue, {
        data: {
          planificadorId: [idPlanificador],
        },
      });
    }
    const plan = await this.hanrtPlanificadorPatchService.getPlanForAuditState(
      idPlanificador,
    );

    if (plan) {
      const { name } = plan;
      const estado = await this.hanrtPlanificadorPatchService.getStateById(
        nuevoEstado.estado,
      );
      this.clientPlanningAudit.emit(queue_audit, {
        data: [
          {
            type: '02',
            name: estado,
            date_entered: new Date(),
            date_modified: new Date(),
            modified_user_id: nuevoEstado.usuario,
            created_by: nuevoEstado.usuario,
            description: name,
            deleted: 0,
            assigned_user_id: nuevoEstado.usuario,
            estado_cliente: '',
            documento: '',
            nro_documento: '',
            nro_caso: '',
            tipo_documento: '',
            parent_type: 'HANRT_Planificador',
            parent_id: idPlanificador,
            account_id_c: '',
          },
        ],
      });
    }

    return this.hanrtPlanificadorPatchService.updateStatus(
      idPlanificador,
      nuevoEstado.estado,
      nuevoEstado.usuario,
    );
  }
}
