import { Body, Controller, Inject, Patch } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Ruta ~ Itemgroup')
@Controller('hanrt_itemgroup')
export class HanrtItemGroupPatchController {
  constructor(
    @Inject('PLANNING_STATE')
    private readonly clientPlanningState: ClientProxy,
    private readonly configService: ConfigService,
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
        groups: {
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
      groups,
      fecha,
      estado,
    }: {
      groups: string[];
      fecha: string;
      estado: string;
    },
  ) {
    const queue = `${this.configService.getOrThrow<string>(
      'RABBITMQ_QUEUES.hanrt_planificador_reject.name',
    )}`;

    this.clientPlanningState.emit(queue, {
      data: {
        groups,
        fecha,
        estado,
      },
    });

    return true;
  }
}
