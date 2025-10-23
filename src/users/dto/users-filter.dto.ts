import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Filter } from '../interface';
export class FilterUsersDto {
    @ApiProperty({
        default: 1,
        description: 'Pagina'
    })
    @IsNumber()
    page: number;

    @ApiProperty({
        default: 100,
        description: 'Filas por pagina'
    })
    @IsNumber()
    rowsPerPage: number;

    @ApiProperty({
        default: {
            easyFilter : '',
            reports_to_id: '',
            iddivision_c : '',
            idregional_c: '',
            idamercado_c: ''
            
            
        },
        description: 'Filtro de busqueda de Usuarios por supervisor'
    })
    @IsOptional()
    filter: Filter;

    @ApiProperty({
        default: 'user_name',
        description: 'Ordenamiento por la columna'
    })
    @IsString()
    @IsOptional()
    sortBy: string;

    @ApiProperty({
        default: 'desc',
        description: 'De forma Ascendente o Descendente'
    })
    @IsString()
    order: string;
}
