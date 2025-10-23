import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class MarkerDto {
  @ApiProperty({
    default: 'Marcador 1',
    description: 'Nombre del marcador',
    example: 'Marcador Central',
    type: String,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name: string;

  @ApiProperty({
    type: Number,
    description: 'Latitud del marcador',
    example: -17.7833,
    default: 0,
  })
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 15 },
    { message: 'La latitud debe ser un número válido' },
  )
  @Min(-90, { message: 'La latitud no puede ser menor a -90' })
  @Max(90, { message: 'La latitud no puede ser mayor a 90' })
  jjwg_maps_lat: number;

  @ApiProperty({
    type: Number,
    description: 'Longitud del marcador',
    example: -63.1833,
    default: 0,
  })
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 15 },
    { message: 'La longitud debe ser un número válido' },
  )
  @Min(-180, { message: 'La longitud no puede ser menor a -180' })
  @Max(180, { message: 'La longitud no puede ser mayor a 180' })
  jjwg_maps_lng: number;

  @ApiProperty({
    type: Number,
    description: 'Secuencia  del marcador',
    example: 1,
    default: 0,
  })
  @IsNumber()
  secuencia_c: number;
}

export class MarkerDtoPatch {
  @ApiProperty({
    description: 'ID del marcador',
    type: String,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Nombre del marcador',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Latitud del marcador',
  })
  @IsString()
  jjwg_maps_lat: string;

  @ApiProperty({
    type: String,
    description: 'Longitud del marcador',
  })
  @IsString()
  jjwg_maps_lng: string;

  @ApiProperty({
    type: Number,
    description: 'Secuencia  del marcador',
  })
  @IsNumber()
  secuencia_c: number;
}

export class CreateZonaDTO {
  @ApiProperty({
    default: 'd01d9b6c-485e-4470-b389-8ba199b3eb32',
    description: 'Id del territorio al que pertenece la zona',
  })
  @IsString()
  idTerritorio: string;

  @ApiProperty({
    default: 'ZONA SUR',
    description: 'Nombre de la zona',
  })
  @IsString()
  name: string;

  @ApiProperty({
    default: 'Descripcion del Zona',
    description: 'Descripcion del Zona',
  })
  @IsString()
  description: string;

  @ApiProperty({
    default: '1',
    description: 'ID del usuario asignado',
  })
  @IsString()
  assigned_user_id: string;

  @ApiProperty({
    default: 'E01',
    description: 'Estado del zona',
  })
  @IsString()
  estado_c: string;

  @ApiProperty({
    default: 'green',
    description: 'background_color',
  })
  @IsString()
  background_color: string;

  @ApiProperty({
    default: 'red',
    description: 'border_color',
  })
  @IsString()
  border_color: string;

  @ApiProperty({
    default: '50',
    description: 'border_width',
  })
  @IsString()
  border_width: string;

  @ApiProperty({
    default: '2',
    description: 'layer_level',
  })
  @IsString()
  layer_level: string;

  @ApiProperty({
    default: '2',
    description: 'background_opacity',
  })
  @IsString()
  background_opacity: string;

  @ApiProperty({
    default: '2',
    description: 'zonaDistribucion',
  })
  @IsString()
  zonaDistribucion: string;

  @ApiProperty({
    description: 'markers',
    type: [MarkerDto], // Array de objetos MarkerDto
  })
  @IsArray()
  markers: MarkerDto[];
}

export class ZonaPatchDTO {
  @ApiProperty({
    description: 'Nombre del zona',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Descripción del Zona',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'División / Org. de ventas del zona',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  iddivision_c: string;

  @ApiProperty({
    description: 'Mercado / Sector del zona',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  idamercado_c: string;

  @ApiProperty({
    description: 'Regional del zona',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  idregional_c: string;

  @ApiProperty({
    description: 'Canal del zona',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  idcanal_c: string;

  @ApiProperty({
    description: 'Tipo de zona',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  tipo_c: string;

  @ApiProperty({
    description: 'Estado del zona',
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

  @ApiProperty({
    description: 'background_color',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  background_color: string;

  @ApiProperty({
    description: 'border_color',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  border_color: string;

  @ApiProperty({
    description: 'border_width',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  border_width: string;

  @ApiProperty({
    description: 'layer_level',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  layer_level: string;

  @ApiProperty({
    description: 'background_opacity',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  background_opacity: string;

  @ApiProperty({
    description: 'zonaDistribucion',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  zonaDistribucion: string;

  @ApiProperty({
    description: 'markers',
    type: [MarkerDto], // Array de objetos MarkerDto
  })
  @IsArray()
  markers: MarkerDto[];
}
