import { IHanrtItemgroup } from 'src/hanrt_itemgroup/interface';
import { IHanrtItemruta } from 'src/hanrt_itemruta/interfaces';

export interface IHanrtPlanificador {
  id: string;
  name?: string;
  date_modified?: string;
  userId?: string;
  description?: string;
  tipo?: string;
  iddivisionC?: string;
  idamercadoC?: string;
  regionC?: string;
  canalC?: string;
  estadoPlanificacionC?: string;
  fechaInicioC?: string;
  fechaFinC?: string;
  cycleId?: string;
}

export interface IRutaPLanning {
  ruta: IHanrtItemgroup;
  entregas: Array<IHanrtItemruta>;
  idPlanificador: string;
}

export interface Group_Ruta_Regla_Actividad {
  idTarea: any;
  idRegla: any;
  customerRegion: any;
  group_id: string;
  group_name_c: string;
  group_secuencia_c: string;
  group_fecha_plan_c: string;
  group_user_id: string;
  group_usuario: string;
  group_id_vehiculo: string;
  group_placa: string;
  group_capacidad_c: string;
  group_bloqueado_c: string;
  group_hora_inicio_c: string;
  group_duracion_c: string;
  group_hora_fin_c: string;
  ruta_id: string;
  ruta_secuencia: number;
  ruta_name: string;
  ruta_tipo_visita: string;
  ruta_tipo_visita_label: string;
  ruta_fecha_inicio_c: string;
  ruta_hora_inicio_c: string;
  ruta_duracion_c: string;
  ruta_fecha_fin_c: string;
  ruta_hora_fin_c: string;
  ruta_id_account: string;
  ruta_name_account: string;
  ruta_address_account: string;
  ruta_category_account: string;
  ruta_second_category_account: string;
  ruta_usuario_zona_ventas_c: string;
  regionclienter: string;
  ruta_latitud: null | string;
  ruta_longitud: null | string;
  ruta_assigned_user_id: string;
  ruta_usuario_asignado: string;
  regla_id: null | string;
  regla_name: null | string;
  regla_fecha_inicio_c: null | string;
  regla_fecha_fin_c: null | string;
  regla_estado_c: null | string;
  regla_estado_label: null | string;
  regla_tipo_regla_c: null | string;
  regla_tipo_regla_label: null | string;
  tarea_id: null | string;
  tarea_name: null | string;
  tarea_estado_c: null | string;
  tarea_estado_c_label: null | string;
  tarea_obligatorio_c: null | string;
  entrega_id: null | string;
  entrega_name: null | string;
  entrega_estado_c: null | string;
  //  entrega_estado_c_label:         null | string;
  entrega_fecha_entrega_c: null | string;
  ruta_id_contact: null | string;
  ruta_first_name_contact: null | string;
  ruta_last_name_contact: null | string;
  ruta_title_contact: null | string;
  ruta_salutation_contact: null | string;
  ruta_especialidad_contact: null | string;
  ruta_phone_mobile_contact: null | string;
  estado_c: null | string;
  visita_ciclo_c: null | string;
  nro_visita_c: null | string;
  hana_visitas_id_c: null | string;
  visita_name: null | string;
  tasksCount: null | string;
  visita_id: null | string;
}
interface Tarea {
  tarea_id: string | null;
  tarea_name: string | null;
  tarea_estado_c: string | null;
  tarea_estado_c_label: string | null;
  tarea_obligatorio_c: null | string;
}

export interface Regla {
  regla_id: string | null;
  regla_name: string | null;
  regla_fecha_inicio_c: string | null;
  regla_fecha_fin_c: string | null;
  regla_estado_c: string | null;
  regla_estado_label: string | null;
  regla_tipo_regla_c: string | null;
  regla_tipo_regla_label: string | null;
  tareas: Tarea[];
}

export interface Ruta {
  ruta_id: string;
  ruta_secuencia: number;
  ruta_name: string;
  ruta_tipo_visita: string;
  ruta_tipo_visita_label: string;
  ruta_fecha_inicio_c: string;
  ruta_hora_inicio_c: string;
  ruta_duracion_c: string;
  ruta_fecha_fin_c: string;
  ruta_hora_fin_c: string;
  ruta_id_account: string;
  ruta_name_account: string;
  ruta_latitud: string | null;
  ruta_longitud: string | null;
  ruta_assigned_user_id: string;
  ruta_usuario_asignado: string;
  reglas_enrutamiento: Regla[]; // Aquí cambiamos a un array
}

export interface Group {
  group_id: string;
  group_secuencia_c: string;
  group_fecha_plan_c: string;
  group_user_id: string;
  group_usuario: string;
  group_id_vehiculo: string;
  group_placa: string;
  group_capacidad_c: string;
  group_hora_inicio_c: string;
  group_duracion_c: string;
  group_hora_fin_c: string;
  rutas_item: Ruta[]; // Aquí cambiamos a un array
}

export interface Planificacion {
  planificacion_id: string | null;
  planificacion_name: string | null;
  planificacion_date_entered: string | null;
  planificacion_iddivision_c: string | null;
  planificacion_division: string | null;
  planificacion_idamercado_c: string | null;
  planificacion_amercado: string | null;
  planificacion_region_c: string | null;
  planificacion_region: string | null;
  planificacion_canal_c: string | null;
  planificacion_canal: string | null;
  planificacion_tipo: string | null;
  planificacion_tipo_label: string | null;
  planificacion_estado: string | null;
  planificacion_estado_label: string | null;
  planificacion_id_user: string | null;
  planificacion_user: string | null;
  group_id: string | null;
  group_secuencia_c: string | null;
  group_fecha_plan_c: string | null;
  group_user_id: string | null;
  group_usuario: string | null;
  group_name: string | null;
  group_id_vehiculo: string | null;
  group_placa: string | null;
  group_capacidad_c: string | null;
  group_hora_inicio_c: string | null;
  group_duracion_c: string | null;
  group_hora_fin_c: string | null;
  ruta_id: string | null;
  ruta_secuencia: number | null;
  ruta_name: string | null;
  ruta_tipo_visita: string | null;
  ruta_tipo_visita_label: string | null;
  ruta_fecha_inicio_c: string | null;
  ruta_hora_inicio_c: string | null;
  ruta_duracion_c: string | null;
  ruta_fecha_fin_c: string | null;
  ruta_hora_fin_c: string | null;
  ruta_id_account: string | null;
  ruta_name_account: string | null;
  ruta_latitud: string | null;
  ruta_longitud: string | null;
  ruta_assigned_user_id: string | null;
  ruta_usuario_asignado: string | null;
  regla_id: string | null;
  regla_name: string | null;
  regla_fecha_inicio_c: string | null;
  regla_fecha_fin_c: string | null;
  regla_estado_c: string | null;
  regla_estado_label: string | null;
  regla_tipo_regla_c: string | null;
  regla_tipo_regla_label: string | null;
  tarea_id: string | null;
  tarea_name: string | null;
  tarea_estado_c: string | null;
  tarea_estado_c_label: string | null;
  tarea_obligatorio_c: boolean | null;
  ruta_id_contact: string | null;
  ruta_first_name_contact: string | null;
  ruta_last_name_contact: string | null;
  ruta_salutation_contact: string | null;
  ruta_especialidad_contact: string | null;
  ruta_phone_mobile_contact: string | null;
}

export interface IUpdatePlanningItem {
  type: typeUpdateItem;
  itemData: object;
}

export interface PlanningRouteItemData {
  name: string;
  description: string;
  idItemgroup?: string;
  latitud: string;
  longitud: string;
  fechaInicioC: string;
  fechaFinC: string;
  horaInicioC: string;
  duracionC: string;
  horaFinC: string;
  tipoVisitaC: string;
  tipoVisitaHbmC: string;
  secuenciaC: number;
  idAccount: string;
  idContact?: string;
  userId: string;
  tareasPlan: string[];
  entregas: string[];
}

// actualizacion de itemrutas
export interface PlanningRouteDataToUpdate {
  idPlanificador: string;
  name: string;
  description: string;
  fechaPlanC: string;
  horaInicioC: string;
  duracionC: string;
  bloqueadoC: string;
  horaFinC: string;
  secuenciaC: string;
  userId: string;
  itemrutas: PlanningRouteItemData[];
}

export interface Filter {
  assigned_to: string[];
  name: string;
  description: string;
  tipo: string;
  iddivisionC: string;
  idamercadoC: string;
  regionC: string;
  canalC: string;
  estadoPlanificacionC: string;
  fechaInicioC: string;
  fechaFinC: string;
}

export enum typeUpdateItem {
  planificador = 'PLANIFICADOR',
  planificadorVehiculos = 'PLANIFICADORVEHICULOS',
  planificadorItemgroup = 'PLANIFICADORITEMGROUP',
  itemgroup = 'ITEMGROUP',
  itemgroupVehiculos = 'ITEMGROUPVEHICULOS',
  itemgroupItemruta = 'ITEMGROUPITEMRUTA',
  itemruta = 'ITEMRUTA',
  itemrutaAccounts = 'ITEMRUTAACCOUNTS',
  itemrutaTareasplan = 'ITEMRUTATAREASPLAN',
  itemrutaEntregas = 'ITEMRUTAENTREGAS',
  itemrutaContact = 'ITEMRUTACONTACT',
  planificadorCiclo = 'PLANIFICADORCICLO',
}

export interface FilterRutas {
  codUsuario: string[];
  fecha: {
    from: string;
    to: string;
  };
  regional: string;
  areaMercado: string;
  division: string;
  easyFilter: string;
}

export interface IPlanningHeaderResult {
  id: string;
  name: string;
  idCiclo: string | null;
  nameCiclo: string | null;
  fechaInicioCiclo: string | null;
  fechaFinCiclo: string | null;
  estadoCiclo: string | null;
  cantidadVisitasDiaCiclo: number | null;
  diasCiclo: number | null;
  horasPorDiaCiclo: number | null;
  estadoValorCiclo: string | null;
  assigned_user_id: string;
  iddivision_c: string;
  division: string;
  idamercado_c: string;
  amercado: string;
  region_c: string;
  regional: string;
  canal_c: string;
  tipo: string;
  tipo_label: string;
  estado_planificacion_c: string;
  estado: string;
  fecha_creacion: string;
  descripcion: string;
  fecha_inicio_c: string;
  fecha_fin_c: string;
}