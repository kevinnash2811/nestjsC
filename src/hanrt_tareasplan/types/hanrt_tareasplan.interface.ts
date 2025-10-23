export enum TipoTarea {
    T00 = 'T00',
    T01 = 'T01',
    T02 = 'T02',
    T03 = 'T03',
}
export enum TareaPara {
    H00 = 'H00',
    H01 = 'H01',
    H02 = 'H02',
}

export enum TareasPlan {
    T00 = 'T00',
    T01 = 'T01',
    T02 = 'T02',
    T03 = 'T03',
}

export interface TareaRawPlanning {
  ruta_id: string;
  name: string;
  estado_c: string | null;
  tipo_tarea_c: string | null;
  estado_label: string | null;
  obligatorio_c: string | null;
  idTarea: string;
  regla_id: string;
  regla_name: string;
  fecha_inicio_regla: string | null;
  fecha_fin_regla: string | null;
  regla_estado: string | null;
  regla_estado_valor: string | null;
  tipo_regla_c: string | null;
  tipo_regla_label: string | null;
}
