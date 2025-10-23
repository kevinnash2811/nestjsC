import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { TareaLogisticDto } from "src/hanrt_tareasplan/dto";
import { VehiclePlanningDto } from "src/hans_vehiculos/dto/planning-vehicles.dto";
import { UserPlanningDto } from "src/users/dto";

export class PlanificadorHeaderDto {
  @ApiProperty({
    example: '293b6-105-444-b06-b68472331',
    description: 'ID único de la planificación',
  })
  id: string;

  @ApiProperty({
    example: 'Agosto-Lunes-14:21-xxx',
    description: 'Nombre de la planificación',
  })
  name: string;

  @ApiPropertyOptional({ example: null, description: 'ID del ciclo' })
  cycleId?: string | null;

  @ApiPropertyOptional({ example: null, description: 'Nombre del ciclo' })
  cycleName?: string | null;

  @ApiPropertyOptional({
    example: null,
    description: 'Fecha de inicio del ciclo',
  })
  cycleStartDate?: string | null;

  @ApiPropertyOptional({ example: null, description: 'Fecha de fin del ciclo' })
  cycleEndDate?: string | null;

  @ApiPropertyOptional({ example: null, description: 'Estado del ciclo' })
  cycleState?: string | null;

  @ApiPropertyOptional({ example: null, description: 'Días del ciclo' })
  cycleDays?: number | null;

  @ApiPropertyOptional({
    example: null,
    description: 'Horas por día en el ciclo',
  })
  cycleHoursDay?: number | null;

  @ApiPropertyOptional({
    example: null,
    description: 'Valor del estado del ciclo',
  })
  estadoValorCiclo?: string | null;

  @ApiPropertyOptional({
    example: null,
    description: 'Cantidad de visitas por día en el ciclo',
  })
  cantidadVisitasDiaCiclo?: number | null;

  @ApiProperty({ example: 'BO10', description: 'ID de la división' })
  iddivision: string;

  @ApiProperty({ example: 'BO10 COFAR', description: 'Nombre de la división' })
  division: string;

  @ApiProperty({ example: '', description: 'ID de mercado' })
  idamercado: string;

  @ApiProperty({ example: 'Todas', description: 'Nombre del mercado' })
  amercado: string;

  @ApiProperty({ example: 'BO04_04', description: 'ID de la región' })
  regionId: string;

  @ApiProperty({ example: 'La Paz', description: 'Nombre de la región' })
  region: string;

  @ApiProperty({ example: '', description: 'ID del canal' })
  canal: string;

  @ApiProperty({ example: 'T02', description: 'Tipo de planificación ID - codigo' })
  tipoId: string;

  @ApiProperty({
    example: 'Distribución',
    description: 'Etiqueta del tipo de planificación',
  })
  tipo: string;

  @ApiProperty({
    example: 'EP02',
    description: 'Estado de la planificación (código)',
  })
  stateId: string;

  @ApiProperty({
    example: 'Aprobado',
    description: 'Estado de la planificación (texto)',
  })
  state: string;

  @ApiProperty({
    example: '2025-08-25T18:31:12.000Z',
    description: 'Fecha de creación',
  })
  fechaCreacion: string;

  @ApiProperty({ example: '', description: 'Descripción de la planificación' })
  description: string;

  @ApiProperty({
    example: '2025-08-25T00:00:00.000Z',
    description: 'Fecha de inicio de la planificación',
  })
  fechaInicio: string;

  @ApiProperty({
    example: '2025-08-25T00:00:00.000Z',
    description: 'Fecha de fin de la planificación',
  })
  fechaFin: string;
}

export class PlanificadorLogisticsDto {
  @ApiProperty({
    description: 'Tareas de cabecera',
    isArray: true,
  })
  tasks: TareaLogisticDto[];

  @ApiProperty({
    description: 'Vehículos asociados a la planificación',
    isArray: true,
  })
  vehicles: VehiclePlanningDto[];

  @ApiProperty({
    description: 'Usuarios asociados a la planificación',
    type: UserPlanningDto,
  })
  userPlan: UserPlanningDto;
}

export class ClonePlanDto {
  @ApiProperty({
    description: 'ID de planificación',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({
    description: 'Nombre para la nueva planificación clonada',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}