import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional, IsNotEmpty, IsNumber, IsArray } from 'class-validator';
// DTO para los productos
export class ProductDto {
    @ApiProperty({ description: 'Nombre del producto' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Cantidad del producto' })
    @IsNumber()
    cantidad: number;

    @ApiProperty({ description: 'Material del producto' })
    @IsNumber()
    material: number;

    @ApiProperty({ description: 'Código de artículos' })
    @IsNumber()
    garticulos: number;
}
// DTO para las filas
export class RowDto {
    @ApiProperty({ description: 'Índice de la fila' })
    @IsNumber()
    index: number;

    @ApiProperty({ description: 'Nombre de la cuenta' })
    @IsString()
    accName: string;

    @ApiProperty({ description: 'Código de la cuenta' })
    @IsString()
    accCode: string;

    @ApiProperty({ description: 'Nombre del usuario' })
    @IsString()
    UssName: string;

    @ApiProperty({ description: 'Nombre del usuario con formato HTML' })
    @IsString()
    UssNamed: string;

    @ApiProperty({ description: 'ID del proveedor', required: false })
    @IsOptional()
    @IsString()
    vendorId?: string;

    @ApiProperty({ description: 'Latitud' })
    @IsNumber()
    jjwg_maps_lat_c: number;

    @ApiProperty({ description: 'Longitud' })
    @IsNumber()
    jjwg_maps_lng_c: number;

    @ApiProperty({ description: 'Zona de transporte' })
    @IsString()
    zona_transporte_c: string;

    @ApiProperty({ description: 'Lista de productos' })
    @IsArray()
    productos: ProductDto[];

    @ApiProperty({ description: 'Código de entrega' })
    @IsString()
    code: string;

    @ApiProperty({ description: 'Fecha de entrega' })
    @IsString()
    fechaEntrega: string;

    @ApiProperty({ description: 'Número de entrega' })
    @IsString()
    entrega: string;

    @ApiProperty({ description: 'Calle de entrega' })
    @IsString()
    calle: string;

    @ApiProperty({ description: 'Código de organización de ventas' })
    @IsString()
    orgvt: string;

    @ApiProperty({ description: 'Código de oficina de ventas' })
    @IsString()
    ofvt: string;

    @ApiProperty({ description: 'Factura', required: false })
    @IsOptional()
    @IsString()
    factura?: string;

    @ApiProperty({ description: 'Material asociado' })
    @IsString()
    material: string;

    @ApiProperty({ description: 'Punto de venta', required: false })
    @IsOptional()
    @IsString()
    pos?: string;

    @ApiProperty({ description: 'Sector' })
    @IsString()
    sector: string;

    @ApiProperty({ description: 'Número de pedido' })
    @IsString()
    npedido: string;

    @ApiProperty({ description: 'Número fiscal', required: false })
    @IsOptional()
    @IsString()
    nfiscal?: string;

    @ApiProperty({ description: 'Condiciones de pago' })
    @IsString()
    condpago: string;

    @ApiProperty({ description: 'Fecha de creación' })
    @IsString()
    creado: string;

    @ApiProperty({ description: 'Clase de entrega' })
    @IsString()
    clase: string;

    @ApiProperty({ description: 'Hora de entrega' })
    @IsString()
    horaentrega: string;

    @ApiProperty({ description: 'Teléfono de contacto' })
    @IsString()
    telefono: string;

    @ApiProperty({ description: 'Grupo', required: false })
    @IsOptional()
    @IsString()
    grupo?: string;

    @ApiProperty({ description: 'Número de transporte', required: false })
    @IsOptional()
    @IsString()
    ntransporte?: string;

    @ApiProperty({ description: 'Código de distribución' })
    @IsString()
    cdistribucion: string;

    @ApiProperty({ description: 'Denominación' })
    @IsString()
    denom: string;

    @ApiProperty({ description: 'Código de artículos' })
    @IsNumber()
    garticulos: number;

    @ApiProperty({ description: 'Cantidad del producto' })
    @IsNumber()
    cantidad: number;

    @ApiProperty({ description: 'Unidad de medida' })
    @IsString()
    unmedida: string;

    @ApiProperty({ description: 'Contador' })
    @IsString()
    contador: string;

    @ApiProperty({ description: 'Unidad de medida', required: false })
    @IsString()
    umedida: string;

    @ApiProperty({ description: 'Denominación del producto' })
    @IsString()
    denominacion: string;
}

// DTO principal
export class MainDto {
    @ApiProperty({ type: [RowDto], description: 'Lista de filas' })
    @IsArray()
    rows: RowDto[];

    @ApiProperty({ type: [ProductDto], description: 'Lista de productos' })
    @IsArray()
    productos: ProductDto[];

    @ApiProperty({ description: 'id Usuario' })
    @IsString()
    current_user_id: string;

    @ApiProperty({ description: 'id division' })
    @IsString()
    iddivision_c: string;

}