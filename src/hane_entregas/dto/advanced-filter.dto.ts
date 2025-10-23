import { IsString, MinLength, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist';
import { Filter } from '../interface';
export class FilterAdvancedEntregasDto {
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
            name: '',
            lastname: '',
            comercial_name: '',
            client_type:'',
            account_type:'',
            aio_code:'',
            nit_ci:'',
            cellphone:'',
            email:'',
            industry:'',
            sub_industry:'',
            country:'',
            state:'',
            city:'',
            street:'',
            document_type:'',
            tax_regime:'',
            website:'',
            created_by:[],
            modified_by:[],
            assigned_to:[],
            date: {
                from: '',
                to: ''
            },
            start_date:'',
            end_date:'',
            operator: '',
            latlng:'',
            statusEntrega:'',
            easyFilter:'',
            zona_venta_c:[],
            category:'',
            category2:'',
            campaign:'',
            customerGroup: '',
            exclude: '',
            planificacion: '',
            includes: ''
        },
        description: 'Filtros de busqueda rapida y avanzada de cuentas'
    })
    @IsOptional()
    filter: Filter;

    @ApiProperty({
        default: 'nombre',
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
