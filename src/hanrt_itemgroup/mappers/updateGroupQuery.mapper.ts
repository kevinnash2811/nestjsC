import { UpdateGroupQueryDto } from "../dto";
import { HanrtItemGroupEntity } from "../entities";

export const GroupUpdateQueryToEntity = (group: UpdateGroupQueryDto): Partial<HanrtItemGroupEntity> & { id: string } => {
  const entity: Partial<HanrtItemGroupEntity> & { id: string } = {
    id: group.id,
    date_modified: new Date(),
    deleted: 0,
  };

  if (group.userId !== undefined) {
    entity.modified_user_id = group.userId;
  }

  if (group.bloqueado) entity.bloqueado_c = group.bloqueado;
  if (group.name) entity.name = group.name;
  if (group.description) entity.description = group.description;
  if (group.secuencia) entity.secuencia_c = `${group.secuencia}`;
  if (group.capacidad) entity.capacidad_c = `${group.capacidad ?? 0}`;
  if (group.duracion) entity.duracion_c = new Date(group.duracion);
  if (group.fechaPlan) entity.fecha_plan_c = new Date(group.fechaPlan);
  if (group.horaFin) entity.hora_fin_c = new Date(group.horaFin);
  if (group.horaInicio) entity.hora_inicio_c = new Date(group.horaInicio);

  return entity;
}