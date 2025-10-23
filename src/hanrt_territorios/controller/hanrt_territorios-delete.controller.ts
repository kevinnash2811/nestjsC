import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CreateTerritorioDTO } from '../dto';
import { HanrtTerritoriosDeleteService } from "../service";

@ApiTags('Territorios')
@Controller('hanrt_territorios')
export class HanrtTerritoriosDeleteController {
  constructor(private readonly hanrtTerritoriosDeleteService: HanrtTerritoriosDeleteService) {}

 
  @Delete('/delete/:idTerritorio')
    @ApiOperation({ summary: 'Elimina un territorio' })
    @ApiParam({
      name: 'idTerritorio',
      type: 'string',
      required: true,
      description: 'ID de un registro de territorio',
      example: 'a360ffd7-9207-5aee-fd07-685ec6ebd4d1',
    })
    hanrtPlanificador(@Param('idTerritorio') idTerritorio: string){
      return this.hanrtTerritoriosDeleteService.deleteTerritorio(idTerritorio)
    }
}