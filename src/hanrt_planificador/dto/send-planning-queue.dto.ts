import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { TypesPlanning } from 'src/producer_rabbit/interface';

export class SendPlanningQueueDto {
   
    @ApiProperty({
        default:[
            '193fcf32-4c7a-0b8b-175a-66a790d4b1fa',
            'bbad28ea-a83e-13fa-77c1-66a790f60391'
        ],
        description: 'ids de la planificacion'
    })
    @IsOptional()
    itemrutaList: string[]

    @ApiProperty({
        default: TypesPlanning.PRUEBA,
        enum: TypesPlanning,
        description: 'tipo de la planificacion'
    })
    @IsOptional()
    @IsEnum(TypesPlanning)
    typePlanning: string;
}
