import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsInt, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { CreateRouteQueryDto } from 'src/hanrt_itemruta/dto';

export class CreateGroupQueryDto {
  @ApiProperty({
    example: 'Grupo test 1',
    description: 'Nombre del grupo',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Descripcion test 1',
    description: 'Descripción del grupo',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: '2025-09-19T12:30:00.000Z',
    description: 'Fecha de la planificación',
  })
  @IsString()
  fechaPlan: string;

  @ApiProperty({ example: 30, description: 'Capacidad de la ruta' })
  @IsOptional()
  @IsInt()
  capacidad?: number;

  @ApiProperty({
    example: '2025-09-10T12:00:00.000Z',
    description: 'Hora de inicio',
  })
  @IsString()
  horaInicio: string;

  @ApiProperty({
    example: '2025-09-10T04:30:00.000Z',
    description: 'Duración de la ruta',
  })
  @IsString()
  duracion: string;

  @ApiProperty({ example: '2025-09-10T12:30:00.000Z', description: 'Hora de fin' })
  @IsString()
  horaFin: string;

  @ApiProperty({ example: '1', description: 'ID del usuario responsable' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 1, description: 'Secuencia de la ruta' })
  @IsInt()
  secuencia: number;

  @ApiProperty({
    example: '25534e95-e71f-fb66-f3f7-667ec51498ee',
    description: 'ID del vehículo asignado',
    required: false,
  })
  @IsString()
  @IsOptional()
  idVehiculo?: string;

  @ApiProperty({
    example: '00',
    description: 'bloqueo de la ruta',
  })
  @IsString()
  bloqueado: string;

  @ApiProperty({
    description: 'Array de Rutas del grupo',
    type: CreateRouteQueryDto,
    isArray: true,
    required: false,
  })
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  @Type(() => CreateRouteQueryDto)
  rutas?: CreateRouteQueryDto[];
}
