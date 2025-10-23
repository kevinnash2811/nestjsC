import { ApiProperty } from "@nestjs/swagger";

export class AosProductoEntregaDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Producto XYZ',
  })
  nombre: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Descripción detallada del producto',
  })
  descripcion: string;

  @ApiProperty({
    description: 'Número de parte del producto',
    example: 'PN-12345',
  })
  partNumber: string;

  @ApiProperty({
    description: 'Descripción del ítem',
    example: 'Descripción específica del ítem',
  })
  itemDescripcion: string;

  @ApiProperty({
    description: 'Número de secuencia del producto',
    example: 1,
  })
  secuencia: number;

  @ApiProperty({
    description: 'Cantidad del producto',
    example: 10,
  })
  cantidad: number;

  @ApiProperty({
    description: 'Precio de lista del producto',
    example: 100.5,
  })
  precio: number;

  @ApiProperty({
    description: 'Descuento aplicado al producto',
    example: 10.0,
  })
  descuento: number;

  @ApiProperty({
    description: 'Precio unitario con descuento',
    example: 90.5,
  })
  conDescuento: number;

  @ApiProperty({
    description: 'Precio total del producto',
    example: 905.0,
  })
  total: number;
}

export class EntregaPlanningDto {
  @ApiProperty({
    description: 'ID de la entrega',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la entrega',
    example: 'Entrega Cliente ABC',
  })
  name: string;

  @ApiProperty({
    description: 'Fecha de entrega',
    example: '2024-01-15T10:30:00Z',
  })
  fechaEntrega: string;

  @ApiProperty({
    description: 'ID de la división',
    example: 'div-001',
  })
  idDivision: string;

  @ApiProperty({
    description: 'Nombre de la división',
    example: 'División Norte',
  })
  division: string;

  @ApiProperty({
    description: 'ID del mercado',
    example: 'merc-001',
  })
  idAmercado: string;

  @ApiProperty({
    description: 'Nombre del mercado',
    example: 'Mercado Retail',
  })
  amercado: string;

  @ApiProperty({
    description: 'ID de la regional',
    example: 'reg-001',
  })
  idRegional: string;

  @ApiProperty({
    description: 'Nombre de la regional',
    example: 'Regional Centro',
  })
  regional: string;

  @ApiProperty({
    description: 'ID del estado',
    example: 'est-001',
  })
  idEstado: string;

  @ApiProperty({
    description: 'Nombre del estado',
    example: 'Entregado',
  })
  estado: string;

  @ApiProperty({
    description: 'Referencia 1 de la entrega',
    example: 'REF-001',
    required: false,
  })
  referencia?: string;

  @ApiProperty({
    description: 'Referencia 2 de la entrega',
    example: 'REF-002',
    required: false,
  })
  referencia2?: string;

  @ApiProperty({
    description: 'Número de factura',
    example: 'FAC-123456',
  })
  nroFactura: string;

  @ApiProperty({
    description: 'Productos que pertenecen a la entrega',
    type: AosProductoEntregaDto,
    isArray: true,
  })
  products: AosProductoEntregaDto[];
}