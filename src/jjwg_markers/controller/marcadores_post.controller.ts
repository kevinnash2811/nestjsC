import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateMarcadoresDTO } from '../dto';
import { MarcadoresPostService } from "../service";

@ApiTags('Marcadores')
@Controller('jjwg_markers')
export class MarcadoresPostController {
  constructor(private readonly marcadoresPostService: MarcadoresPostService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear un marcador' })
  @ApiBody({
    description: 'Datos del marcador a crear',
    type: CreateMarcadoresDTO,
  })
  createMarcadores(@Body() CreateMarcadoresDTO: CreateMarcadoresDTO) {
    return this.marcadoresPostService.createMarcadores(CreateMarcadoresDTO);
  }
}