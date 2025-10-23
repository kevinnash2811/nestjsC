import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateCycleDTO } from '../dto';
import { HanrtCiclosPostService } from "../service";
@ApiTags('Ciclos')
@Controller('hanrt_ciclos')
export class HanrtCiclosPostController {
  constructor(private readonly hanrtCiclosPostService: HanrtCiclosPostService) {}

  @Post('list')
  @ApiOperation({ summary: 'Obtener la lista de ciclos' })
  getHanrtCiclos() {
    return this.hanrtCiclosPostService.getHanrtCiclos();
  }
  
    @Post('create')
  @ApiOperation({ summary: 'Crear un ciclo' })
  @ApiBody({
    description: 'Datos del ciclo a crear',
    type: CreateCycleDTO,
  })
  createHanrtCiclos(@Body() createCycleDTO: CreateCycleDTO) {
    return this.hanrtCiclosPostService.createHanrtCiclos(createCycleDTO);
  }
}