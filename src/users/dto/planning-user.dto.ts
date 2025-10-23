import { ApiProperty } from '@nestjs/swagger';

export class UserPlanningDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 'xxxxxx00-2a47-23f9-e82f-68b5ee399acd'
  })
  id: string;

  @ApiProperty({
    description: 'Primer nombre del usuario',
    example: 'Zaida'
  })
  first_name: string;

  @ApiProperty({
    description: 'Apellidos del usuario',
    example: 'Galarza Chauca'
  })
  last_name: string;

  @ApiProperty({
    description: 'Título del usuario',
    example: null,
    nullable: true
  })
  title: string | null;

  @ApiProperty({
    description: 'ID de la división',
    example: ''
  })
  iddivision_c: string;

  @ApiProperty({
    description: 'Nombre de la división',
    example: 'Todas'
  })
  division: string;

  @ApiProperty({
    description: 'ID del área de mercado',
    example: ''
  })
  idamercado_c: string;

  @ApiProperty({
    description: 'Nombre del área de mercado',
    example: 'Todas'
  })
  amercado: string;

  @ApiProperty({
    description: 'ID del empleado',
    example: ''
  })
  idempleado_c: string;

  @ApiProperty({
    description: 'ID del vendedor',
    example: ''
  })
  idvendedor_c: string;

  @ApiProperty({
    description: 'Código del rol HBM',
    example: 'ADM'
  })
  rol_hbm_c: string;

  @ApiProperty({
    description: 'Etiqueta/descripción del rol HBM',
    example: 'ADM Administrador'
  })
  rol_hbm_label_c: string;
}