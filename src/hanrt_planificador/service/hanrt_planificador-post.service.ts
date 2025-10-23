import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as querystring from 'node:querystring';
import {
  HanrtItemGroupEntity,
  HanrtItemgroupHanrtItemrutaEntity,
  HanrtItemgroupHansVehiculosEntity,
} from 'src/hanrt_itemgroup/entities';
import { IHanrtItemgroup } from 'src/hanrt_itemgroup/interface';
import { IHanrtItemruta } from 'src/hanrt_itemruta/interfaces';
import { EntityManager } from 'typeorm';
import { SavePlanningDto, UpdatePlanningDto } from '../dto';
import {
  FilterAdvancedPlanificacionesDto,
  FilterAdvancedRutasDto,
} from '../dto/advanced-filter.dto';
import {
  HanrtPlanificadorEntity,
  HanrtPlanificadorHanrtItemgroupEntity,
  HanrtPlanificadorHansVehiculosEntity,
} from '../entities';
import {
  hanr_planificador,
  IHanrtPlanificador,
  IRutaPLanning,
  typeUpdateItem,
} from '../interface';

import {
  HanrtItemrutaAccountsEntity,
  HanrtItemrutaContactsEntity,
  HanrtItemrutaEntity,
  HanrtItemrutaHaneEntregasEntity,
  HanrtItemrutaHanrtTareasPlanEntity,
} from 'src/hanrt_itemruta/entities';

import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import * as ExcelJS from 'exceljs';
import moment from 'moment';
import { HaneEntregas } from 'src/hane_entregas/entities/hane_entregas.entity';
import { v4 as uuidv4 } from 'uuid';
import { HanrtCiclosHanrtPlanificadorC } from '../entities/hanrt_ciclos_hanrt_planificador_c.entity';
import { HanrtPlanificadorWs } from '../events/hanrt_planificador.ws';
import {
  HanrtPlanificadorRepository,
  ResUpdate,
} from '../repository/planificador.repository';
@Injectable()
export class HanrtPlanificadorPostService {
  SQL_DATABASE: string;
  SQL_SCHEMA: string;
  HANSACRM3: string;
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly plannRepo: HanrtPlanificadorRepository,
    @Inject('PLANNING_AUDIT') private readonly clientPlanningAudit: ClientProxy,
    private readonly hanrtPlanificadorWs: HanrtPlanificadorWs,
  ) {
    this.SQL_DATABASE = this.configService.get('SQL_DATABASE');
    this.SQL_SCHEMA = this.configService.get('SQL_SCHEMA');
    this.HANSACRM3 = this.configService.get('HANSACRM3');
  }

  async saveHanrtPlanificador2(iHanrtPlanificador: SavePlanningDto) {
    const queryRunner = this.mssqlEntityManager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const { hanrtPlanificadorData, idVehiculosList, rutasEntregasList } =
        iHanrtPlanificador;

      const result_planificador = await this.saveHanrt_Planificador(
        queryRunner.manager,
        hanrtPlanificadorData,
      );

      await this.saveRelationshipCiclo(
        queryRunner.manager,
        result_planificador,
        hanrtPlanificadorData.cycleId,
      );

      await this.saveRelationshipPlannerVehicle(
        queryRunner.manager,
        result_planificador,
        idVehiculosList,
      );

      await this.saveRelationshipHanrtItemRuta(
        queryRunner.manager,
        result_planificador,
        rutasEntregasList,
        iHanrtPlanificador.hanrtPlanificadorData.cycleId,
      );

      await queryRunner.commitTransaction();

      this.hanrtPlanificadorWs.server.emit('hanrt_planificador@save', {
        roomId: hanrtPlanificadorData.id,
        estado: 'COMPLETADO',
        id: hanrtPlanificadorData.id,
      });
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async saveHanrt_Planificador(
    manager: EntityManager,
    hanrtPlanificadorData: IHanrtPlanificador,
  ) {
    try {
      const newPlanificador = manager.create(HanrtPlanificadorEntity, {
        id: uuidv4(),
        name: hanrtPlanificadorData.name,
        date_entered: new Date(new Date().setHours(new Date().getHours())),
        date_modified: new Date(new Date().setHours(new Date().getHours())),
        modified_user_id: hanrtPlanificadorData.userId,
        created_by: hanrtPlanificadorData.userId,
        description: hanrtPlanificadorData.description,
        deleted: 0,
        id_tenant: hanrtPlanificadorData.id,
        assigned_user_id: hanrtPlanificadorData.userId,
        tipo: hanrtPlanificadorData.tipo,
        iddivision_c: hanrtPlanificadorData.iddivisionC,
        idamercado_c: hanrtPlanificadorData.idamercadoC,
        region_c: hanrtPlanificadorData.regionC,
        canal_c: hanrtPlanificadorData.canalC,
        estado_planificacion_c: hanrtPlanificadorData.estadoPlanificacionC,
        fecha_inicio_c: new Date(
          new Date(hanrtPlanificadorData.fechaInicioC).setHours(
            new Date(hanrtPlanificadorData.fechaInicioC).getHours() + 4,
          ),
        ),
        fecha_fin_c: new Date(
          new Date(hanrtPlanificadorData.fechaFinC).setHours(
            new Date(hanrtPlanificadorData.fechaFinC).getHours() + 4,
          ),
        ),
      });

      // Guardamos la nueva planificación utilizando el manager de la transacción
      const result = await manager.save(newPlanificador);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  /** FUNCION PARA GUARDAR LA RELACION DE PLANIFICACION CON VEHICULOS */
  async saveRelationshipPlannerVehicle(
    manager: EntityManager,
    result_planificador: hanr_planificador,
    idVehiculosList: string[],
  ) {
    try {
      // Usamos Promise.all para ejecutar las inserciones en paralelo y esperar a que todas terminen
      const savePromises = idVehiculosList.map((vehiculoId) =>
        manager.save(HanrtPlanificadorHansVehiculosEntity, {
          id: uuidv4(),
          date_modified: new Date(),
          deleted: 0,
          hanrt_planificador_hans_vehiculoshanrt_planificador_ida:
            result_planificador.id, // ID del planificador
          hanrt_planificador_hans_vehiculoshans_vehiculos_idb: vehiculoId, // ID del vehículo actual
        }),
      );

      // Ejecutamos todas las promesas en paralelo
      await Promise.all(savePromises);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async saveRelationshipCiclo(
    manager: EntityManager,
    result_planificador: hanr_planificador,
    cycleId: string,
  ) {
    try {
      const relation = manager.create(HanrtCiclosHanrtPlanificadorC, {
        id: uuidv4(),
        date_modified: new Date(),
        deleted: 0,
        hanrt_ciclos_hanrt_planificadorhanrt_planificador_idb:
          result_planificador.id,
        hanrt_ciclos_hanrt_planificadorhanrt_ciclos_ida: cycleId,
      });

      await manager.save(relation);
    } catch (error) {
      console.log(error);
    }
  }

  /** FUNCION PARA GUARDAR HANRT_ItemGroup, hanrt_planificador_hans_vehiculos_c*/
  async saveRelationshipHanrtItemRuta(
    manager: EntityManager,
    result_planificador: hanr_planificador,
    rutasEntregasList: IRutaPLanning[],
    cycleId: string,
  ) {
    try {
      // Usamos Promise.all para ejecutar las inserciones en paralelo y esperar a que todas terminen
      const savePromises = rutasEntregasList.map(async (rutaEntrega) => {
        const { ruta, entregas } = rutaEntrega;
        // Guardamos HANRT_ItemGroup y hanrt_planificador_hans_vehiculos_c
        const result_HanrtItemGroup = await this.saveHanrtItemGroup(
          manager,
          ruta,
          result_planificador,
        );
        await this.saveHanrtItemRuta(
          manager,
          result_HanrtItemGroup,
          entregas,
          cycleId,
        );
        //return result_HanrtItemGroup
        //return this.saveHanrtItemGroup(manager, ruta, result_planificador);
      });
      await Promise.all(savePromises);
    } catch (error) {
      console.log(error);
    }
  }
  //** FUNCION PARA GUARDAR HANRT_ItemGroup y hanrt_planificador_hans_vehiculos_c*/
  async saveHanrtItemGroup(
    manager: EntityManager,
    ruta: IHanrtItemgroup,
    result_planificador: hanr_planificador,
  ) {
    try {
      // Guardamos el group
      const newHanrtItemGroup = manager.create(HanrtItemGroupEntity, {
        id: uuidv4(),
        name: ruta.name,
        date_entered: new Date(new Date().setHours(new Date().getHours() + 4)),
        date_modified: new Date(new Date().setHours(new Date().getHours() + 4)),
        modified_user_id: ruta.userId,
        created_by: ruta.userId,
        description: ruta.description,
        deleted: 0,
        id_tenant: '0',
        assigned_user_id: ruta.userId,
        fecha_plan_c: new Date(
          new Date(ruta.fechaPlanC).setHours(
            new Date(ruta.fechaPlanC).getHours() + 4,
          ),
        ), // Sumar 4 horas,
        capacidad_c: ruta.capacidadC,
        hora_inicio_c: new Date(
          new Date(ruta.horaInicioC).setHours(
            new Date(ruta.horaInicioC).getHours() + 4,
          ),
        ), // Sumar 4 horas,
        duracion_c: new Date(
          new Date(ruta.duracionC).setHours(
            new Date(ruta.duracionC).getHours() + 4,
          ),
        ), // Sumar 4 horas,
        hora_fin_c: new Date(
          new Date(ruta.horaFinC).setHours(
            new Date(ruta.horaFinC).getHours() + 4,
          ),
        ), // Sumar 4 horas,
        secuencia_c: `${ruta.secuenciaC}`,
        bloqueado_c: ruta.bloqueadoC,
      });
      const result_HanrtItemGroup = await manager.save(newHanrtItemGroup);

      // Guardamos la relacion del planificador con el group
      const newHanrtPlanificadorHanrtItemGroup = manager.create(
        HanrtPlanificadorHanrtItemgroupEntity,
        {
          id: uuidv4(),
          date_modified: new Date(),
          deleted: 0,
          hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida:
            result_planificador.id,
          hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb:
            result_HanrtItemGroup.id,
        },
      );
      await manager.save(newHanrtPlanificadorHanrtItemGroup);

      //Guardamos la relacion del hanrt_itemgroup con hans_vehiculos
      const newHanrtItemgroupHansVehiculos = manager.create(
        HanrtItemgroupHansVehiculosEntity,
        {
          id: uuidv4(),
          date_modified: new Date(),
          deleted: 0,
          hanrt_itemgroup_hans_vehiculoshans_vehiculos_ida: ruta.idVehiculo,
          hanrt_itemgroup_hans_vehiculoshanrt_itemgroup_idb:
            result_HanrtItemGroup.id,
        },
      );
      await manager.save(newHanrtItemgroupHansVehiculos);

      return result_HanrtItemGroup;
    } catch (error) {
      console.log(error);
    }
  }
  //** FUNCION PARA GUARDAR HANRT_ItemRuta */
  async saveHanrtItemRuta(
    manager: EntityManager,
    result_HanrtItemGroup: HanrtItemGroupEntity,
    entregas: IHanrtItemruta[],
    cycleId: string,
  ) {
    try {
      const savePromises = entregas.map(async (entrega) => {
        Logger.debug({ entrega });
        // Guardamos el Hanrt_ItemRuta
        const newHanrtItemRuta = manager.create(HanrtItemrutaEntity, {
          id: uuidv4(),
          name: entrega.name,
          date_entered: new Date(),
          date_modified: new Date(),
          modified_user_id: entrega.userId,
          created_by: entrega.userId,
          description: entrega.description,
          deleted: 0,
          id_tenant: '0',
          assigned_user_id: entrega.userId,
          tipo_visita_c: entrega.tipoVisitaC,
          tipo_visita_hbm_c: entrega.tipoVisitaHbmC,
          fecha_inicio_c: new Date(
            new Date(entrega.fechaInicioC).setHours(
              new Date(entrega.fechaInicioC).getHours() + 4,
            ),
          ), // Sumar 4 horas,,
          hora_inicio_c: new Date(
            new Date(entrega.horaInicioC).setHours(
              new Date(entrega.horaInicioC).getHours() + 4,
            ),
          ), // Sumar 4 horas,,
          duracion_c: new Date(
            new Date(entrega.duracionC).setHours(
              new Date(entrega.duracionC).getHours() + 4,
            ),
          ),
          fecha_fin_c: new Date(
            new Date(entrega.fechaFinC).setHours(
              new Date(entrega.fechaFinC).getHours() + 4,
            ),
          ),
          hora_fin_c: new Date(
            new Date(entrega.horaFinC).setHours(
              new Date(entrega.horaFinC).getHours() + 4,
            ),
          ),
          secuencia_c: entrega.secuenciaC,
          jjwg_maps_lat_c: String(entrega.latitud),
          jjwg_maps_lng_c: String(entrega.longitud),
        });
        const result_HanrtItemRuta = await manager.save(newHanrtItemRuta);

        //** GUARDAMOS LA RELACION DE Hanrt_ItemRuta con Hanrt_ItemGroup */
        const newHanrtItemgroupHanrtItemrutaEntity = manager.create(
          HanrtItemgroupHanrtItemrutaEntity,
          {
            id: uuidv4(),
            date_modified: new Date(
              new Date().setHours(new Date().getHours() + 4),
            ),
            deleted: 0,
            hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida:
              result_HanrtItemGroup.id,
            hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb:
              result_HanrtItemRuta.id,
          },
        );
        await manager.save(newHanrtItemgroupHanrtItemrutaEntity);

        //** GUARDAMOS LA RELACION DE Hanrt_ItemRuta con hanrt_itemruta_accounts_c*/
        const newHanrtItemrutaAccountsEntity = manager.create(
          HanrtItemrutaAccountsEntity,
          {
            id: uuidv4(),
            date_modified: new Date(
              new Date().setHours(new Date().getHours() + 4),
            ),
            deleted: 0,
            hanrt_itemruta_accountsaccounts_ida: entrega.idAccount,
            hanrt_itemruta_accountshanrt_itemruta_idb: result_HanrtItemRuta.id,
          },
        );
        await manager.save(newHanrtItemrutaAccountsEntity);

        //** GUARDAMOS LA RELACION DE Hanrt_ItemRuta con hanrt_itemruta_contacts_c */
        if (entrega.idContact) {
          const newHanrtItemrutaContactsEntity = manager.create(
            HanrtItemrutaContactsEntity,
            {
              id: uuidv4(),
              date_modified: new Date(
                new Date().setHours(new Date().getHours() + 4),
              ),
              deleted: 0,
              hanrt_itemruta_contactscontacts_ida: entrega.idContact,
              hanrt_itemruta_contactshanrt_itemruta_idb:
                result_HanrtItemRuta.id,
            },
          );

          await manager.save(newHanrtItemrutaContactsEntity);
        }
        //** GUARDAMOS LA RELACION DE Hanrt_ItemRuta con hanrt_itemruta_hanrt_tareasplan_c */
        const validToAddTasks = await this.plannRepo.validateTareaEntregaExists(
          cycleId,
          entrega.nroVisita,
          entrega.userId,
          entrega.idContact,
        );
        if (validToAddTasks) {
          const tareasPromises = entrega.tareasPlan?.length
            ? entrega.tareasPlan.map(async (idTarea) => {
                const newHanrtItemrutaHanrtTareasPlanEntity = manager.create(
                  HanrtItemrutaHanrtTareasPlanEntity,
                  {
                    id: uuidv4(),
                    date_modified: new Date(
                      new Date().setHours(new Date().getHours() + 4),
                    ),
                    deleted: 0,
                    hanrt_itemruta_hanrt_tareasplanhanrt_itemruta_ida:
                      result_HanrtItemRuta.id,
                    hanrt_itemruta_hanrt_tareasplanhanrt_tareasplan_idb:
                      idTarea,
                  },
                );
                await manager.save(newHanrtItemrutaHanrtTareasPlanEntity);
              })
            : []; // Si no hay tareas, no se genera ninguna promesa

          await Promise.all(tareasPromises); // Esperamos que todas las tareas se guarden
        }

        //** GUARDAMOS LA RELACION DE Hanrt_ItemRuta con hanrt_itemruta_hane_entregas_c */
        const entregasPromises = entrega.entregasList?.length
          ? entrega.entregasList.map(async (idEntrega) => {
              const newHanrtItemrutaHaneEntregasEntity = manager.create(
                HanrtItemrutaHaneEntregasEntity,
                {
                  id: uuidv4(),
                  date_modified: new Date(
                    new Date().setHours(new Date().getHours() + 4),
                  ),
                  deleted: 0,
                  hanrt_itemruta_hane_entregashane_entregas_idb: idEntrega,
                  hanrt_itemruta_hane_entregashanrt_itemruta_ida:
                    result_HanrtItemRuta.id,
                },
              );

              const updateResult = await manager.update(
                HaneEntregas,
                { id: idEntrega },
                { estado_c: '07' },
              );

              await manager.save(newHanrtItemrutaHaneEntregasEntity);
            })
          : [];

        await Promise.all(entregasPromises);

        return result_HanrtItemRuta;
      });
      await Promise.all(savePromises);
    } catch (error) {
      console.log(error);
    }
  }

  async saveHanrtPlanificador(hanrtPlanificador: IHanrtPlanificador) {
    try {
      let result;

      await this.httpService.axiosRef
        .post(
          `${this.HANSACRM3}service/v4_1/rest.php`,
          querystring.encode({
            input_type: 'Json',
            response_type: 'Json',
            rest_data: `{"data":${JSON.stringify(hanrtPlanificador)}}`,
            method: 'save_planner',
          }),
        )
        .then((response) => {
          result = response['data'];
        })
        .catch((error) => {
          result = error;
        });

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async saveRelationshipPlanificadorVehiculo(
    idPlanificador: string,
    idVehiculo: string,
  ) {
    try {
      let result;

      await this.httpService.axiosRef
        .post(
          `${this.HANSACRM3}service/v4_1/rest.php`,
          querystring.encode({
            input_type: 'Json',
            response_type: 'Json',
            rest_data: `{"data":{"idPlanificador":"${idPlanificador}","idVehiculo":"${idVehiculo}"}}`,
            method: 'save_relationship_planner_vehicle',
          }),
        )
        .then((response) => {
          result = response['data'];
        })
        .catch((error) => {
          result = error;
        });

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async saveRelationshipPlanificadorItemgroup(
    idPlanificador: string,
    idItemgroup: string,
  ) {
    try {
      let result;

      await this.httpService.axiosRef
        .post(
          `${this.HANSACRM3}service/v4_1/rest.php`,
          querystring.encode({
            input_type: 'Json',
            response_type: 'Json',
            rest_data: `{"data":{"idPlanificador":"${idPlanificador}","idItemgroup":"${idItemgroup}"}}`,
            method: 'save_relationship_itemgroup_planner',
          }),
        )
        .then((response) => {
          result = response['data'];
        })
        .catch((error) => {
          result = error;
        });

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async listPlanningByFilter(
    filterAdvancedDto: FilterAdvancedPlanificacionesDto,
  ) {
    try {
      const {
        page,
        rowsPerPage,
        filter: {
          assigned_to = '',
          name = '',
          description = '',
          estadoPlanificacionC = '',
          fechaFinC = '',
          fechaInicioC = '',
          idamercadoC = '',
          iddivisionC = '',
          regionC = '',
          tipo = '',
        },
      } = filterAdvancedDto;

      const data = await this.mssqlEntityManager
        .query(`EXEC [${this.SQL_DATABASE}].[${this.SQL_SCHEMA}].[Planificacion_Filter_Advanced] 
        ${page},
        ${rowsPerPage},
        '${assigned_to}',
        '${name}',
        '${description}',
        '${tipo}',
        '${iddivisionC}',
        '${idamercadoC}',
        '${regionC}',
        '${estadoPlanificacionC}',
        '${fechaInicioC}',
        '${fechaFinC}'`);

      return data.map((p) => ({
        ...p,
        rutas: JSON.parse(p.rutas ?? '[]').map((r) => ({
          ...r,
          usuario_asignado: JSON.parse(r.usuario_asignado ?? '{}'),
        })),
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async listTotalPlanningByFilter(
    filterAdvancedDto: FilterAdvancedPlanificacionesDto,
  ) {
    try {
      const {
        page,
        rowsPerPage,
        filter: {
          assigned_to = '',
          name = '',
          description = '',
          estadoPlanificacionC = '',
          fechaFinC = '',
          fechaInicioC = '',
          idamercadoC = '',
          iddivisionC = '',
          regionC = '',
          tipo = '',
        },
      } = filterAdvancedDto;

      const data = await this.mssqlEntityManager
        .query(`EXEC [${this.SQL_DATABASE}].[${this.SQL_SCHEMA}].[Planificacion_Get_Total] 
        ${page},
        ${rowsPerPage},
        '${assigned_to}',
        '${name}',
        '${description}',
        '${tipo}',
        '${iddivisionC}',
        '${idamercadoC}',
        '${regionC}',
        '${estadoPlanificacionC}',
        '${fechaInicioC}',
        '${fechaFinC}'
        `);

      return data[0].total;
    } catch (error) {
      console.log(error);
    }
  }

  async listTotalPlanningActivitiesByFilter(
    filterAdvancedDto: FilterAdvancedRutasDto,
  ) {
    try {
      const {
        page,
        rowsPerPage,
        filter: {
          codUsuario = [],
          fecha: { from = '', to = '' },
          regional = '',
          areaMercado = '',
          division = '',
          easyFilter = '',
        },
      } = filterAdvancedDto;
      Logger.debug({filterAdvancedDto})

      const data = await this.mssqlEntityManager.query(`EXEC [${
        this.SQL_DATABASE
      }].[${this.SQL_SCHEMA}].[Hanrt_ItemRuta_Filter_Advanced_prueba]
        @easyFilter = @0,
        @PageNumber = @1,
        @PageSize = @2,
        @codUsuario = @3,
        @fecha = @4,
        @fechaFin = @5,
        @regional = @6,
        @areaMercado = @7,
        @division = @8`, 
      [
        easyFilter,
        page,
        rowsPerPage,
        codUsuario.join(','),
        from,
        to,
        regional,
        areaMercado,
        division,
      ]);

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async listTotalVisitsByFilter(filterAdvancedDto: FilterAdvancedRutasDto) {
    try {
      const {
        filter: {
          codUsuario = '',
          fecha: { from = '', to = '' },
          regional = '',
          areaMercado = '',
          division = '',
          easyFilter = '',
        },
      } = filterAdvancedDto;

      const codUsuarioParam = codUsuario || null;
      const fechaParam = from || null;
      const fechaFinParam = to || null;
      const regionalParam = regional || null;
      const areaMercadoParam = areaMercado || null;
      const divisionParam = division || null;

      const data = await this.mssqlEntityManager.query(`EXEC [${
        this.SQL_DATABASE
      }].[${this.SQL_SCHEMA}].[Hanrt_ItemRuta_Get_Total]
        @easyFilter = ${easyFilter ? `'${easyFilter}'` : 'NULL'},
        @codUsuario = ${codUsuarioParam ? `'${codUsuarioParam}'` : 'NULL'},
        @fecha = ${fechaParam ? `'${fechaParam}'` : 'NULL'},
        @fechaFin = ${fechaFinParam ? `'${fechaFinParam}'` : 'NULL'},
        @regional = ${regionalParam ? `'${regionalParam}'` : 'NULL'},
        @areaMercado = ${areaMercadoParam ? `'${areaMercadoParam}'` : 'NULL'},
        @division = ${divisionParam ? `'${divisionParam}'` : 'NULL'}`);
      console.log(data);
      return data[0].TotalRutas;
    } catch (error) {
      console.log(error);
    }
  }

  async getReporteByPlanificadorId(ids: string[]) {
    const workbook = new ExcelJS.Workbook();

    for (const [index, id] of ids.entries()) {
      const planificacion = await this.mssqlEntityManager.query(
        `SELECT
        name,
        fecha_inicio_c,
        fecha_fin_c,
        hl8.Value AS estado_planificacion_c,
        hl4.Value AS tipo,
        hl5.Value AS iddivision_c,
        hl6.Value AS idamercado_c,
        hl7.Value AS region_c,
        date_entered
      FROM hanrt_planificador hp
      LEFT JOIN pro.hansacrm_list hl4 WITH (NOLOCK) ON hl4.ID = hp.tipo AND hl4.ListId = 'hansa_tipoplanificacion_list'
      LEFT JOIN pro.hansacrm_list hl5 WITH (NOLOCK) ON hl5.ID = hp.iddivision_c AND hl5.ListId = 'hansa_divisiones_list'
      LEFT JOIN pro.hansacrm_list hl6 WITH (NOLOCK) ON hl6.ID = hp.idamercado_c AND hl6.ListId = 'hansa_amercado_list'
      LEFT JOIN pro.hansacrm_list hl7 WITH (NOLOCK) ON hl7.ID = hp.region_c AND hl7.ListId = 'hansa_dimregion_list'
      LEFT JOIN pro.hansacrm_list hl8 WITH (NOLOCK) ON hl8.ID = hp.estado_planificacion_c AND hl8.ListId = 'estado_planificacion_c_list'
      WHERE hp.id = @0 AND deleted = 0`,
        [id],
      );

      const user = await this.mssqlEntityManager.query(
        `
    SELECT
      user_name,
      CONCAT(
        (CASE
          WHEN u.first_name IS NULL THEN ''
          ELSE CONCAT(u.first_name, ' ')
        END),
        (CASE
          WHEN u.last_name IS NULL THEN ''
          ELSE u.last_name
        END)
      ) as full_name
    FROM users u
    LEFT JOIN users_cstm uc ON u.id = uc.id_c  
    LEFT JOIN hanrt_planificador hp ON hp.assigned_user_id = u.id AND hp.deleted = 0
    WHERE u.deleted = 0 AND hp.id = @0
  `,
        [id],
      );

      if (
        !planificacion ||
        planificacion.length === 0 ||
        !user ||
        user.length === 0
      ) {
        throw new Error(
          'No se encontraron datos para el planificador especificado',
        );
      }
      const worksheet = workbook.addWorksheet(`Planificación - ${index + 1}`, {
        properties: {
          tabColor: { argb: '003c79' },
        },
      });

      worksheet.mergeCells('A1:H1');
      worksheet.getCell('A1').value = 'Reporte de Planificación';
      worksheet.getCell('A1').font = {
        bold: true,
        size: 22,
        color: { argb: 'FFFFFF' },
      };
      worksheet.getCell('A1').alignment = {
        horizontal: 'center',
        vertical: 'justify',
      };
      worksheet.getCell('A1').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '003c79' },
      };
      worksheet.getCell('A1').border = {
        top: { style: 'thin', color: { argb: 'FFFFFF' } },
        left: { style: 'thin', color: { argb: 'FFFFFF' } },
        bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
        right: { style: 'thin', color: { argb: 'FFFFFF' } },
      };

      worksheet.mergeCells('A2:D2');
      worksheet.mergeCells('E2:H2');
      worksheet.mergeCells('A3:D3');
      worksheet.mergeCells('E3:H3');
      worksheet.mergeCells('A4:D4');
      worksheet.mergeCells('E4:H4');
      worksheet.mergeCells('A5:D5');
      worksheet.mergeCells('E5:H5');

      worksheet.getCell('A2').value = `Nombre: ${user[0].full_name}`;
      worksheet.getCell('E2').value = `Fecha de inicio: ${moment(
        planificacion[0].fecha_inicio_c,
      )
        .subtract(4, 'h')
        .format('dddd, D [de] MMMM YYYY')}`;

      worksheet.getCell('A3').value = `Código de usuario: ${user[0].user_name}`;
      worksheet.getCell('E3').value = `Fecha de fin: ${moment(
        planificacion[0].fecha_fin_c,
      )
        .subtract(4, 'h')
        .format('dddd, D [de] MMMM YYYY')}`;

      worksheet.getCell(
        'A4',
      ).value = `Organización de ventas: ${planificacion[0].iddivision_c}`;
      worksheet.getCell(
        'E4',
      ).value = `Estado: ${planificacion[0].estado_planificacion_c}`;

      worksheet.getCell(
        'A5',
      ).value = `Sector: ${planificacion[0].idamercado_c}`;
      worksheet.getCell('E5').value = `Tipo: ${planificacion[0].tipo}`;

      const headerCells = ['A2', 'E2', 'A3', 'E3', 'A4', 'E4', 'A5', 'E5'];

      headerCells.forEach((cell) => {
        worksheet.getCell(cell).font = {
          bold: true,
          color: { argb: 'FFFFFF' },
        };
        worksheet.getCell(cell).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '003c79' },
        };
        worksheet.getCell(cell).alignment = {
          horizontal: 'left',
          vertical: 'middle',
        };
      });

      const headerRowIndex = 6;

      worksheet.getRow(headerRowIndex).values = [
        'Nro.',
        'Nombre de ruta',
        'Cliente',
        'Contacto',
        'Fecha de planificación',
        'Hora Inicio',
        'Duración',
        'Hora Fin',
      ];

      const headerRow = worksheet.getRow(headerRowIndex);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: 'center', vertical: 'justify' };
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '003c79' },
        };

        cell.font = { color: { argb: 'FFFFFF' } };

        cell.border = {
          top: { style: 'thin', color: { argb: 'FFFFFF' } },
          left: { style: 'thin', color: { argb: 'FFFFFF' } },
          bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
          right: { style: 'thin', color: { argb: 'FFFFFF' } },
        };
      });

      worksheet.columns = [
        {
          key: 'nro',
          width: 10,
          alignment: { horizontal: 'center', vertical: 'justify' },
        },
        { key: 'ruta_name', width: 30 },
        { key: 'cliente', width: 30 },
        { key: 'contacto', width: 30 },
        {
          key: 'fecha_plan',
          width: 30,
          alignment: { horizontal: 'center', vertical: 'justify' },
        },
        {
          key: 'hora_inicio',
          width: 12,
          alignment: { horizontal: 'center', vertical: 'justify' },
        },
        {
          key: 'duracion',
          width: 10,
          alignment: { horizontal: 'center', vertical: 'justify' },
        },
        {
          key: 'hora_fin',
          width: 12,
          alignment: { horizontal: 'center', vertical: 'justify' },
        },
      ];

      const grupos = await this.mssqlEntityManager.query(
        `
    SELECT hi2.* FROM hanrt_itemgroup hi2 
    LEFT JOIN hanrt_planificador_hanrt_itemgroup_c hphic 
      ON hi2.id = hphic.hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb AND hphic.deleted = 0
    LEFT JOIN hanrt_planificador hp 
      ON hp.id = hphic.hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida AND hp.deleted = 0
    WHERE hp.id = @0 AND hi2.deleted = 0
    ORDER BY CAST(hi2.secuencia_c AS INT) ASC
  `,
        [id],
      );

      const rutas = await this.mssqlEntityManager.query(
        `
    SELECT 
      hi.*, 
      hi2.id AS grupo_id, 
      ac.nombre_comercial_c as cliente,
      a.billing_address_street as direccion_cliente,
      CONCAT(
        (CASE
          WHEN c.first_name IS NULL THEN ''
          ELSE CONCAT(c.first_name, ' ')
        END),
        (CASE
          WHEN c.last_name IS NULL THEN ''
          ELSE c.last_name
        END)
      ) as contacto
    FROM hanrt_itemruta hi 
    LEFT JOIN hanrt_itemruta_accounts_c hiac
      ON hi.id = hiac.hanrt_itemruta_accountshanrt_itemruta_idb AND hiac.deleted = 0
    LEFT JOIN accounts a
      ON a.id = hiac.hanrt_itemruta_accountsaccounts_ida AND a.deleted = 0
    LEFT JOIN accounts_cstm ac 
      ON a.id = ac.id_c 
    LEFT JOIN hanrt_itemruta_contacts_c hicc
      ON hi.id = hicc.hanrt_itemruta_contactshanrt_itemruta_idb AND hicc.deleted = 0
    LEFT JOIN contacts c 
      ON c.id = hicc.hanrt_itemruta_contactscontacts_ida AND c.deleted = 0
    LEFT JOIN hanrt_itemgroup_hanrt_itemruta_c hihic 
      ON hi.id = hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemruta_idb AND hihic.deleted = 0
    LEFT JOIN hanrt_itemgroup hi2 
      ON hi2.id = hihic.hanrt_itemgroup_hanrt_itemrutahanrt_itemgroup_ida AND hi2.deleted = 0
    LEFT JOIN hanrt_planificador_hanrt_itemgroup_c hphic 
      ON hi2.id = hphic.hanrt_planificador_hanrt_itemgrouphanrt_itemgroup_idb AND hphic.deleted = 0
    LEFT JOIN hanrt_planificador hp 
      ON hp.id = hphic.hanrt_planificador_hanrt_itemgrouphanrt_planificador_ida AND hp.deleted = 0
    WHERE hp.id = @0 AND hi.deleted = 0
    ORDER BY CAST(hi.secuencia_c AS INT) ASC
  `,
        [id],
      );

      const rutasPorGrupo = rutas.reduce((acc, ruta) => {
        if (!acc[ruta.grupo_id]) acc[ruta.grupo_id] = [];
        acc[ruta.grupo_id].push(ruta);
        return acc;
      }, {});

      let currentRow = 7;
      grupos.forEach((grupo, indexGroup) => {
        const durationMinutes = moment(grupo.hora_fin_c).diff(
          moment(grupo.hora_inicio_c),
          'minutes',
        );
        const durationHours = durationMinutes / 60;

        worksheet.addRow({
          nro: indexGroup + 1,
          ruta_name: grupo.name,
          fecha_plan: grupo.fecha_plan_c,
          hora_inicio: moment(grupo.hora_inicio_c)
            .subtract(4, 'h')
            .format('hh:mma'),
          duracion: `${durationHours < 0 ? 0 : durationHours}h`,
          hora_fin: moment(grupo.hora_fin_c).subtract(4, 'h').format('hh:mma'),
        });

        const groupRow = worksheet.getRow(currentRow);
        groupRow.font = { bold: true };
        groupRow.outlineLevel = 0;
        groupRow.getCell('A').alignment = {
          horizontal: 'center',
          vertical: 'justify',
        };
        groupRow.getCell('E').alignment = {
          horizontal: 'center',
          vertical: 'justify',
        };
        groupRow.getCell('F').alignment = {
          horizontal: 'center',
          vertical: 'justify',
        };
        groupRow.getCell('G').alignment = {
          horizontal: 'center',
          vertical: 'justify',
        };
        groupRow.getCell('H').alignment = {
          horizontal: 'center',
          vertical: 'justify',
        };

        currentRow++;

        if (rutasPorGrupo[grupo.id]) {
          rutasPorGrupo[grupo.id].forEach((ruta, indexRoute) => {
            const row = worksheet.addRow({
              nro: `${indexGroup + 1}.${indexRoute + 1}`,
              ruta_name: ` - ${ruta.name}`,
              fecha_plan: moment(ruta.fecha_inicio_c, 'YYYY-MM-DD')
                .subtract(4, 'h')
                .format('DD/MM/YYYY'),
              hora_inicio: moment(ruta.hora_inicio_c)
                .subtract(4, 'h')
                .format('hh:mma'),
              duracion: `${moment(ruta.duracion_c)
                .subtract(4, 'h')
                .hours()}h ${moment(ruta.duracion_c)
                .subtract(4, 'h')
                .minutes()}m`,
              cliente: `${ruta.cliente ?? ''} - ${ruta.direccion_cliente}`,
              contacto: ruta.contacto,
              hora_fin: moment(ruta.hora_fin_c)
                .subtract(4, 'h')
                .format('hh:mma'),
            });

            row.getCell('A').alignment = {
              horizontal: 'center',
              vertical: 'justify',
            };
            row.getCell('E').alignment = {
              horizontal: 'center',
              vertical: 'justify',
            };
            row.getCell('F').alignment = {
              horizontal: 'center',
              vertical: 'justify',
            };
            row.getCell('G').alignment = {
              horizontal: 'center',
              vertical: 'justify',
            };
            row.getCell('H').alignment = {
              horizontal: 'center',
              vertical: 'justify',
            };

            row.outlineLevel = 1;
            row.hidden = true;
            currentRow++;
          });
        }
      });
      worksheet.autoFilter = 'A6:H6';
    }

    return workbook.xlsx.writeBuffer();
  }

  async updateAllPlanificador(
    updateData: UpdatePlanningDto,
  ): Promise<ResUpdate> {
    const plan = updateData.updates.find(
      (e) => e.type === typeUpdateItem.planificador,
    );

    const planificador = plan.itemData as IHanrtPlanificador;

    const beforePlan = await this.plannRepo.getPlanHeader(planificador.id);
    const resultUpdate = await this.plannRepo.updatePlanificadorPersist(
      updateData,
    );
    const queue_audit = `${this.configService.getOrThrow<string>(
      'RABBITMQ_QUEUES.hanrt_planificador_audit.name',
    )}`;

    if (plan) {
      const data = [];

      if (beforePlan) {
        Object.entries(planificador).forEach(([key, value]) => {
          if (value !== beforePlan[key]) {
            data.push({
              type: '01',
              parent_id: planificador.id,
              date_created: new Date(),
              created_by: updateData.usuario,
              field_name: key,
              data_type: 'string',
              before_value_string: beforePlan[key] || '',
              after_value_string: value,
              before_value_text: '',
              after_value_text: '',
            });
          }
        });
      }

      this.clientPlanningAudit.emit(queue_audit, {
        data,
      });
    }

    return resultUpdate;
  }
}
