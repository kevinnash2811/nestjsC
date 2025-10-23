import { toUTC4 } from "src/helpers";
import { ReglaTareasPlanningDto, TareaPlanningDto } from "../dto/hanrt_tarea-planning.dto";
import { TareaRawPlanning } from "../types";

export const mapTaskRawToTaskPlanningDto = (data: TareaRawPlanning): TareaPlanningDto => {
  return {
    id: data.idTarea,
    name: data.name,
    estado: data.estado_c,
    estadoLabel: data.estado_label,
    obligatorio: data.obligatorio_c,
  }
}

export const mapReglaRawReglaTareaPlanningDto = (raw: TareaRawPlanning, tareas: TareaPlanningDto[]): ReglaTareasPlanningDto => {
  return {
    id: raw.regla_id,
    name: raw.regla_name,
    estado: raw.regla_estado,
    estadoLabel: raw.regla_estado_valor,
    fechaFin: toUTC4(raw.fecha_fin_regla, 'DD-MM-YYYY HH:mm'),
    fechaInicio: toUTC4(raw.fecha_inicio_regla, 'DD-MM-YYYY HH:mm'),
    tipo: raw.tipo_regla_c,
    tipoLabel: raw.tipo_regla_label,
    tareas: tareas ?? [],
  }
}
