import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersGetService } from '../service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuarios')
@Controller('users')
export class UsersGetController {
  constructor(private readonly usersGetService: UsersGetService) {}

  /**
   *
   * @param iduser usuario CRM
   * @returns Retorna la información del usuario con su token
   */
  @Get(':iduser')
  @ApiOperation({
    summary: 'Obtiene la información del usuario logueado con token',
  })
  @ApiParam({
    name: 'iduser',
    type: 'string',
    required: true,
    description: 'ID del usuario para obtener su información',
    example: 'a3080ed1-ceae-c9d6-83bd-65f1d24477ef',
  })
  findOneUser(@Param('iduser') iduser: string) {
    return this.usersGetService.getInfoUser(iduser);
  }

  @Get('/ciclo/:idCiclo')
  @ApiOperation({ summary: 'Obtiene los usuarios de un Ciclo' })
  @ApiParam({
    name: 'idCiclo',
    type: 'string',
    required: true,
    description: 'ID del ciclo para obtener su información',
    example: 'ea57f4af-6b8d-5d93-d872-6807c1b99636',
  })
  getUsersByCiclo(@Param('idCiclo') idCiclo: string) {
    return this.usersGetService.getUsersByCiclo(idCiclo);
  }

  @Get()
  @ApiOperation({ summary: 'Obtiene el listado de usuarios' })
  @ApiQuery({
    name: 'division',
    type: 'string',
    required: true,
    description: 'Codigo de la division u Organización de venta',
    example: '03',
  })
  @ApiQuery({
    name: 'amercado',
    type: 'string',
    required: false,
    description: 'Área de venta o sector',
    example: '03_01',
  })
  accountGetAll(
    @Query('division') division: string,
    @Query('amercado') amercado: string,
  ) {
    return this.usersGetService.getUsers(division, amercado);
  }

  @Get('/configs/:iduser')
  @ApiOperation({ summary: 'Obtiene la configuración del usuario logueado' })
  @ApiParam({
    name: 'iduser',
    type: 'string',
    required: true,
    description: 'ID del usuario para obtener su configuración',
    example: 'a3080ed1-ceae-c9d6-83bd-65f1d24477ef',
  })
  getUserConfigs(@Param('iduser') iduser: string) {
    return this.usersGetService.getUserConfigs(iduser);
  }
}
