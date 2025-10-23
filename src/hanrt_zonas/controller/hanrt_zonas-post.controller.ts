import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateZonaDTO } from '../dto';
import { HanrtZonasPostService } from "../service";

@ApiTags('Zonas')
@Controller('hanrt_zonas')
export class HanrtZonasPostController {
  constructor(private readonly hanrtZonasPostService: HanrtZonasPostService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear una zona' })
  @ApiBody({
    description: 'Datos de la zona a crear',
    type: CreateZonaDTO,
  })
  createHanrtZonas(@Body() createZonaDTO: CreateZonaDTO) {
    return this.hanrtZonasPostService.createHanrtZonas(createZonaDTO);
  }
}