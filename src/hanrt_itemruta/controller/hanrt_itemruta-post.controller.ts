import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Logger,
  Post
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';
import { FirebaseService } from 'src/firebase/service';
import { HanrtItemrutaPostV2Service } from '../service/hanrt_itemruta-post-v2.service';

@ApiTags('Visita ~ Itemruta')
@Controller('hanrt_itemruta')
export class HanrtItemrutaPostController {
  constructor(
    private readonly configService: ConfigService,
    private readonly firebaseService: FirebaseService,
    @Inject('PLANNING_SERVICE') private readonly clientProxy: ClientProxy,
    private readonly hanrtItemrutaPostService: HanrtItemrutaPostV2Service, // private readonly producerRabbitService: ProducerRabbitService,
  ) {}

  @Post('reprogramar-visita')
  @ApiOperation({ summary: 'Reprograma una visita' })
  @ApiBody({
    description: 'ID de la visita a reprogramar',
    schema: {
      type: 'object',
      properties: {
        visitId: {
          type: 'string',
          example: '75765392-02bc-433a-adc0-a43cb1696af8',
          description: 'ID de la visita a reprogramar',
        },
        newDate: {
          type: 'string',
          example: '2024-12-31',
          description: 'Nueva fecha para la visita (formato YYYY-MM-DD)',
        },
      },
    },
  })
  async reprogramarVisita(
    @Body('visitId') visitaId: string,
    @Body('newDate') newDate: string,
  ) {
    if (!visitaId || !newDate) {
      throw new Error('visitId and newDate are required');
    }

    const isPlannedVisit = await this.hanrtItemrutaPostService.isPlannedVisit(
      visitaId,
    );

    if (isPlannedVisit) {
      const data = {
        itemrutaList: [visitaId],
        typePlanning: 'VISITA',
      };
      const result = await lastValueFrom<{status: string}>(this.clientProxy.send('planning-sync', { data }));

      if (!result) {
        throw new BadRequestException('Error al comunicar con el planificador');
      }

      const visit = await this.hanrtItemrutaPostService.cloneVisit(
        visitaId,
        newDate,
      );

      if (!visit) {
        throw new BadRequestException('No se encontró la visita proporcionada');
      }

      return {
        message: 'Visita reprogramada exitosamente',
        visitId: visit,
        newDate,
      };
    } else {
      const visit = await this.hanrtItemrutaPostService.cloneVisit(
        visitaId,
        newDate,
      );

      if (!visit) {
        throw new BadRequestException('No se encontró la visita proporcionada');
      }

      return {
        message: 'Visita reprogramada exitosamente',
        visitId: visit,
        newDate,
      };
    }
  }
}
