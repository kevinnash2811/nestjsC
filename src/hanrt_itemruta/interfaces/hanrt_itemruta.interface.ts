export interface IHanrtItemruta{
	name? : string,
    description? : string,
    tipoVisitaC? : string,
    tipoVisitaHbmC? : string,
    fechaInicioC? : string,
    horaInicioC? : string,
    duracionC?: string,
    fechaFinC?: string,
    horaFinC?: string,
    secuenciaC?: number,
    idAccount?: string,
    idContact?: string,
    userId?: string,
    latitud?: string,
    longitud?: string,
    tareasPlan?: string[],
    entregasList?: string[],
    nroVisita: number,
}

export interface IHanrtItemrutaUpdate{
    id? : string,
	name? : string,
    date_modified? : string,
    description? : string,
    assigned_user_id?: string,
    tipo_visita_c? : string,
    tipo_visita_hbm_c? : string,
    fecha_inicio_c? : string,
    hora_inicio_c? : string,
    hora_fin_c? : string,
    duracion_c?: string,
    fecha_fin_c?: string,
    evento_dia?: string,
    jjwg_maps_lat_c?: string,
    jjwg_maps_lng_c?: string
}

export interface ItemRutaRaw {
  ID: string;
  secuencia_c: number;
  ruta_name: string;
  tipo_visita_c: string;
  fecha_inicio_c: string | Date;
  hora_inicio_c: string | Date;
  duracion_c: string | Date;
  fecha_fin_c: string | Date;
  hora_fin_c: string | Date;
  latitud: string;
  longitud: string;
  assigned_user_id: string;
  assigned_user: string;
  tipo_visita_label: string;
  visita_nombre: string | null;
  visita_estado: string | null;
  visita_id: string | null;
  visita_ciclo_c: string | null;
  nro_visita_c: string | null;
  hana_visitas_id_c: string | null;
  qtyTasks: number;
}

export interface ItemRutaRawToCreate {
  id: string;
  name: string;
  date_entered: string;
  date_modified: string;
  modified_user_id: string;
  created_by: string;
  description: string;
  deleted: number;
  id_tenant: string;
  assigned_user_id: string;
  tipo_visita_c: string;
  fecha_inicio_c: string;
  hora_inicio_c: string;
  duracion_c: string;
  fecha_fin_c: string;
  hora_fin_c: string;
  secuencia_c: string; // numero
  jjwg_maps_lat_c: string;
  jjwg_maps_lng_c: string;
  evento_dia: string;
  parent_type: string;
  parent_id: string;
  tipo_visita_hbm_c: string;
  nro_visita_c: string;
  contactId: string | null;
  accountId: string | null;
  tareaIds: string | null;
  entregaIds: string | null;
}