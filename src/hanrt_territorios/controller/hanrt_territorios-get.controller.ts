import { Controller, Get, Param} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { HanrtTerritoriosGetService } from "../service";

@ApiTags('Territorios')
@Controller('hanrt_territorios')
export class HanrtTerritoriosGetController {
  constructor(private readonly hanrtTerritoriosGetService: HanrtTerritoriosGetService) {}

  @Get(':idTerritorio')
  @ApiOperation({
    summary: 'Obtiene las zonas de un territorio por su ID',
  })
  @ApiParam({
    name: 'idTerritorio',
    type: 'string',
    required: true,
    description: 'ID de un territorio',
    example: 'a360ffd7-9207-5aee-fd07-685ec6ebd4d1',
  })
  hanrtTerritorio(@Param('idTerritorio') idTerritorio: string) {
    return this.hanrtTerritoriosGetService.getTerritorio(idTerritorio);
  }
}