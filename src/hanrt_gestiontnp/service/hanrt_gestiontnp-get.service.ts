import moment from 'moment';
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { HansacrmList } from 'src/hansacrm_list/entities/hansacrm_list.entity';
import { EntityManager } from 'typeorm';
import { GetGestionTnpDTO } from '../dto/get-tnp.dto';
import { HanrtGestionTnpEntity } from '../entities/hanrt_gestiontnp.entity';
import { HistoricoNotasParams } from '../interfaces/get-tnp';
import { FirebaseService } from 'src/firebase/service';
import { get, push, ref, set } from 'firebase/database';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';

@Injectable()
export class HanrtGestionTNPGetService {
  constructor(
    @InjectEntityManager('DBCRM')
    private readonly mssqlEntityManager: EntityManager,
    private readonly firebaseService: FirebaseService,
    private readonly configService: ConfigService,
  ) {}

  async getGestionTnp(getGestionTnpDTO: GetGestionTnpDTO) {
    const {
      CodUsuario,
      fechaInicio,
      fechaFin,
      page = 1,
      limit = 10,
    } = getGestionTnpDTO;

    //console.log('Cantidad de Registros:', cantidadRegistros);

    const query = this.mssqlEntityManager
      .createQueryBuilder(HanrtGestionTnpEntity, 'hgt')
      .distinct(true)
      .select([
        'hgt.id AS tnpLicenciaID',
        'hgt.name AS nombreTnpLicencia',
        'hgt.created_by AS UsuarioID',
        'u.user_name AS codUsuario',
        "ISNULL(hgt.description, '') AS descripcion",
        "ISNULL(hl1.Value, '') AS subTipoTnpLicencia",
        "ISNULL(hl2.Value, '') AS tipoTnpLicencia",
        'hl3.Value AS estado',
        "ISNULL(hl4.Value, '') AS tiempoTnpLicencia",
        "'' AS tipoTnpLicenciaID",
        "'' AS subTipoTnpLicenciaID",
        'hgt.total_tnp_hours AS cantidadHoras',
        'hc.id AS cicloID',
        "ISNULL(hc.description, '') AS cicloDescripcion",
        "'' AS fechaCiclo",
        "'' AS comentarioSolicitante",
        "'' AS comentarioAprobador",
        'DATEADD(HOUR, -4, hgt.date_entered) AS fecha',
        'DATEADD(HOUR, -4, hgt.date_modified) AS fechaModificacion',
        'hgt.estado_c AS codEstado',
        'hgt.tipo_c AS codTipo',
        'hgt.sub_tipo_c AS codSubTipo',
        //PARA EL SUBNODO tiempoTnpLicencia
        'ha.id AS tiempoTnpLicenciaID',
        'ha.tiempo_c AS codTiempoTnpLicencia',
        'ha.hora_inicio_c AS fechaInicio',
        'ha.hora_fin_c AS fechaFin',
      ])
      .innerJoin(
        'hanrt_gestiontnp_users_c',
        'hgu',
        'hgu.hanrt_gestiontnp_usershanrt_gestiontnp_ida = hgt.id',
      )
      .innerJoin('users', 'u', 'u.id = hgu.hanrt_gestiontnp_usersusers_idb')
      .innerJoin(
        'hanrt_ciclos_users_c',
        'hcu',
        'u.id = hcu.hanrt_ciclos_usersusers_idb',
      )
      .leftJoin(
        'hanrt_ciclos_hanrt_gestiontnp_c',
        'hchgt',
        'hchgt.hanrt_ciclos_hanrt_gestiontnphanrt_ciclos_ida = hgt.id',
      )
      .leftJoin(
        'hanrt_ciclos',
        'hc',
        'hc.id = hcu.hanrt_ciclos_usershanrt_ciclos_ida',
      )
      .leftJoin(
        'hanrt_gestiontnp_hanrt_agendatiempos_c',
        'hght',
        'hght.hanrt_gestiontnp_hanrt_agendatiemposhanrt_gestiontnp_ida = hgt.id',
      )
      .innerJoin(
        'hanrt_agendatiempos',
        'ha',
        'ha.id = hght.hanrt_gestiontnp_hanrt_agendatiemposhanrt_agendatiempos_idb',
      )
      .leftJoin(
        HansacrmList,
        'hl1',
        'hl1.ID = hgt.sub_tipo_c AND hl1.ListId = :subTipoListId',
        {
          subTipoListId: 'sub_tipo_c_list',
        },
      )
      .leftJoin(
        HansacrmList,
        'hl2',
        'hl2.ID = hgt.tipo_c AND hl2.ListId = :tipoListId',
        {
          tipoListId: 'tipo_tnp_c',
        },
      )
      .leftJoin(
        HansacrmList,
        'hl3',
        'hl3.ID = hgt.estado_c AND hl3.ListId = :estadoListId',
        {
          estadoListId: 'estado_tnp_c',
        },
      )
      .leftJoin(
        HansacrmList,
        'hl4',
        'hl4.ID = ha.tiempo_c AND hl4.ListId = :tiempoListId',
        {
          tiempoListId: 'tiempo_c_list',
        },
      )
      .where('hgt.deleted = 0')
      //.andWhere('hgt.assigned_user_id != hgu.hanrt_gestiontnp_usersusers_idb')
      .orderBy('fechaModificacion', 'DESC');

    if (CodUsuario) {
      query.andWhere('u.user_name = :CodUsuario', { CodUsuario });
    }

    if (fechaInicio && fechaFin) {
      const inicioDate = moment(fechaInicio).startOf('day').toDate();
      const finDate = moment(fechaFin).endOf('day').toDate();
    
      query.andWhere('hgt.date_entered BETWEEN :fechaInicio AND :fechaFin', { 
        fechaInicio: inicioDate, 
        fechaFin: finDate 
      });
    }

    const total = await query.getCount();
    const offset = (page - 1) * limit;
    const datos = await query.offset(offset).limit(limit).getRawMany();

    const groupedResults = datos.reduce((acc, row) => {
    const tnpLicenciaID = row.tnpLicenciaID; 

      let existingRecord = acc.find((item) => item.tnpLicenciaID === tnpLicenciaID);
  
      if (!existingRecord) {
        existingRecord = {
          cicloDescripcion: row.cicloDescripcion,
          cantidadHoras: row.cantidadHoras,
          cicloID: row.cicloID,
          codUsuario: row.codUsuario,
          comentarioAprobador: row.comentarioAprobador || "",
          comentarioSolicitante: row.comentarioSolicitante || "",
          descripcion: row.descripcion,
          estado: row.estado,
          fecha: row.fecha,
          fechaCiclo: row.fechaCiclo || "",
          fechaModificacion: row.fechaModificacion,
          idEstado: row.codEstado,
          nombreTnpLicencia: row.nombreTnpLicencia,
          subTipoTnpLicencia: row.subTipoTnpLicencia,
          subTipoTnpLicenciaID: row.codSubTipo,
          tiempoTnpLicencia: [], 
          tipoTnpLicencia: row.tipoTnpLicencia,
          tipoTnpLicenciaID: row.codTipo,
          tnpLicenciaID: row.tnpLicenciaID,
        };
        acc.push(existingRecord);
      }
  
      // Agregar el tiempoTnpLicencia al subnodo
      existingRecord.tiempoTnpLicencia.push({
        fechaFin: row.fechaFin,
        fechaInicio: row.fechaInicio,
        tiempoTnpLicenciaID: row.tiempoTnpLicenciaID,
        tnpLicenciaID: row.tnpLicenciaID,
      });
  
      return acc;
    }, []);
  
    return {
      datos: groupedResults,
      infoPaginacion: {
        totalRegistros: total,
        page,
        cantidadRegistros: limit,
        totalPages: Math.ceil(total / limit),
      },
    };

  }

  async getHistoricoNotas(params: HistoricoNotasParams) {
    try {
      let { codUsuario, fechaInicio, fechaFin, contacto_id } = params;

      fechaFin =
        endOfDay(parseISO(fechaFin)).toISOString().split('T')[0] +
        ' 23:59:59.999';

      const result = await this.mssqlEntityManager.query(
        `EXEC [dbo].[hsp_HBM_get_historico_notas] 
           @fechaInicio = '${fechaInicio}', 
           @fechaFin = '${fechaFin}', 
           @codUsuario = '${codUsuario}', 
           @contacto_id = '${contacto_id || ''}'`,
      );
      console.log(result);

      const resultConvertido = result.map((item) => ({
        ...item,
        fecha: item.fecha ? moment(item.fecha).format('DD-MM-YYYY HH:mm:ss') : null,
        fechaModificacion: item.fechaModificacion ? moment(item.fechaModificacion).format('DD-MM-YYYY HH:mm:ss') : null,
        esPrivado: item.esPrivado ? 1 : 0,
      }));

      return resultConvertido;
    } catch (error) {
      console.error('Error al obtener el histórico de notas:', error);
      throw error;
    }
  }

  async updateTnp(id: string, updateTnpDTO: any): Promise<void> {

    console.log('ID:', id);
    console.log('userid:', updateTnpDTO.assigned_user_id);

    const estado = await this.mssqlEntityManager
      .createQueryBuilder(HansacrmList, 'hl')
      .where('hl.ListId = :listId', { listId: 'estado_tnp_c' })
      .andWhere('hl.ID = :id', { id: updateTnpDTO.estado_c })
      .getOne();

    if (!estado) {
      throw new Error(`Estado con ID ${updateTnpDTO.estado_c} no encontrado`);
    }

    const user = await this.mssqlEntityManager.findOne(User, {
      where: {
        id: updateTnpDTO.assigned_user_id,
      },
    });

    if (!user) {
      throw new Error(`Usuario con ID ${updateTnpDTO.assigned_user_id} no encontrado`);
    }    
    console.log(user);
    const refdb = ref(this.firebaseService.getInstance(), `TnpLicencia/${id}`);
    //const snapshot = await get(refdb);
    //const data = snapshot.val();

    const updatedData = {
      idEstado: updateTnpDTO.estado_c || '',
      estado: estado.value || '',
      codUsuario: user.user_name || '',
      tnpLicenciaID: id,
      sync_state: 'Enviado',
    };

    await set(refdb, updatedData);
  }
}
