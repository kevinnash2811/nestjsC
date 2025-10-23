import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery, ApiBody, ApiParam } from '@nestjs/swagger';
import { GetGestionTnpDTO, GetHistoricoNotasDTO } from '../dto/get-tnp.dto';
import { HanrtGestionTNPGetService } from '../service';
import { BodyPlanificador } from 'src/producer_rabbit/dto';

@ApiTags('GestionTNP')
@Controller('hanrt_gestiontnp')
export class HanrtGestionTNPGetController {
  constructor(
    private readonly hanrtGestionTNPGetService: HanrtGestionTNPGetService,
  ) {}

  @Get('HBM/ObtenerTNP')
  @ApiOperation({
    description: 'Obtener la lista de TNP con filtros opcionales',
  })
  @ApiQuery({
    name: 'CodUsuario',
    type: String,
    required: false,
    description: 'Código del usuario para filtrar los ciclos.',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Número de página',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Cantidad de registros por página',
  })
  async getGestionTnp(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    getGestionTnpDTO: GetGestionTnpDTO,
  ) {
    return this.hanrtGestionTNPGetService.getGestionTnp(getGestionTnpDTO);
  }

  @Get('historico-notas')
  @ApiOperation({
    description: 'Obtener el histórico de notas de contacto',
  })
  @ApiQuery({ name: 'codUsuario', type: String, required: true })
  @ApiQuery({ name: 'fechaInicio', type: String, required: true })
  @ApiQuery({ name: 'fechaFin', type: String, required: true })
  @ApiQuery({ name: 'contacto_id', type: String, required: false })
  async getHistoricoNotas(@Query() query: GetHistoricoNotasDTO) {
    return this.hanrtGestionTNPGetService.getHistoricoNotas(query);
  }

  @Put('update-tnp/:id')
  @ApiOperation({
    description: 'Actualizar un TNP en Firebase',
  })
  @ApiParam({ name: 'id', type: String, description: 'ID del TNP' })
  async updateTnp(@Param('id') id: string, @Body() updateTnpDTO: any) {
    return this.hanrtGestionTNPGetService.updateTnp(id, updateTnpDTO);
  }
}
