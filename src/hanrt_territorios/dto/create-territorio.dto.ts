import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import e from 'express';

export class CreateTerritorioDTO {
  @ApiProperty({
    default: 'Territorio - LPZ - ZONA SUR',
    description: 'Nombre del territorio',
  })
  @IsString()
  name: string;

  @ApiProperty({
      default: 'Descripcion del Territorio',
      description: 'Descripcion del Territorio',
    })
    @IsString()
    description: string;

  @ApiProperty({
    default: '',
    description: 'ID del usuario asignado',
  })
  @IsString()
    assigned_user_id: string;

  @ApiProperty({
    default: 'BO10',
    description: 'Division / Org. de ventas del territorio',
  })
  @IsString()
  iddivision_c: string;

  @ApiProperty({
    default: 'BO10_10',
    description: 'Mercado / Sector del territorio',
  })
  @IsString()
  idamercado_c: string;

  @ApiProperty({
    default: 'BO04_04',
    description: 'Regional del territorio',
  })
  @IsString()
  idregional_c: string;

  @ApiProperty({
    default: 'BO10_10_10',
    description: 'Canal del territorio',
  })
  @IsString()
  idcanal_c: string;

  @ApiProperty({
    default: 'T02',
    description: 'Tipo de territorio',
  })
  @IsString()
  tipo_c: string;

  @ApiProperty({
    default: 'E01',
    description: 'Estado del territorio',
  })
  @IsString()
  estado_c: string;


}


export class TerritorioPatchDTO {
  @ApiProperty({
    description: 'Nombre del territorio',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Descripción del Territorio',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'División / Org. de ventas del territorio',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  iddivision_c: string;

  @ApiProperty({
    description: 'Mercado / Sector del territorio',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  idamercado_c: string;

  @ApiProperty({
    description: 'Regional del territorio',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  idregional_c: string;

  @ApiProperty({
    description: 'Canal del territorio',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  idcanal_c: string;

  @ApiProperty({
    description: 'Tipo de territorio',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  tipo_c: string;

  @ApiProperty({
    description: 'Estado del territorio',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  estado_c: string;

  @ApiProperty({
    description: 'ID del usuario que modifica',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  modified_user_id: string;
}

export interface Filter {
  assigned_to: string[];
  modified_to: string;
  created_to: string;
  name: string;
  description: string;
  tipo: string;
  iddivisionC: string;
  idamercadoC: string;
  regionC: string;
  canalC: string;
  estado: string;
  fechaInicioC: string;
  fechaFinC: string;
  easyFilter: string;
}
export class FilterAdvancedTerritoriosDto {
  @ApiProperty({
    default: 1,
    description: 'Pagina',
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    default: 50,
    description: 'Filas por pagina',
  })
  @IsNumber()
  rowsPerPage: number;

  @ApiProperty({
    default: {
      assigned_to: [
        "24aa7a70-a853-a2aa-b321-66a8e1c673c0"
      ],
      modified_to: '',
      created_to: '',
      name: '',
      description: '',
      tipo: '',
      iddivisionC: '',
      idamercadoC: '',
      regionC: '',
      canalC: '',
      estado: '',
      fechaInicioC: '',
      fechaFinC: '',
      easyFilter: '',
    },
    description: 'Filtros de busqueda rapida y avanzada de Territorios',
  })
  @IsOptional()
  filter: Filter;
}