import { CreatePlanificadorDto } from "../dto/planning-header-to-create.dto";
import { HanrtPlanificadorEntity } from "../entities";

export const PlanningCreateToEntity = (plann: CreatePlanificadorDto): HanrtPlanificadorEntity => {
  const id = crypto.randomUUID();
  return {
    id: id,
    assigned_user_id: plann.userId,
    name: plann.name,
    description: plann.description,
    iddivision_c: plann.iddivision,
    idamercado_c: plann.idamercado,
    region_c: plann.region,
    canal_c: plann.canal,
    tipo: plann.tipo,
    date_entered: new Date(),
    date_modified: new Date(),
    deleted: 0,
    estado_planificacion_c: plann.state,
    created_by: plann.userId,
    modified_user_id: plann.userId,
    fecha_inicio_c: new Date(plann.fechaInicio),
    fecha_fin_c: new Date(plann.fechaFin),
  }
}