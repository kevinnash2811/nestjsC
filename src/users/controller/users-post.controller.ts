import { Controller, Post, Body, Query }               from '@nestjs/common';
import { ApiBody, ApiOperation,ApiQuery, ApiTags }     from '@nestjs/swagger';
import { UsersPostService }                         from '../service';
import { FilterUsersDto }                           from '../dto';

@ApiTags('Usuarios')
@Controller('users')
export class UsersPostController {
  constructor(private readonly usersPostService: UsersPostService) {}

  /**
   * 
   * @param filterAdvancedDto JSON para mostrar paginacion y filtro de cuentas
   * @returns JSON
   */
  @Post('list')
  @ApiOperation({ summary: 'Obtener la lista de usuarios paginadas y filtradas por Supervisor' })
  @ApiBody({ 
    description: 'Datos para realizar filtros de busqueda avanzada',
    type: FilterUsersDto
  })
  allUsers(
    @Body() filterAdvancedDto: FilterUsersDto,
  ) {
    return this.usersPostService.listUsers(filterAdvancedDto);
  }

  @Post('list-rol')
  @ApiOperation({ summary: 'Obtener la lista de usuarios paginadas y filtradas , todos los roles' })
  @ApiBody({ 
    description: 'Datos para realizar filtros de busqueda avanzada',
    type: FilterUsersDto
  })
  allUsersRol(
    @Body() filterAdvancedDto: FilterUsersDto,
  ) {
    return this.usersPostService.listUsersRol(filterAdvancedDto);
  }

  /**
   * 
   * @param filterAdvancedDto JSON para mostrar paginacion y filtro de cuentas
   * @returns JSON
   */

  @Post('users-total')
  @ApiOperation({ summary: 'Obtener el total del listado de usuarios paginadas y filtradas' })
  allTotalUsers(@Body() filterAdvancedDto: FilterUsersDto){
    return this.usersPostService.listUsersTotal(filterAdvancedDto);
  }

}
