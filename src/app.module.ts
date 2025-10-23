import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountCustom } from './accounts/entities';
import { UsersSupervisor } from './users/entities/users_supervisor.entity';
import { HanrtPlanificadorModule } from './hanrt_planificador/hanrt_planificador.module';
import { HaneEntregasModule } from './hane_entregas/hane_entregas.module';
import { AccountsModule } from './accounts/accounts.module';
import { UsersModule } from './users/users.module';
import { FieldsManifestModule } from './hanrt_fieldsmanifest/fieldsmanifest.module';
import { HansVehiculosModule } from './hans_vehiculos/hans_vehiculos.module';
import { ProducerRabbitModule } from './producer_rabbit/producer_rabbit.module';
import { TasksModule } from './hanrt_tareasplan/hanrt_tareasplan.module';
import { HanrtTerritoriosModule } from './hanrt_territorios/hanrt_territorios.module';
import { HanrtZonasModule } from './hanrt_zonas/hanrt_zonas.module';
import { MarcadoresModule } from './jjwg_markers/marcadores.module';
import {
  HanrtPlanificadorEntity,
  HanrtPlanificadorHanrtItemgroupEntity,
  HanrtPlanificadorHansVehiculosEntity,
} from './hanrt_planificador/entities';
import { HanrtPlanificadorHanaRelacionesEntity } from './hana_relaciones/entities';
import {
  HanrtItemGroupEntity,
  HanrtItemgroupHanrtItemrutaEntity,
  HanrtItemgroupHansVehiculosEntity,
} from './hanrt_itemgroup/entities';
import {
  HanrtItemrutaAccountsEntity,
  HanrtItemrutaContactsEntity,
  HanrtItemrutaEntity,
  HanrtItemrutaHaneEntregasEntity,
  HanrtItemrutaHanrtTareasPlanEntity,
} from './hanrt_itemruta/entities';
import { HanrtConductorModule } from './hanrt_conductor/hanrt_conductor.module';
import { MailModule } from './mailer/mailer.module';
import { EnvConfiguration } from './config/nacos.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HaneEntregas } from './hane_entregas/entities/hane_entregas.entity';
import { HanrtCiclosModule } from './hanrt_ciclos/hanrt_ciclos.module';
import { HanrtCiclosEntity } from './hanrt_ciclos/entities';
import { HanrtTerritoriosEntity } from './hanrt_territorios/entities';
import { HanrtZonasEntity } from './hanrt_zonas/entities';
import { HanrtMarkersEntity } from './hanrt_zonas/entities';
import { HanrtMarkersCstmEntity } from './hanrt_zonas/entities';
import { HanrtZonasMarkersEntity } from './hanrt_zonas/entities';
import { HanrtMarkersEntity2 } from './jjwg_markers/entities';
import { HanrtMarkersCstmEntity2 } from './jjwg_markers/entities';
import { HanrtZonasMarkersEntity2 } from './jjwg_markers/entities';
import { HanrtTerritoriosZonasEntity } from './hanrt_zonas/entities';
import { HansacrmList } from './hansacrm_list/entities/hansacrm_list.entity';
import { HanrtGestionTnpEntity } from './hanrt_gestiontnp/entities/hanrt_gestiontnp.entity';
import { HanrtGestionTnpModule } from './hanrt_gestiontnp/hanrt_gestiontnp.module';
import { FieldsManifest } from './hanrt_fieldsmanifest/entities/fieldsmanifest.entity';
import { ContactsModule } from './contacts/contacts.module';
import { EspecialidadesModule } from './hanvc_especialidades/especialidades.module';
import { HanrtCiclosUsersEntity } from './hanrt_ciclos/entities/hanrt_ciclos_users_c';
import { HanrtCiclosHanrtFrecuenciasEntity } from './hanrt_ciclos/entities/hanrt_ciclos_hanrt_frecuencias_c';
import { HanrtFrecuenciasEntity } from './hanrt_frecuencias/entities/hanrt_frecuencias.entity';
import { HanrtFrecuenciasDetalleModule } from './hanrt_frecuenciasdetalle/hanrt_frecuenciasdetalle.module';
import { HanrtFrecuenciasModule } from './hanrt_frecuencias/hanrt_frecuencias.module';
import { HanrtFrecuenciasDetalleEntity } from './hanrt_frecuenciasdetalle/entities/hanrt_frecuenciasdetalle.entity';
import { HanrtFrecuenciasHanrtFrecuenciaDetalleEntity } from './hanrt_frecuencias/entities/hanrt_frecuencias_hanrt_frecuenciadetalle_c';
import path from 'path';
import { User } from './hanrt_gestiontnp/entities/user.entity';
import { VersionModule } from './version/version.module';
import { HanrtCiclosHanrtPlanificadorC } from './hanrt_planificador/entities/hanrt_ciclos_hanrt_planificador_c.entity';
import { HanrtItemrutaModule } from './hanrt_itemruta/hanrt_itemruta.module';
import { HanrtItemgroupModule } from './hanrt_itemgroup/hanrt_itemgroup.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV.toLowerCase()}`,
      load: [EnvConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      name: 'DBCRM',
      useFactory: async (config: ConfigService) => {
        Logger.debug(`${config.get<string>('SQL_IP_HOST')}`, 'MSSQL');
        Logger.debug(`${Number(config.get('SQL_PORT'))}`, 'MSSQL');
        Logger.debug(`${config.get<string>('SQL_USER')}`, 'MSSQL');
        Logger.debug(`${config.get<string>('SQL_PASSWORD')}`, 'MSSQL');
        Logger.debug(`${config.get<string>('SQL_DATABASE')}`, 'MSSQL');

        return {
          type: 'mssql',
          host: `${config.get<string>('SQL_IP_HOST')}`,
          port: Number(config.get('SQL_PORT')),
          username: config.get('SQL_USER'),
          password: config.get('SQL_PASSWORD'),
          database: config.get('SQL_DATABASE'),
          entities: [
            AccountCustom,
            HanrtPlanificadorEntity,
            HanrtPlanificadorHansVehiculosEntity,
            HanrtPlanificadorHanaRelacionesEntity,
            HanrtPlanificadorHanrtItemgroupEntity,
            HanrtItemGroupEntity,
            HanrtItemgroupHansVehiculosEntity,
            HanrtItemgroupHanrtItemrutaEntity,
            HanrtItemrutaEntity,
            HanrtItemrutaAccountsEntity,
            HanrtItemrutaContactsEntity,
            HanrtItemrutaHanrtTareasPlanEntity,
            HanrtItemrutaHaneEntregasEntity,
            HaneEntregas,
            HanrtCiclosEntity,
            HanrtTerritoriosEntity,
            HanrtZonasEntity,
            HanrtTerritoriosZonasEntity,
            HanrtMarkersEntity,
            HanrtMarkersCstmEntity,
            HanrtZonasMarkersEntity,
             HanrtMarkersEntity2,
            HanrtMarkersCstmEntity2,
            HanrtZonasMarkersEntity2,
            HanrtCiclosHanrtFrecuenciasEntity,
            HanrtCiclosUsersEntity,
            HansacrmList,
            HanrtGestionTnpEntity,
            User,
            UsersSupervisor,
            FieldsManifest,
            HanrtFrecuenciasEntity,
            HanrtFrecuenciasDetalleEntity,
            HanrtFrecuenciasHanrtFrecuenciaDetalleEntity,
            HanrtCiclosHanrtPlanificadorC,
          ],
          synchronize: false,
          extra: {
            encrypt: false,
            enableArithAbort: true,
            requestTimeout: 60_000,
          },
          options: {
            useUTC: true,
          },
          // logging: ['error', 'warn', 'info', 'query', 'schema'],
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
      secret: 'HANSACRM4',
      signOptions: { expiresIn: 60 * 60 * 24 * 30 },
    }),
    AccountsModule,
    ContactsModule,
    HaneEntregasModule,
    HanrtPlanificadorModule,
    UsersModule,
    HansVehiculosModule,
    ProducerRabbitModule,
    TasksModule,
    HanrtTerritoriosModule,
    HanrtZonasModule,
    MarcadoresModule,
    HanrtConductorModule,
    MailModule,
    HanrtCiclosModule,
    HanrtGestionTnpModule,
    FieldsManifestModule,
    EspecialidadesModule,
    HanrtFrecuenciasModule,
    HanrtFrecuenciasDetalleModule,
    VersionModule,
    HanrtItemrutaModule,
    HanrtItemgroupModule,
    HealthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
