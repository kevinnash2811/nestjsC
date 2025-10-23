import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { NacosConfigClient } from 'nacos';

@Controller('version')
@ApiTags('Version')
export class VersionController {
  @Get()
  async getVersion() {
    const nacosGroup = 'DEFAULT_GROUP';
    const configClient = new NacosConfigClient({
      serverAddr: process.env.NACOS_SERVERADDR,
      namespace: process.env.NACOS_NAMESPACE,
      identityKey: process.env.NACOS_IDENTITYKEY,
      identityValue: process.env.NACOS_IDENTITYVALUE,
    });

    const content = await configClient.getConfig(
      process.env.NACOS_ENV,
      nacosGroup,
      { unit: 'planificador.version' },
    );

    const config = JSON.parse(content);

    return {
      version: config.planificador.version,
    };
  }
}
