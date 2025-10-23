import { ApiProperty } from '@nestjs/swagger';

export class ConductorDto {
  @ApiProperty({ description: 'Nombre del conductor' })
  nombre: string;

  @ApiProperty({ description: 'ID del usuario conductor' })
  userId: string;

  @ApiProperty({ description: 'Tipo de conductor (código)' })
  tipo: string;

  @ApiProperty({ description: 'Descripción del tipo de conductor' })
  tipoLabel: string;

  @ApiProperty({ description: 'ID de la división del conductor' })
  divisionId: string;

  @ApiProperty({ description: 'Nombre de la división del conductor' })
  division: string;

  @ApiProperty({ description: 'ID del mercado del conductor' })
  mercadoId: string;

  @ApiProperty({ description: 'Nombre del mercado del conductor' })
  mercado: string;

  @ApiProperty({ description: 'ID de la regional del conductor' })
  regionalId: string;

  @ApiProperty({ description: 'Nombre de la regional del conductor' })
  regional: string;

  @ApiProperty({ description: 'Nombre completo del usuario conductor' })
  nombreUsuario: string;
}

export class VehiclePlanningDto {
  @ApiProperty({ description: 'ID único del vehículo' })
  id: string;

  @ApiProperty({ description: 'Nombre del vehículo' })
  nombre: string;

  @ApiProperty({ 
    description: 'ID del área de mercado', 
    nullable: true 
  })
  idamercado: string | null;

  @ApiProperty({ 
    description: 'Nombre del área de mercado', 
    nullable: true 
  })
  amercado: string | null;

  @ApiProperty({ description: 'ID de la división' })
  iddivision: string;

  @ApiProperty({ description: 'Nombre de la división' })
  division: string;

  @ApiProperty({ description: 'ID de la regional' })
  idregional: string;

  @ApiProperty({ description: 'Nombre de la regional' })
  regional: string;

  @ApiProperty({ description: 'Capacidad del vehículo' })
  capacidad: number;

  @ApiProperty({ description: 'Tipo de auto' })
  tipoAuto: string;

  @ApiProperty({ description: 'ID del estado del vehículo' })
  estadoVehiculoId: string;

  @ApiProperty({ description: 'Estado del vehículo' })
  estadoVehiculo: string;

  @ApiProperty({ 
    description: 'Lista de conductores asignados', 
    type: [ConductorDto] 
  })
  conductores: ConductorDto[];
}