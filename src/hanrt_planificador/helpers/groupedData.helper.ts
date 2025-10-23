import { Logger } from '@nestjs/common';
import { Vehiculo } from '../../hans_vehiculos/interface';
import { Group_Ruta_Regla_Actividad, Planificacion } from '../interface';

export const agruparVehiculos = (dataVehiculos: Vehiculo[]): Vehiculo[] => {
  const groupedData = dataVehiculos.reduce((acc, curr) => {
    const { id, first_name, last_name, tipo_c, tipo_label, ...rest } = curr;
    if (!acc[id]) {
      acc[id] = {
        ...rest,
        id,
        conductores: [],
      };
    }
    acc[id].conductores.push({ first_name, last_name, tipo_c, tipo_label });
    return acc;
  }, {} as { [key: string]: any });
  return Object.values(groupedData);
};

export const agruparGroup = (data_groups: Group_Ruta_Regla_Actividad[]) => {
  return Object.values(
    data_groups.reduce(
      (acc: { [key: string]: any }, item: Group_Ruta_Regla_Actividad) => {
        // Si el grupo no existe, lo creamos
        if (!acc[item.group_id]) {
          acc[item.group_id] = {
            group_id: item.group_id,
            group_name_c: item.group_name_c,
            group_secuencia_c: item.group_secuencia_c,
            group_fecha_plan_c: item.group_fecha_plan_c,
            group_user_id: item.group_user_id,
            group_usuario: item.group_usuario,
            group_id_vehiculo: item.group_id_vehiculo,
            group_placa: item.group_placa,
            group_capacidad_c: item.group_capacidad_c,
            group_bloqueado_c: item.group_bloqueado_c,
            group_hora_inicio_c: item.group_hora_inicio_c,
            group_duracion_c: item.group_duracion_c,
            group_hora_fin_c: item.group_hora_fin_c,
            rutas_item: [],
          };
        }

        // Buscamos la ruta en el grupo, si no existe la creamos
        let ruta = acc[item.group_id].rutas_item.find(
          (r) => r.ruta_id === item.ruta_id,
        );

        if (!ruta && item.ruta_id !== null) {
          ruta = {
            ruta_id: item.ruta_id,
            ruta_secuencia: item.ruta_secuencia,
            ruta_name: item.ruta_name,
            ruta_tipo_visita: item.ruta_tipo_visita,
            ruta_tipo_visita_label: item.ruta_tipo_visita_label,
            ruta_fecha_inicio_c: item.ruta_fecha_inicio_c,
            ruta_hora_inicio_c: item.ruta_hora_inicio_c,
            ruta_duracion_c: item.ruta_duracion_c,
            ruta_fecha_fin_c: item.ruta_fecha_fin_c,
            ruta_hora_fin_c: item.ruta_hora_fin_c,
            ruta_id_account: item.ruta_id_account,
            ruta_name_account: item.ruta_name_account,
            ruta_address_account: item.ruta_address_account,
            ruta_usuario_zona_ventas_c: item.ruta_usuario_zona_ventas_c,
            regionclienter: item.regionclienter,
            customerRegion: item.customerRegion,
            ruta_category_account: item.ruta_category_account,
            ruta_second_category_account: item.ruta_second_category_account,
            ruta_latitud: item.ruta_latitud,
            ruta_longitud: item.ruta_longitud,
            ruta_assigned_user_id: item.ruta_assigned_user_id,
            ruta_usuario_asignado: item.ruta_usuario_asignado,
            ruta_id_contact: item.ruta_id_contact,
            ruta_first_name_contact: item.ruta_first_name_contact,
            ruta_last_name_contact: item.ruta_last_name_contact,
            ruta_title_contact: item.ruta_title_contact,
            ruta_salutation_contact: item.ruta_salutation_contact,
            ruta_especialidad_contact: item.ruta_especialidad_contact,
            ruta_phone_mobile_contact: item.ruta_phone_mobile_contact,
            visita_estado_c: item.estado_c,
            visita_id: item.visita_id,
            visita_visitas_ciclo: item.visita_ciclo_c,
            visita_taskCount: item.tasksCount,
            visita_name: item.visita_name,
            visita_nro_visita_c: item.nro_visita_c,
            visita_hana_visitas_id_c: item.hana_visitas_id_c,
            entregas: [],
            reglas_enrutamiento: [],
          };
          acc[item.group_id].rutas_item.push(ruta);
          acc[item.group_id].rutas_item.sort(
            (a, b) => a.ruta_secuencia - b.ruta_secuencia,
          );
        }

        // Buscamos la regla en la ruta, si no existe la creamos
        if (ruta) {
          let regla = ruta.reglas_enrutamiento.find(
            (r) => r.regla_id === item.regla_id,
          );
          if (!regla && item.regla_id !== null) {
            regla = {
              regla_id: item.regla_id,
              regla_name: item.regla_name,
              regla_fecha_inicio_c: item.regla_fecha_inicio_c,
              regla_fecha_fin_c: item.regla_fecha_fin_c,
              regla_estado_c: item.regla_estado_c,
              regla_estado_label: item.regla_estado_label,
              regla_tipo_regla_c: item.regla_tipo_regla_c,
              regla_tipo_regla_label: item.regla_tipo_regla_label,
              tareas: [],
            };
            ruta.reglas_enrutamiento.push(regla);
          }

          // Añadimos la tarea a la regla correspondiente
          if (regla && item.tarea_id !== null) {
            regla.tareas.push({
              id: item.tarea_id,
              name: item.tarea_name,
              estado_c: item.tarea_estado_c,
              estadotarea: item.tarea_estado_c_label,
              obligatorio_c: item.tarea_obligatorio_c,
            });
          }

          // Añadimos la entrega a la ruta correspondiente
          if (item.entrega_id !== null) {
            ruta.entregas.push({
              entrega_id: item.entrega_id,
              entrega_name: item.entrega_name,
              entrega_estado_c: item.entrega_estado_c,
              entrega_fecha_entrega_c: item.entrega_fecha_entrega_c,
            });
          }
        }

        return acc;
      },
      {},
    ),
  );
};

export const agruparPlanificacion = (data_planificacion: Planificacion[]) => {
  return Object.values(
    data_planificacion.reduce(
      (acc: { [key: string]: any }, item: Planificacion) => {
        // Si la planificación no existe, la creamos
        if (!acc[item.planificacion_id]) {
          acc[item.planificacion_id] = {
            planificacion_id: item.planificacion_id,
            planificacion_name: item.planificacion_name,
            planificacion_date_entered: item.planificacion_date_entered,
            planificacion_iddivision_c: item.planificacion_iddivision_c,
            planificacion_idamercado_c: item.planificacion_idamercado_c,
            planificacion_amercado: item.planificacion_amercado,
            planificacion_region_c: item.planificacion_region_c,
            planificacion_region: item.planificacion_region,
            planificacion_canal_c: item.planificacion_canal_c,
            planificacion_canal: item.planificacion_canal,
            planificacion_tipo: item.planificacion_tipo,
            planificacion_tipo_label: item.planificacion_tipo_label,
            planificacion_estado: item.planificacion_estado,
            planificacion_estado_label: item.planificacion_estado_label,
            planificacion_id_user: item.planificacion_id_user,
            planificacion_user: item.planificacion_user,
            groups: [],
          };
        }

        // Buscamos el grupo en la planificación, si no existe lo creamos
        let group = acc[item.planificacion_id].groups.find(
          (g) => g.group_id === item.group_id,
        );
        if (!group && item.group_id !== null) {
          group = {
            group_id: item.group_id,
            group_secuencia_c: item.group_secuencia_c,
            group_fecha_plan_c: item.group_fecha_plan_c,
            group_user_id: item.group_user_id,
            group_usuario: item.group_usuario,
            group_name: item.group_name,
            group_id_vehiculo: item.group_id_vehiculo,
            group_placa: item.group_placa,
            group_capacidad_c: item.group_capacidad_c,
            group_hora_inicio_c: item.group_hora_inicio_c,
            group_duracion_c: item.group_duracion_c,
            group_hora_fin_c: item.group_hora_fin_c,
            rutas: [],
          };
          acc[item.planificacion_id].groups.push(group);
        }
        if (group) {
          // Buscamos la ruta en el grupo, si no existe la creamos
          let ruta = group.rutas.find((r) => r.ruta_id === item.ruta_id);
          if (!ruta && item.ruta_id !== null) {
            ruta = {
              ruta_id: item.ruta_id,
              ruta_secuencia: item.ruta_secuencia,
              ruta_name: item.ruta_name,
              ruta_tipo_visita: item.ruta_tipo_visita,
              ruta_tipo_visita_label: item.ruta_tipo_visita_label,
              ruta_fecha_inicio_c: item.ruta_fecha_inicio_c,
              ruta_hora_inicio_c: item.ruta_hora_inicio_c,
              ruta_duracion_c: item.ruta_duracion_c,
              ruta_fecha_fin_c: item.ruta_fecha_fin_c,
              ruta_hora_fin_c: item.ruta_hora_fin_c,
              ruta_id_account: item.ruta_id_account,
              ruta_name_account: item.ruta_name_account,
              ruta_latitud: item.ruta_latitud,
              ruta_longitud: item.ruta_longitud,
              ruta_assigned_user_id: item.ruta_assigned_user_id,
              ruta_usuario_asignado: item.ruta_usuario_asignado,
              ruta_id_contact: item.ruta_id_contact,
              ruta_first_name_contact: item.ruta_first_name_contact,
              ruta_last_name_contact: item.ruta_last_name_contact,
              ruta_salutation_contact: item.ruta_salutation_contact,
              ruta_especialidad_contact: item.ruta_especialidad_contact,
              ruta_phone_mobile_contact: item.ruta_phone_mobile_contact,
              reglas: [],
            };
            group.rutas.push(ruta);
          }

          // Buscamos la regla en la ruta, si no existe la creamos
          if (ruta) {
            let regla = ruta.reglas.find((r) => r.regla_id === item.regla_id);
            if (!regla && item.regla_id !== null) {
              regla = {
                regla_id: item.regla_id,
                regla_name: item.regla_name,
                regla_fecha_inicio_c: item.regla_fecha_inicio_c,
                regla_fecha_fin_c: item.regla_fecha_fin_c,
                regla_estado_c: item.regla_estado_c,
                regla_estado_label: item.regla_estado_label,
                regla_tipo_regla_c: item.regla_tipo_regla_c,
                regla_tipo_regla_label: item.regla_tipo_regla_label,
                tareas: [],
              };
              ruta.reglas.push(regla);
            }

            // Añadimos la tarea a la regla correspondiente
            if (regla && item.tarea_id !== null) {
              regla.tareas.push({
                id: item.tarea_id,
                name: item.tarea_name,
                estado_c: item.tarea_estado_c,
                estado_c_label: item.tarea_estado_c_label,
                obligatorio_c: item.tarea_obligatorio_c,
              });
            }
          }
        }
        return acc;
      },
      {},
    ),
  );
};
