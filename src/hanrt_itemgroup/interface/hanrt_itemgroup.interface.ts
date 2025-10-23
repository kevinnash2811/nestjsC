export interface IHanrtItemgroup {
  name?: string;
  description?: string;
  fechaPlanC?: string;
  capacidadC?: string;
  horaInicioC?: string;
  duracionC?: string;
  horaFinC?: string;
  secuenciaC?: string;
  bloqueadoC?: string;
  userId?: string;
  secuencia?: string;
  idVehiculo?: string;
}

export interface IHanrtItemgroupUpdate {
  id?: string;
  name?: string;
  date_modified?: string;
  description?: string;
  assigned_user_id?: string;
  fecha_plan_c?: string;
  capacidad_c?: string;
  hora_inicio_c?: string;
  duracion_c?: string;
  hora_fin_c?: string;
  secuencia_c?: string;
}

export interface HanrtItemGroup {
  name?: string;
  description?: string;
  fechaPlanC?: string;
  capacidadC?: string;
  horaInicioC?: string;
  duracionC?: string;
  horaFinC?: string;
  secuenciaC?: string;
  bloqueadoC?: string;
  userId?: string;
  secuencia?: string;
  idVehiculo?: string;
}

export interface GroupDBResult {
  id: string;
  date_entered: string;
  name: string;
  description: string;
  assigned_user_id: string;
  fecha_plan_c: string;
  capacidad_c: number;
  hora_inicio_c: string;
  duracion_c: string;
  hora_fin_c: string;
  secuencia_c: number;
  bloqueado_c: string;
  total_clientes: number;
  userId: string;
  user_name: string;
  full_name: string;
}

export interface GroupResultToCreate {
  id: string;
  name: string;	
  date_entered: string;	
  date_modified: string;	
  modified_user_id: string;	
  created_by: string;	
  description: string;	
  deleted: number;
  assigned_user_id: string;
  fecha_plan_c: string;
  capacidad_c: string;
  hora_inicio_c: string;
  duracion_c: string;
  hora_fin_c: string;
  secuencia_c: string;
  bloqueado_c: string;
  vehicleId: string;
}