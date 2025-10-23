import { Module } from '@nestjs/common';
import { TasksGetService } from './service/hanrt_tareasplan-get.service';
import { TasksGetController } from './controller/hanrt_tareaplan-get.controller';

@Module({
  controllers: [TasksGetController],
  providers: [TasksGetService],
})
export class TasksModule { }
