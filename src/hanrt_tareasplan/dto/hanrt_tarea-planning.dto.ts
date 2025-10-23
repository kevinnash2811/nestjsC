import { ApiProperty } from '@nestjs/swagger';

export class TareaPlanningDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, example: 'E01' })
  estado?: string | null;

  @ApiProperty({ required: false, example: 'Activo' })
  estadoLabel?: string | null;

  @ApiProperty({ required: false, example: 'yes' })
  obligatorio?: string | null;
}

export class ReglaTareasPlanningDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, example: 'DD-MM-YYYY' })
  fechaInicio?: string | null;

  @ApiProperty({ required: false, example: 'DD-MM-YYYY' })
  fechaFin?: string | null;

  @ApiProperty({ required: false, example: 'ER01' })
  estado?: string | null;

  @ApiProperty({ required: false, example: 'Activo' })
  estadoLabel?: string | null;

  @ApiProperty({ required: false, example: 'TP01' })
  tipo?: string | null;

  @ApiProperty({ required: false, example: 'Automático' })
  tipoLabel?: string | null;

  @ApiProperty({ type: TareaPlanningDto, isArray: true, })
  tareas: TareaPlanningDto[];
}
