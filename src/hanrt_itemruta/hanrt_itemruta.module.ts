import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { HanrtItemrutaGetController } from './controller/hanrt_itemruta-get.controller';
import { HanrtItemrutaPatchController } from './controller/hanrt_itemruta-patch.controller';
import { HanrtItemrutaPostController } from './controller/hanrt_itemruta-post.controller';
import { ItemRutaGetService } from './service/hanrt_itemruta-get.service';
import { HanrtItemrutaPostV2Service } from './service/hanrt_itemruta-post-v2.service';
import { ProducerRabbitModule } from 'src/producer_rabbit/producer_rabbit.module';
import { HanrtItemRutaRepository } from './repository/itemruta.repository';
import { HanrtItemRutaRelationsRepository } from './repository/itemruta-relations.repository';
import { HanrtItemrutaPatchService } from './service';
@Module({
  imports: [
    FirebaseModule,
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
        name: 'PLANNING_SERVICE',
        useFactory: async (config: ConfigService) => {
          Logger.debug(
            `${config.get<string>('QUEUE_PLANIFICACION_NAME')}`,
            'RABBITMQ_PRODUCER',
          );
          Logger.debug(
            `${config.get<string>('RABBITMQ_URL')}`,
            'RABBITMQ_PRODUCER',
          );
          Logger.debug(
            `${config.get<string>('QUEUE_PLANIFICACION')}`,
            'RABBITMQ_PRODUCER',
          );
          return {
            name: 'PLANNING_SERVICE',
            transport: Transport.RMQ,
            options: {
              urls: [`${config.get<string>('RABBITMQ_URL')}`],
              queue: `${config.get<string>('QUEUE_PLANIFICACION')}`,
              queueOptions: {
                durable: false,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
    ProducerRabbitModule,
  ],
  controllers: [
    HanrtItemrutaPatchController,
    HanrtItemrutaGetController,
    HanrtItemrutaPostController,
  ],
  providers: [
    ItemRutaGetService, 
    HanrtItemrutaPatchService,
    HanrtItemrutaPostV2Service,
    HanrtItemRutaRepository,
    HanrtItemRutaRelationsRepository,
  ],
  exports: [HanrtItemRutaRepository, HanrtItemRutaRelationsRepository]
})
export class HanrtItemrutaModule {}
