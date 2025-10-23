import { ApiProperty } from '@nestjs/swagger';

export class TareaLogisticDto {
  @ApiProperty({
    description: 'Nombre de la tarea',
    example: 'Entrega'
  })
  name: string;

  @ApiProperty({
    description: 'Descripción de la tarea',
    example: 'Tarea plan de distribucion'
  })
  description: string;

  @ApiProperty({
    description: 'ID de la división',
    example: 'BO10'
  })
  iddivision_c: string;

  @ApiProperty({
    description: 'Nombre de la división',
    example: 'BO10 COFAR'
  })
  division: string;

  @ApiProperty({
    description: 'ID del área de mercado',
    example: 'BO10_10'
  })
  idamercado_c: string;

  @ApiProperty({
    description: 'Nombre del área de mercado',
    example: '10 Medicamentos'
  })
  amercado: string;

  @ApiProperty({
    description: 'ID de la región',
    example: 'BO04_04'
  })
  region_c: string;

  @ApiProperty({
    description: 'Nombre de la región',
    example: 'La Paz'
  })
  region: string;

  @ApiProperty({
    description: 'ID del tipo de tarea',
    example: 'T02'
  })
  tipo_tarea_c: string;

  @ApiProperty({
    description: 'Descripción del tipo de tarea',
    example: 'Distribución'
  })
  tipotarea: string;

  @ApiProperty({
    description: 'ID del estado',
    example: 'E01'
  })
  estado_c: string;

  @ApiProperty({
    description: 'Descripción del estado',
    example: 'Activo'
  })
  estadotarea: string;

  @ApiProperty({
    description: 'Indica si es obligatorio',
    example: 'yes'
  })
  obligatorio_c: string;

  @ApiProperty({
    description: 'ID para quién es la tarea',
    example: 'H01'
  })
  tarea_para_c: string;

  @ApiProperty({
    description: 'Descripción para quién es la tarea',
    example: 'Cabecera'
  })
  tarea_para: string;

  @ApiProperty({
    description: 'Fecha de inicio de la regla',
    example: '1900-03-01T15:00:00.000Z'
  })
  fecha_inicio_regla: Date;

  @ApiProperty({
    description: 'Fecha de fin de la regla',
    example: '3999-03-21T15:00:00.000Z'
  })
  fecha_fin_regla: Date;

  @ApiProperty({
    description: 'ID único de la regla',
    example: '86fcdd28-b3c6-462d-1bec-67dd692c0388'
  })
  idRegla: string;
}