import { ApiProperty } from '@nestjs/swagger';

export class ContactPlanningDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false, example: 'John' })
  firstName?: string | null;

  @ApiProperty({ required: false, example: 'Doe' })
  lastName?: string | null;

  @ApiProperty({ required: false, example: '1234514534' })
  phoneMobile?: string | null;

  @ApiProperty({ required: false, example: 'Mr.' })
  salutation?: string | null;

  @ApiProperty({ required: false, example: '' })
  title?: string | null;

  @ApiProperty({ required: false, example: 'neurology' })
  contactSpeciality?: string | null;

  @ApiProperty({ required: false, example: 'A' })
  clasificacion?: string | null;
}
