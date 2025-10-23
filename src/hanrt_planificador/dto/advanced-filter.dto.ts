import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Filter, FilterRutas } from '../interface';

export class FilterAdvancedPlanificacionesDto {
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
        "1"
      ],
      name: '',
      description: '',
      tipo: 'T01',
      iddivisionC: '',
      idamercadoC: '',
      regionC: '',
      canalC: '',
      estadoPlanificacionC: '',
      fechaInicioC: '',
      fechaFinC: '',
    },
    description: 'Filtros de busqueda rapida y avanzada de planificaciones',
  })
  @IsOptional()
  filter: Filter;
}

export class FilterAdvancedRutasDto {
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
      codUsuario: [
        "10002267"
      ],
      regional: null,
      areaMercado: null,
      division: null,
      fecha:{'from':'2024-12-23','to':'2024-12-24'}
      
    },
    description: 'Filtros de busqueda rapida y avanzada de planificaciones',
  })
  @IsOptional()
  filter: FilterRutas;
}
