import { BadRequestException, Body, Controller, Param, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TerritorioPatchDTO } from '../dto';
import {TerritorioPatchService} from '../service';

@ApiBearerAuth()
@ApiTags('Territorios')
@Controller('hanrt_territorios')
export class TerritorioPatchController {
  constructor(
    private readonly territorioPatchService: TerritorioPatchService,
  ) {}

  @Patch('/update/:idTerritorio')
  @ApiOperation({ summary: 'Actualiza campos del Territorio' })
  @ApiResponse({ status: 200, description: 'Actualización exitosa' })
  @ApiResponse({ status: 400, description: 'Actualización fallida' })
  @ApiParam({
    name: 'idTerritorio',
    type: 'string',
    required: true,
    description: 'Id del Territorio a actualizar',
    example: 'a360ffd7-9207-5aee-fd07-685ec6ebd4d1',
  })
  @ApiBody({
    description: 'Datos del Territorio a actualizar',
    type: TerritorioPatchDTO,
  })
  updateTerritorioPatch(
    @Param('idTerritorio') idTerritorio: string,
    @Body() territorio: TerritorioPatchDTO,
  ) {
    return this.territorioPatchService.updateTerritorio(
      idTerritorio,
      territorio,
    );
  }

}
