import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
  EMPTY = '',
}
export enum OrderByOptions {
  NAME = 'first_name',
  LASTNAME = 'last_name',
  PHONE = 'phone_mobile',
  TYPE = 'portal_user_type',
  TITLE = 'title',
  EMPTY = '',
}

export class ContactFilterDto {
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
    default: 'first_name',
    description: 'Ordenamiento por columna'
  })
  @IsString({ message: ' - No es una cadena valida'})
  @IsOptional()
  @IsEnum(OrderByOptions, { message: 'sortBy - Debe ser uno de los siguientes valores ' + Object.values(OrderByOptions).join(' | ') })
  sortBy: string;
  
  @ApiProperty({
    default: 'DESC',
    description: 'direccion de order ASC|DESC forma Ascendente o Descendente',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsEnum(OrderDirection, { message: 'order - debe ser ASC o DESC' })
  order: string;

  @ApiProperty({
    required: false,
    description: 'Cadena de búsqueda'
  })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({
    required: false,
    description: 'Carnet de identidad del contacto'
  })
  @IsOptional()
  @IsString()
  ci: string;

  @ApiProperty({
    required: false,
    description: 'ID Regional perteneciente a la cuenta del contacto asociado'
  })
  @IsOptional()
  @IsString()
  regional: string;

  @ApiProperty({
    required: false,
    description: 'ID Division perteneciente a la cuenta del contacto asociado'
  })
  @IsOptional()
  @IsString()
  division: string;

  @ApiProperty({
    required: false,
    description: 'ID Mercado perteneciente a la cuenta del contacto asociado'
  })
  @IsOptional()
  @IsString()
  mercado: string;

  @ApiProperty({
    description: 'ID del rubro o industria del contacto',
    required: false,
  })
  @IsOptional()
  @IsString()
  rubro: string;

  @ApiProperty({
    description: 'ID del subrubro del contacto',
    required: false,
  })
  @IsOptional()
  @IsString()
  subrubro: string; 

  @ApiProperty({
    default: '',
    description: 'IDs de especialidades separadas por coma',
    example: 'AFC2-32DA3-XXX-XXXX,AD99-34D-XXX-XXXX,BFD3-2343-XXX-XXXX',
    required: false
  })
  @IsOptional()
  @IsString()
  especialidades: string;

  @ApiProperty({
    description: 'Tipo de cuenta',
    example: 'Privada',
    required: false,
  })
  @IsOptional()
  @IsString()
  account_type?: string;

  @ApiProperty({
    description: 'Categoria de la cuenta',
    example: 'A',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'Categoria 2 de la cuenta',
    example: 'B',
    required: false,
  })
  @IsString()
  @IsOptional()
  category2?: string;

  @ApiProperty({
    description: 'Tipo de cliente',
    example: 'Inversor',
    required: false,
  })
  @IsString()
  @IsOptional()
  client_type?: string;

  @ApiProperty({
    description: 'Nombre comercial de la cuenta',
    example: 'Famacia Don Pepe',
    required: false,
  })
  @IsString()
  @IsOptional()
  comercial_name?: string;

  @ApiProperty({
    description: 'Dirección de la cuenta',
    example: 'avenida santa cruz',    
    required: false,
  })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiProperty({
    description: 'Identificador del grupo al que pertenece la cuenta',
    example: 'BO11_DISTRIBUIDORA',
    required: false,
  })
  @IsString()
  @IsOptional()
  customerGroup?: string;
  
  @ApiProperty({
    description: 'Identificadores de las zonas separados por comas',
    example: 'CENTRC,CENTRO,CENTTJ',
    required: false,
  })
  @IsString()
  @IsOptional()
  zona_venta_c?: string;

  @ApiProperty({
    description: 'Identificadores de los usuarios separados por comas',
    example: '550e8400-e29b-41d4-a716-446655440000,550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  @IsString()
  @IsOptional()
  assigned_to?: string;

  @ApiProperty({
    description: 'Id del Ciclo',
    required: false,
  })
  @IsString()
  @IsOptional()
  cicloSelect?: string;

  @ApiProperty({
    description: 'Ids de contactos para obtener o ignorar',
    example: ['123456-de31-ea22-fd23423', 'fedeca2-ada3-da12-dcdb342'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Type(() => Array)
  contactIds: string[];

  @ApiProperty({
    description: 'true: traer los contactos que tienen los ids enviados {contactIds}, false: traer los contactos que NO tienen los ids enviados {contactIds}',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeContactIds: boolean;

  @ApiProperty({
    description: 'Fecha para traer tareas para las cuentas',
    example: '2025-12-25',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tasksDate: string;

  @ApiProperty({
    description: 'Id del usuario que realiza la consulta, se usa para filtrar las tareas por el usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}