import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IUpdatePlanningItem } from '../interface';

export class UpdateStateHanrtPlanificadorDto {
  @ApiProperty({
    default: '',
    description: 'Usuario que realiza el cambio',
    required: true,
  })
  @IsOptional()
  @IsString()
  usuario?: string;

  @ApiProperty({
    default: 'EP01',
    description: 'Estado a cambiar',
    required: false,
  })
  @IsOptional()
  @IsString()
  estado?: string;
}

export class UpdatePlanningDto {
  @ApiProperty({
    default: [],
    description: 'registros nuevos',
  })
  @IsOptional()
  inserts: IUpdatePlanningItem[];

  @ApiProperty({
    default: [],
    description: 'registros a actualizar',
  })
  @IsOptional()
  updates: IUpdatePlanningItem[];

  @ApiProperty({
    default: [],
    description: 'registros a eliminar',
  })
  @IsOptional()
  delets: IUpdatePlanningItem[];

  @ApiProperty({
    default: '',
    description: 'Usuario que realiza el cambio',
    required: true,
  })
  @IsOptional()
  @IsString()
  usuario?: string;
}
