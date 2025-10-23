import { UpdatePlanificadorDto } from "../dto";
import { HanrtPlanificadorEntity } from "../entities";
import { ClientException } from "../helpers/client-exceptions.helper";

export const PlanningUpdateQueryToEntity = (plann: UpdatePlanificadorDto): Partial<HanrtPlanificadorEntity> & { id: string } => {
  if (plann.id === undefined || plann.id.length < 36) 
    throw new ClientException('Id is required');

  const entity: Partial<HanrtPlanificadorEntity> & { id: string } = {
    date_modified: new Date(),
    id: plann.id,
  };

  if (plann.userId !== undefined) {
    entity.modified_user_id = plann.userId;
  }

  if (plann.name !== undefined) entity.name = plann.name;
  if (plann.description !== undefined) entity.description = plann.description;
  if (plann.iddivision !== undefined) entity.iddivision_c = plann.iddivision;
  if (plann.idamercado !== undefined) entity.idamercado_c = plann.idamercado;
  if (plann.region !== undefined) entity.region_c = plann.region;
  if (plann.canal !== undefined) entity.canal_c = plann.canal;
  if (plann.tipo !== undefined) entity.tipo = plann.tipo;
  if (plann.state !== undefined) entity.estado_planificacion_c = plann.state;
  if (plann.fechaInicio !== undefined) entity.fecha_inicio_c = new Date(plann.fechaInicio);
  if (plann.fechaFin !== undefined) entity.fecha_fin_c = new Date(plann.fechaFin);

  return entity;
}