import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CreateZonaDTO } from '../dto';
import { HanrtZonasDeleteService } from "../service";

@ApiTags('Zonas')
@Controller('hanrt_zonas')
export class HanrtZonasDeleteController {
  constructor(private readonly hanrtZonasDeleteService: HanrtZonasDeleteService) {}

 
  @Delete('/delete/:idZona')
    @ApiOperation({ summary: 'Elimina una zona' })
    @ApiParam({
      name: 'idZona',
      type: 'string',
      required: true,
      description: 'ID de un registro de una zona',
      example: '18034230-47b5-dd89-d32a-685ec7f16294',
    })
    hanrtPlanificador(@Param('idZona') idZona: string){
      return this.hanrtZonasDeleteService.deleteZona(idZona)
    }
}