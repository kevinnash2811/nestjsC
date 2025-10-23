import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreatePlanificadorDto {
  @ApiProperty({
    example: 'Planificacion test',
    description: 'Nombre de la planificación',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: '1', description: 'ID del usuario responsable' })
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'Descripcion Nest',
    description: 'Descripción de la planificación',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'T01', description: 'Tipo de planificación' })
  @IsOptional()
  @IsString()
  tipo: string;

  @ApiProperty({ example: '03', description: 'ID de la división' })
  @IsOptional()
  @IsString()
  iddivision?: string;

  @ApiProperty({ example: '03_01', description: 'ID de mercado' })
  @IsOptional()
  @IsString()
  idamercado?: string;

  @ApiProperty({ example: '01_01', description: 'ID de Región (regional)' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({ example: '01', description: 'Id canal' })
  @IsOptional()
  @IsString()
  canal?: string;

  @ApiProperty({ example: '0afdeaa-12ade-2245bcb-123123123', description: 'Id ciclo' })
  @IsOptional()
  @IsString()
  cycleId?: string;

  @ApiProperty({ example: 'EP01', description: 'Estado de la planificación' })
  @IsString()
  state: string;

  @ApiProperty({
    example: '2025-09-10T12:30:00.000Z',
    description: 'Fecha de inicio UTC',
  })
  @IsOptional()
  @IsString()
  fechaInicio?: string;

  @ApiProperty({ example: '2025-09-12T12:30:00.000Z', description: 'Fecha de fin UTC' })
  @IsOptional()
  @IsString()
  fechaFin?: string;
}
