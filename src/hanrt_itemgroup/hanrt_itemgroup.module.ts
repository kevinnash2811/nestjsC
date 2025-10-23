import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HanrtItemGroupPatchController } from './controller/hanrt_itemgroup-patch.controller';
import { HanrtItemGroupRepository } from './repository/hanrt_itemgroup.repository';
import { HanrtItemGroupRelationsRepository } from './repository/itemgroup-relations.repository';
import { HanrtItemgroupService } from './service';
import { HanrtItemGroupGetController } from './controller/hanrt_itemgroup-get.controller';
import { HanrtItemrutaModule } from 'src/hanrt_itemruta/hanrt_itemruta.module';

@Module({
  imports: [
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
    ]),
    HanrtItemrutaModule,
  ],
  providers: [HanrtItemGroupRepository, HanrtItemGroupRelationsRepository, HanrtItemgroupService],
  controllers: [HanrtItemGroupPatchController, HanrtItemGroupGetController],
  exports: [HanrtItemGroupRepository],
})
export class HanrtItemgroupModule {}
