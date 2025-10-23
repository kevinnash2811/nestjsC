import { IsString, IsOptional, IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CreationDate {
  @ApiProperty({ default: '', description: 'Fecha desde' })
  @IsString()
  @IsOptional()
  from: string;

  @ApiProperty({ default: '', description: 'Fecha hasta' })
  @IsString()
  @IsOptional()
  to: string;

  @ApiProperty({ default: '', description: 'Operador de la fecha' })
  @IsString()
  @IsOptional()
  operator: string;

  @ApiProperty({ default: '', description: 'Opción de la fecha' })
  @IsString()
  @IsOptional()
  option: string;
}
export class Filter2 {
  @ApiProperty({ default: '', description: 'Nombre' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ default: '', description: 'Apellido' })
  @IsString()
  @IsOptional()
  lastname: string;

  @ApiProperty({ default: '', description: 'Nombre comercial' })
  @IsString()
  @IsOptional()
  comercial_name: string;

  @ApiProperty({ default: '', description: 'Tipo de cliente' })
  @IsString()
  @IsOptional()
  client_type: string;

  @ApiProperty({ default: '', description: 'Tipo de cuenta' })
  @IsString()
  @IsOptional()
  account_type: string;

  @ApiProperty({ default: '', description: 'Código AIO' })
  @IsString()
  @IsOptional()
  aio_code: string;

  @ApiProperty({ default: '', description: 'NIT/CI' })
  @IsString()
  @IsOptional()
  nit_ci: string;

  @ApiProperty({ default: '', description: 'Celular' })
  @IsString()
  @IsOptional()
  cellphone: string;

  @ApiProperty({ default: '', description: 'Correo electrónico' })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({ default: '', description: 'Industria' })
  @IsString()
  @IsOptional()
  industry: string;

  @ApiProperty({ default: '', description: 'Subindustria' })
  @IsString()
  @IsOptional()
  sub_industry: string;

  @ApiProperty({ default: '', description: 'País' })
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty({ default: '', description: 'Estado' })
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty({ default: '', description: 'Ciudad' })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({ default: '', description: 'Calle' })
  @IsString()
  @IsOptional()
  street: string;

  @ApiProperty({ default: '', description: 'Tipo de documento' })
  @IsString()
  @IsOptional()
  document_type: string;

  @ApiProperty({ default: '', description: 'Régimen fiscal' })
  @IsString()
  @IsOptional()
  tax_regime: string;

  @ApiProperty({ default: '', description: 'Sitio web' })
  @IsString()
  @IsOptional()
  website: string;

  @ApiProperty({ type: [String], description: 'Creado por', default: [] })
  @IsArray()
  @IsOptional()
  created_by: string[];

  @ApiProperty({ type: [String], description: 'Modificado por', default: [] })
  @IsArray()
  @IsOptional()
  modified_by: string[];

  @ApiProperty({ type: [String], description: 'Asignado a', default: [] })
  @IsArray()
  @IsOptional()
  assigned_to: string[];

  @ApiProperty({ type: CreationDate, description: 'Fecha de creación' })
  @ValidateNested()
  @Type(() => CreationDate)
  @IsOptional()
  creation_date: CreationDate;

  @ApiProperty({ default: '', description: 'Latitud y longitud' })
  @IsString()
  @IsOptional()
  latlng: string;

  @ApiProperty({ default: '', description: 'Filtro fácil' })
  @IsString()
  @IsOptional()
  easyFilter: string;
}