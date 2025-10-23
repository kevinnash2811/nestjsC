import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, Max, Min} from 'class-validator';


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
    { message: 'La latitud debe ser un número válido' }
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
    { message: 'La longitud debe ser un número válido' }
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

  @ApiProperty({
    description: 'Id del usuario asignado',
    example: 1,
    type: String,
  })
  @IsString()
  assigned_user_id: string;
}

export class CreateMarcadoresDTO {
   @ApiProperty({
    default: '53faac56-c580-40a8-9835-8df89a1d80cf',
    description: 'Id de la zona a la que se asignan los marcadores',
  })
  @IsString()
  idZona: string;
    @ApiProperty({
  description: 'markers',
  type: [MarkerDto] // Array de objetos MarkerDto
})
@IsArray()
markers: MarkerDto[];
  assigned_user_id: any;

}


