import { Logger, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProducerRabbitController } from './controller';
import { ProducerRabbitService } from './service';
import { EnvConfiguration } from 'src/config/nacos.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
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
  ],
  controllers: [ProducerRabbitController],
  providers: [ProducerRabbitService],
  exports: [ProducerRabbitService],
})
export class ProducerRabbitModule {}
