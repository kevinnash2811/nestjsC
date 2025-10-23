import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  HanrtItemgroupPatchService,
  HanrtItemgroupPostService,
} from 'src/hanrt_itemgroup/service';
import {
  HanrtItemrutaPatchService,
  HanrtItemrutaPostService,
} from 'src/hanrt_itemruta/service';
import { ProducerRabbitModule } from 'src/producer_rabbit/producer_rabbit.module';
import {
  HanrtPlanificadorDeleteController,
  HanrtPlanificadorGetController,
  HanrtPlanificadorPatchController,
  HanrtPlanificadorPostController,
} from './controller';
import {
  HanrtPlanificadorDeleteService,
  HanrtPlanificadorGetService,
  HanrtPlanificadorPatchService,
  HanrtPlanificadorPostService,
} from './service';
import { PlanificadorDeletionsRepository, PlanificadorInsertsRepository, PlanificadorUpdatesRespository } from './repository';
import { HanrtPlanificadorRepository } from './repository/planificador.repository';
import { QueueConfig } from 'src/types';
import { HanrtPlanificadorWs } from './events/hanrt_planificador.ws';
import { HanrtItemgroupModule } from 'src/hanrt_itemgroup/hanrt_itemgroup.module';
import { HanrtPlanificadorService } from './service/hanrt_planificador.service';
import { HanrtItemrutaModule } from 'src/hanrt_itemruta/hanrt_itemruta.module';
import { HanrtPlanificadorRelationsRepository } from './repository/planificador-relations.repository';

@Module({
  controllers: [
    HanrtPlanificadorPostController,
    HanrtPlanificadorGetController,
    HanrtPlanificadorPatchController,
    HanrtPlanificadorDeleteController,
  ],
  providers: [
    HanrtPlanificadorPostService,
    HanrtPlanificadorGetService,
    HanrtItemgroupPostService,
    HanrtPlanificadorPatchService,
    HanrtItemgroupPatchService,
    HanrtItemrutaPatchService,
    HanrtItemrutaPostService,
    HanrtPlanificadorDeleteService,
    HanrtPlanificadorService,
    PlanificadorInsertsRepository,
    PlanificadorUpdatesRespository,
    PlanificadorDeletionsRepository,
    HanrtPlanificadorRepository,
    HanrtPlanificadorRelationsRepository,
    HanrtPlanificadorWs
  ],
  imports: [
    ProducerRabbitModule,
    HanrtItemgroupModule,
    HanrtItemrutaModule,
    HttpModule,
    ClientsModule.registerAsync([
      {
        name: 'PLANNING_STATE',
        useFactory: async (config: ConfigService) => {
          const queue = `${config.getOrThrow<string>(
              'RABBITMQ_QUEUES.hanrt_planificador_reject.name',
            )}`;

          const queueError = config.getOrThrow<string>(
            'RABBITMQ_QUEUES.hanrt_planificador_reject.queueError',
          );

          return {
            name: 'PLANNING_STATE',
            transport: Transport.RMQ,
            options: {
              urls: [`${config.get<string>('RABBITMQ_URL')}`],
              queue,
              queueOptions: {
                durable: true,
                arguments: {
                  'x-dead-letter-exchange': 'dlx',
                  'x-dead-letter-routing-key': queueError,
                },
              },
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: 'PLANNING_AUDIT',
        useFactory: async (config: ConfigService) => {
          const queue = `${config.getOrThrow<string>(
              'RABBITMQ_QUEUES.hanrt_planificador_audit.name',
            )}`;

          const queueError = config.getOrThrow<string>(
            'RABBITMQ_QUEUES.hanrt_planificador_audit.queueError',
          );

          return {
            name: 'PLANNING_AUDIT',
            transport: Transport.RMQ,
            options: {
              urls: [`${config.get<string>('RABBITMQ_URL')}`],
              queue,
              queueOptions: {
                durable: true,
                arguments: {
                  'x-dead-letter-exchange': 'dlx',
                  'x-dead-letter-routing-key': queueError,
                },
              },
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: 'HANRT_PLANIFICADOR',
        useFactory: async (configService: ConfigService) => {          
          const { name: queue, queueError } =
            configService.getOrThrow<QueueConfig>(`RABBITMQ_QUEUES.hanrt_planificador_save`);

          Logger.debug(queue, 'RABBITMQ_PRODUCER');
          return {
            name: 'HANRT_PLANIFICADOR',
            transport: Transport.RMQ,
            options: {
              urls: [`${configService.get<string>('RABBITMQ_URL')}`],
              queue,
              queueOptions: {
                durable: true,
                arguments: {
                  'x-dead-letter-exchange': 'dlx',
                  'x-dead-letter-routing-key': queueError,
                },
              },
            },
          };
        },
        inject: [ConfigService],
      }
    ]),
  ],
})
export class HanrtPlanificadorModule {}
