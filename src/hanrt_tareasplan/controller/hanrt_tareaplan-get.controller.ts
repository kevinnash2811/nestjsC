import { Controller, Get, Query }             from '@nestjs/common';
import { TasksGetService }                    from '../service/hanrt_tareasplan-get.service';
import { ApiTags }                            from '@nestjs/swagger';
import { TiposTareasDto, HanrtTareasPlanDto } from '../dto'

@ApiTags('Tareas Plan')
@Controller('hanrt_tareasplan')
export class TasksGetController {
  constructor(private readonly tasksService: TasksGetService) { }

  //**LISTADO DE TAREAS CABECERA DISTRIBUCION */
  @Get('/listTiposTareas')
  getListOfTasks(@Query() tiposTareasDto: TiposTareasDto) {
    return this.tasksService.getList(tiposTareasDto.tipoTarea);
  }

  //**LISTADO DE TAREA CABECERA VISITAS */
  @Get('/listTareasPlan')
  getListTareasPlan(@Query() hanrtTareasPlanDto: HanrtTareasPlanDto){
    return this.tasksService.getListTareasPlan(hanrtTareasPlanDto);
  }

}
