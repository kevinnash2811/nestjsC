import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class CreationDateDto {
  @ApiProperty({ description: 'Fecha de inicio' })
  @IsOptional()
  @IsString()
  from: string;

  @ApiProperty({ description: 'Fecha de finalización' })
  @IsOptional()
  @IsString()
  to: string;

  @ApiProperty({ description: 'Operador' })
  @IsOptional()
  @IsString()
  operator: string;

  @ApiProperty({ description: 'Opción' })
  @IsOptional()
  @IsString()
  option: string;
}

export class FilterDto {
  @ApiProperty({ description: 'Nombre' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Apellido' })
  @IsOptional()
  @IsString()
  lastname: string;

  @ApiProperty({ description: 'Nombre comercial' })
  @IsOptional()
  @IsString()
  comercial_name: string;

  @ApiProperty({ description: 'Tipo de cliente' })
  @IsOptional()
  @IsString()
  client_type: string;

  @ApiProperty({ description: 'Tipo de cuenta' })
  @IsOptional()
  @IsString()
  account_type: string;

  @ApiProperty({ description: 'Código AIO' })
  @IsOptional()
  @IsString()
  aio_code: string;

  @ApiProperty({ description: 'NIT o CI' })
  @IsOptional()
  @IsString()
  nit_ci: string;

  @ApiProperty({ description: 'Teléfono móvil' })
  @IsOptional()
  @IsString()
  cellphone: string;

  @ApiProperty({ description: 'Categoría' })
  @IsOptional()
  @IsString()
  category: string;

  @ApiProperty({ description: 'Correo electrónico' })
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({ description: 'Industria' })
  @IsOptional()
  @IsString()
  industry: string;

  @ApiProperty({ description: 'Sub-industria' })
  @IsOptional()
  @IsString()
  sub_industry: string;

  @ApiProperty({ description: 'País' })
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({ description: 'Estado' })
  @IsOptional()
  @IsString()
  state: string;

  @ApiProperty({ description: 'Ciudad' })
  @IsOptional()
  @IsString()
  city: string;

  @ApiProperty({ description: 'Calle' })
  @IsOptional()
  @IsString()
  street: string;

  @ApiProperty({ description: 'Tipo de documento' })
  @IsOptional()
  @IsString()
  document_type: string;

  @ApiProperty({ description: 'Régimen fiscal' })
  @IsOptional()
  @IsString()
  tax_regime: string;

  @ApiProperty({ description: 'Sitio web' })
  @IsOptional()
  @IsString()
  website: string;

  @ApiProperty({ description: 'Creado por' })
  @IsOptional()
  @IsArray()
  created_by: any[];

  @ApiProperty({ description: 'Modificado por' })
  @IsOptional()
  @IsArray()
  modified_by: any[];

  @ApiProperty({ description: 'Asignado a' })
  @IsOptional()
  @IsArray()
  assigned_to: any[];

  @ApiProperty({ description: 'Fecha de creación' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreationDateDto)
  creation_date: CreationDateDto; 

  @ApiProperty({ description: 'Latitud y longitud' })
  @IsOptional()
  @IsBoolean()
  latlng: boolean;

  @ApiProperty({ description: 'Filtro fácil' })
  @IsOptional()
  @IsString()
  easyFilter: string;

  @ApiProperty({ description: 'Zona de venta' })
  @IsOptional()
  @IsArray()
  zona_venta_c: string[];

  @ApiProperty({ description: 'Categoría 2' })
  @IsOptional()
  @IsString()
  category2: string;

  @ApiProperty({ description: 'Excluir' })
  @IsOptional()
  @IsString()
  exclude: string;

  @ApiProperty({ description: 'Grupo de clientes' })
  @IsOptional()
  @IsString()
  customerGroup: string;

  @ApiProperty({ description: 'Planificación' })
  @IsOptional()
  @IsString()
  planificacion: string;

  @ApiProperty({ description: 'Incluir' })
  @IsOptional()
  @IsString()
  includes: string;
}
