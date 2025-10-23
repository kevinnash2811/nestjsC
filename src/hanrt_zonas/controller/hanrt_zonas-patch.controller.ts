import { BadRequestException, Body, Controller, Param, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {ZonaPatchDTO } from '../dto';
import {ZonaPatchService} from '../service';

@ApiBearerAuth()
@ApiTags('Zonas')
@Controller('hanrt_zonas')
export class ZonaPatchController {
  constructor(
    private readonly zonaPatchService: ZonaPatchService,
  ) {}

  @Patch('/update/:idZona')
  @ApiOperation({ summary: 'Actualiza campos de la Zona' })
  @ApiResponse({ status: 200, description: 'Actualización exitosa' })
  @ApiResponse({ status: 400, description: 'Actualización fallida' })
  @ApiParam({
    name: 'idZona',
    type: 'string',
    required: true,
    description: 'Id de la Zona a actualizar',
    example: '18034230-47b5-dd89-d32a-685ec7f16294',
  })
  @ApiBody({
    description: 'Datos de la Zona a actualizar',
    type: ZonaPatchDTO,
  })
  updateZonaPatch(
    @Param('idZona') idZona: string,
    @Body() zona: ZonaPatchDTO,
  ) {
    return this.zonaPatchService.updateZonaConRelacion(
      idZona,
      zona,
    );
  }

}
