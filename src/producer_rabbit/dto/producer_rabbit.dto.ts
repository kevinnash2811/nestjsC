import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { TypesPlanning } from '../interface';

export class ProducerRabbitDto {
   
    @ApiProperty({
        default:[],
        description: 'datos de la prueba'
    })
    @IsOptional()
    itemrutaList: string[]

    @ApiProperty({
        default: TypesPlanning.PRUEBA,
        enum: TypesPlanning,
        description: 'tipo de la prueba'
    })
    @IsOptional()
    @IsEnum(TypesPlanning)
    typePlanning: TypesPlanning;
}

export class BodyPlanificador {
  @ApiProperty({
    default: 'cff6ece0-a806-db42-f20d-66bd0245b4ff',
    description: 'Id de la planficación',
  })
  @IsString()
  idPlanificacion: string;

  @ApiProperty({
    default: TypesPlanning.PRUEBA,
    enum: TypesPlanning,
    description: 'tipo de la prueba',
  })
  @IsOptional()
  @IsEnum(TypesPlanning)
  typePlanning: TypesPlanning;
}