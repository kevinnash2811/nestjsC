import { IsNumber }    from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist';
export class AccountLatLng {
    @ApiProperty({
        default: 0,
        description: 'Latitud',
        type: Number,
        format: 'float'
    })
    @IsNumber()
    jjwg_maps_lat_c: number;

    @ApiProperty({
        default: 0,
        description: 'Longitud',
        type: Number,
        format: 'float'
    })
    @IsNumber()
    jjwg_maps_lng_c: number;
}
