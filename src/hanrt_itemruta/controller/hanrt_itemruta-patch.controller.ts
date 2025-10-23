import { BadRequestException, Body, Controller, Inject, Patch } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HanrtItemrutaPatchService } from '../service';
import { VisitUpdateOrder } from '../types';

@ApiTags('Visita ~ Itemruta')
@Controller('hanrt_itemruta')
export class HanrtItemrutaPatchController {
  constructor(
    @Inject('PLANNING_STATE')
    private readonly clientPlanningState: ClientProxy,
    private readonly configService: ConfigService,
    private readonly hanrtItemrutaPatchService: HanrtItemrutaPatchService,
  ) {}

  @Patch('reject')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fecha: {
          type: 'string',
          format: 'date-time',
          example: '2023-10-01T00:00:00Z',
          description: 'Date of the item to reject',
        },
        items: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: [
            '0000a821-7ced-4d7e-a314-4d022d89233e',
            '00017160-4bbb-44e2-ad59-594f4894c5b9',
          ],
          description: 'Array of item IDs to reject',
        },
        estado: {
          type: 'string',
          example: 'RECHAZADO',
          description: 'Status of the item to reject',
        },
      },
    },
  })
  async reject(
    @Body()
    {
      items,
      fecha,
      estado,
    }: {
      items: string[];
      fecha: string;
      estado: string;
    },
  ) {
    const queue = `${this.configService.getOrThrow<string>(
      'RABBITMQ_QUEUES.hanrt_planificador_reject.name',
    )}`;

    this.clientPlanningState.emit(queue, {
      data: {
        items,
        fecha,
        estado,
      },
    });

    return true;
  }

  @Patch('reorder')
  @ApiBody({
    schema: {
      type: 'object',
      example: [
        {
          id: '0000a821-7ced-4d7e-a314-4d022d89233e',
          secuencia: 1,
          userId: '1',
          duracion: '2025-10-14T04:30:00Z',
          horaInicio: '2025-10-01T12:00:00Z',
          horaFin: '2025-10-01T16:30:00Z',
        },
        {
          id: '00017160-4bbb-44e2-ad59-594f4894c5b9',
          secuencia: 2,
          userId: '1',
          duracion: '2025-10-14T04:30:00Z',
          horaInicio: '2025-10-01T12:00:00Z',
          horaFin: '2025-10-01T16:30:00Z',
        }
      ]
    },
  })
  async reorder(
    @Body()
    data: VisitUpdateOrder[],
  ) {
    try {
      return this.hanrtItemrutaPatchService.reorderRoutes(data);
    } catch (error) {
      return new BadRequestException('Error reordenando las rutas');
    }
  }
}
