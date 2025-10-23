import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateTerritorioDTO, FilterAdvancedTerritoriosDto } from '../dto';
import { HanrtTerritoriosPostService } from "../service";

@ApiTags('Territorios')
@Controller('hanrt_territorios')
export class HanrtTerritoriosPostController {
  constructor(private readonly hanrtTerritoriosPostService: HanrtTerritoriosPostService) {}

  
  @Post('create')
  @ApiOperation({ summary: 'Crear un territorio' })
  @ApiBody({
    description: 'Datos del territorio a crear',
    type: CreateTerritorioDTO,
  })
  createHanrTerritorios(@Body() createTerritorioDTO: CreateTerritorioDTO) {
    return this.hanrtTerritoriosPostService.createHanrtTerritorios(createTerritorioDTO);
  }

  @Post('list')
    @ApiOperation({
      summary:
        'Obtener la lista de territorios filtradas por sus campos',
    })
    @ApiBody({
      description: 'Campos para el filtro ',
      type: FilterAdvancedTerritoriosDto,
    })
    listPlanningByFilter(
      @Body() filterAdvancedDto: FilterAdvancedTerritoriosDto,
    ) {
      return this.hanrtTerritoriosPostService.listTerritoriosByFilter(
        filterAdvancedDto,
      );
    }
}