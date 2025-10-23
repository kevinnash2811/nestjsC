import { ApiProperty } from '@nestjs/swagger';

class LocationProps {
  @ApiProperty({ required: false, example: '-16.231423412341234' })
  lat?: string | null;

  @ApiProperty({ required: false, example: '-68.123412341234123' })
  lng?: string | null;
}

export class AccountPlanningDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false, example: 'nombre de cuenta' })
  accountName?: string | null;

  @ApiProperty({ required: false, example: 'Avenida lugar' })
  billingCity?: string | null;

  @ApiProperty({ required: false, example: 'Calle asf' })
  billingStreet?: string | null;

  @ApiProperty({ required: false, example: 'A' })
  categoriaVentas?: string | null;

  @ApiProperty({ required: false, example: 'B' })
  categoriaVentas2?: string | null;

  @ApiProperty({ required: false, type: LocationProps })
  location: LocationProps;

  @ApiProperty({ required: false, example: '' })
  zonaTransporte?: string | null;

  @ApiProperty({ required: false, example: 'zone' })
  zone?: string | null;

  @ApiProperty({ required: false, example: 'ELA-123' })
  zoneId?: string | null;
}
