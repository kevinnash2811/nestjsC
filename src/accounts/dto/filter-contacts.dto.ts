import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { FilterDto } from "./advanced-get-filter.dto";
export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}
export enum OrderByOptions {
  NAME = 'nombre',
  PHONE = 'telefono',
  CREATION = 'fecha_creacion',
  NIT = 'nit',
  CODE = 'codigo',
  EMAIL = 'correo',
  CITY = 'ciudad',
  CREATED_BY = 'creado_por',
  TYPE = 'tipo',
  CELLPHONE = 'celular',
  DEPARTMENT = 'departamento',
  MODIFIED = 'fecha_modificacion'
}

export class AccountWithContactsSimpleFilter{
  @ApiProperty({
    default: 1,
    description: 'Pagina'
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page: number;


  @ApiProperty({
    default: 15,
    description: 'Cantidad de registros'
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageSize: number;


  @ApiProperty({
    default: OrderByOptions.CREATION,
    description: 'Ordenamiento por columna'
  })
  @IsString({ message: 'sortBy - No es una cadena valida'})
  @IsOptional()
  @IsEnum(OrderByOptions, { message: 'sortBy - Debe ser uno de los siguientes valores ' + Object.values(OrderByOptions).join(' | ') })
  sortBy: string;

  @ApiProperty({
    default: OrderDirection.ASC,
    description: 'direccion de order ASC|DESC forma Ascendente o Descendente'
  })
  @IsString()
  @IsOptional()
  @IsEnum(OrderDirection, { message: 'order - debe ser ASC o DESC' })
  order: string;


  @ApiProperty({
    default: '',
    description: 'Cadena de búsqueda'
  })
  @IsOptional()
  @IsString()
  search: string;
}

export class AccountWithContactsFilter extends AccountWithContactsSimpleFilter{
  @ApiProperty({
    default: undefined,
    description: 'Filtros de busqueda rapida y avanzada de cuentas procesado'
  })
  @IsOptional()
  advanced: FilterDto;
}
