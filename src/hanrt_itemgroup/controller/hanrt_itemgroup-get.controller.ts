import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { HanrtItemgroupService } from '../service';
import { ItemGroupDto } from '../dto';
import { ClientException } from 'src/hanrt_planificador/helpers/client-exceptions.helper';

@ApiTags('Ruta ~ Itemgroup')
@Controller('hanrt_itemgroup')
export class HanrtItemGroupGetController {
  constructor(private readonly groupService: HanrtItemgroupService) {}

  @Get('/group/:planId')
  @ApiOperation({
    summary: '',
    description: 'Obtiene todos los grupos de una planificación.',
  })
  @ApiOkResponse({
    type: ItemGroupDto,
    isArray: true,
  })
  @ApiQuery({
    required: false,
    name: 'blocked',
    description:
      `Indica si se deben obtener los grupos no bloqueados (00) o los bloqueados (01). 
      Si no se envía, se obtienen todos los grupos.`,
    enum: ['00', '01'],
  })
  @ApiQuery({
    required: false,
    name: 'vehicleId',
    description: 'ID del vehículo para filtrar los grupos por vehículo.',
  })
  async getPlanningGroups(
    @Param('planId') planId: string,
    @Query('blocked') blocked?: '00' | '01',
    @Query('vehicleId') vehicleId?: string,
  ): Promise<ItemGroupDto[]> {
    if (!!blocked && blocked !== '00' && blocked !== '01')
      throw new ClientException('Error. Parametro blocked debe ser 00 o 01.');

    return this.groupService.getPlanningGroups(
      planId,
      blocked || undefined,
      vehicleId,
    );
  }
}
