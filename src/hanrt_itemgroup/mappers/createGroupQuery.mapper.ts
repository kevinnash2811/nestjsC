import { CreateGroupQueryDto } from "../dto";
import { HanrtItemGroupEntity } from "../entities";
import { GroupResultToCreate } from "../interface";

export const CreateGroupQueryToEntity = (groupDto: CreateGroupQueryDto): HanrtItemGroupEntity => {
  return {
    id: crypto.randomUUID(),
    name: groupDto.name,
    description: groupDto.description,
    date_entered: new Date(),
    date_modified: new Date(),
    deleted: 0,
    created_by: groupDto.userId,
    modified_user_id: groupDto.userId,
    assigned_user_id: groupDto.userId,
    secuencia_c: `${groupDto.secuencia}`,
    capacidad_c: `${groupDto.capacidad ?? 0}`,
    duracion_c: new Date(groupDto.duracion),
    fecha_plan_c: new Date(groupDto.fechaPlan),
    hora_fin_c: new Date(groupDto.horaFin),
    hora_inicio_c: new Date(groupDto.horaInicio),
    bloqueado_c: groupDto.bloqueado,
  }
}

export const DBResultToCreateDto = (group: GroupResultToCreate): CreateGroupQueryDto => {
  return {
    bloqueado: group.bloqueado_c,
    description: group.description,
    duracion: group.duracion_c,
    fechaPlan: group.fecha_plan_c,
    horaFin: group.hora_fin_c,
    horaInicio: group.hora_inicio_c,
    name: group.name,
    secuencia: Number(group.secuencia_c ?? '0'),
    userId: group.assigned_user_id,
    capacidad: Number(group.capacidad_c ?? '0') ?? undefined,
    idVehiculo: group.vehicleId ?? undefined,
    rutas: [],
  }
}