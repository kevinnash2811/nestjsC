import { PartialType } from '@nestjs/swagger';
import { CreateHaneEntregasDto } from './create-hane_entregas.dto';

export class UpdateHaneEntregasDto extends PartialType(CreateHaneEntregasDto) {}
