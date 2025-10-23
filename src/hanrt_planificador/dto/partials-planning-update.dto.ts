import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject, IsOptional, IsString } from "class-validator";

export class UpdateForDeletes {
  @ApiProperty({
    example: ['xxxxx-xxxx-xxx', 'yyyyy-yyyy-yyy'],
    description: 'Array de IDs de grupos a eliminar',
    type: String,
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  groups?: string[];

  @ApiProperty({
    example: ['xxxxx-xxxx-xxxx-xxxx', 'yyyyy-yyyy-yyyy-yyyy'],
    description: 'Array de IDs de rutas a eliminar',
    type: String,
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  routes?: string[];

  @ApiProperty({
    example: {
      'id-ruta': ['id-tarea', 'idtarea1'],
      'id-ruta2': ['id-tarea2', 'idTareaX']
    },
    description: 'Mapeo de ID de ruta a ID de tarea a eliminar',
    type: 'object',
    additionalProperties: {
      type: 'string'
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  tasks?: Record<string, string[]>;

  @ApiProperty({
    example: {
      'id-ruta': ['id-entrega', 'identrega2'],
      'id-rutax': ['identrega3', 'identrega4'],
      'id-rutay': ['id-entrega-y'],
    },
    description: 'Mapeo de ID de ruta a array de ID de entrega a eliminar',
    type: 'object',
    additionalProperties: {
      type: 'string'
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  deliveries?: Record<string, string[]>;
}

export class VehiclesIds {
  @ApiProperty({
    example: ['xxxxx-xxxx-xxxx-xxxx', 'yyyyy-yyyy-yyyy-yyyy'],
    description: 'Array de IDs vehiculos a agregar',
    type: String,
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  add?: string[];


  @ApiProperty({
    example: ['xxxxx-xxxx-xxxx-xxxx', 'yyyyy-yyyy-yyyy-yyyy'],
    description: 'Array de IDs de vehiculos a eliminar',
    type: String,
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  delete?: string[];
}