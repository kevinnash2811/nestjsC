import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Hanrt_ConductorGetService } from '../service/hanrt_conductor-get.service'
@ApiTags('Conductores')
@Controller('hanrt_conductor')
export class Hanrt_ConductorGetController {
  constructor(private readonly hanrt_ConductorGetService: Hanrt_ConductorGetService) {}

  @Get('list')
  @ApiOperation({ summary: 'Obtener la lista de conductores' })
  async getHanrtConductorData() {
    return await this.hanrt_ConductorGetService.getHanrtConductorData();
  }
}
