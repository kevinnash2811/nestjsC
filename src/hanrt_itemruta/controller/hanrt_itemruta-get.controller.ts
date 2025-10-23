import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ItemRutaGetService } from '../service/hanrt_itemruta-get.service';
import { RoutePlanningDto } from '../dto';
import { EntregaPlanningDto } from 'src/hane_entregas/dto';

@ApiTags('Visita ~ Itemruta')
@Controller('hanrt_itemruta')
export class HanrtItemrutaGetController {
  constructor(private readonly itemrutaGetService: ItemRutaGetService) {}

  @Get('reprogramadas')
  @ApiOperation({ summary: 'Obtiene las visitas reprogramadas' })
  @ApiQuery({
    name: 'fechainiplan_c',
    type: 'string',
    required: true,
    description: 'Fecha y hora de inicio de la visita',
  })
  @ApiQuery({
    name: 'fechafinplan_c',
    type: 'string',
    required: true,
    description: 'Fecha y hora fin de la visita',
  })
  @ApiQuery({
    name: 'assigned_user_id',
    type: 'string',
    required: true,
    description: 'ID del usuario asignado',
  })
  @ApiQuery({
    name: 'ciclo_id',
    type: 'string',
    required: true,
    description: 'ID del ciclo de visitas',
  })
  itemGetAll(
    @Query('fechainiplan_c') fechainiplan_c: string,
    @Query('fechafinplan_c') fechafinplan_c: string,
    @Query('assigned_user_id') assigned_user_id: string,
    @Query('ciclo_id') ciclo_id: string,
  ) {
    return this.itemrutaGetService.getItemRuta(
      fechainiplan_c,
      fechafinplan_c,
      assigned_user_id,
      ciclo_id,
    );
  }

  @Get('customer-visits')
  @ApiOperation({ summary: 'Obtiene las visitas de un cliente' })
  getCustomerVisits(
    @Query('contactId') contactId: string,
    @Query('accountId') accountId: string,
    @Query('userId') userId: string,
    @Query('cicloId') cicloId: string,
  ) {
    return this.itemrutaGetService.getCustomerVisits({
      accountId,
      contactId,
      userId,
      cicloId,
    });
  }

  @Get('markers')
  @ApiOperation({ summary: 'Obtiene los marcadores de las visitas' })
  @ApiQuery({
    name: 'id',
    type: 'string',
    required: true,
    description: 'ID de la visita',
  })
  getMarkers(@Query('id') id: string) {
    return this.itemrutaGetService.getMarkers(id);
  }

  @Get('bygroup/:groupId')
  @ApiOperation({ summary: 'Obtiene las rutas de un grupo por su ID' })
  @ApiParam({ name: 'groupId', description: 'ID del grupo' })
  @ApiOkResponse({ type: RoutePlanningDto, isArray: true })
  getRoutesByGroupId(@Param('groupId') groupId: string) {
    return this.itemrutaGetService.getRoutesByGroupId(groupId);
  }

  @Get('deliveries/:routeId')
  @ApiOperation({ summary: 'Obtiene todas las entregas de una ruta por su ID' })
  @ApiParam({ name: 'routeId', description: 'ID de la ruta' })
  @ApiOkResponse({ type: EntregaPlanningDto, isArray: true })
  getDeliveriesByRouteId(@Param('routeId') routeId: string) {
    return this.itemrutaGetService.getRouteDeliveries(routeId);
  }

  @Get('visit-details/:routeId')
  @ApiOperation({ summary: 'Obtiene los detalles de las visitas de una ruta por su ID' })
  @ApiParam({ name: 'routeId', description: 'ID de la ruta' })
  getVisitDetailsByRouteId(@Param('routeId', ParseUUIDPipe) routeId: string) {
    return this.itemrutaGetService.getVisitDetailsByRouteId(routeId);
  }
}
