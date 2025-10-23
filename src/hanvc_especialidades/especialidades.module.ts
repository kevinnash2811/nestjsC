import { Module }              from '@nestjs/common';
import { EspecialidadesController }  from './controller/especialidades.controller';
import { EspecialidadesGetService } from './service/especialidades-get.service';
import { EspecialidadesRepository } from './repository/especialidades.repository';

@Module({
  controllers: [EspecialidadesController],
  providers: [EspecialidadesGetService, EspecialidadesRepository],
})
export class EspecialidadesModule {}

