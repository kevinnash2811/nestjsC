import { NacosConfigClient } from 'nacos';
import { NacosModel } from '../types/index';
import { Logger } from '@nestjs/common';

export const EnvConfiguration = async () => {
  const nacosGroup = 'DEFAULT_GROUP';
  const configClient = new NacosConfigClient({
    serverAddr: process.env.NACOS_SERVERADDR,
    namespace: process.env.NACOS_NAMESPACE,
    identityKey: process.env.NACOS_IDENTITYKEY,
    identityValue: process.env.NACOS_IDENTITYVALUE,
  });

  const listener = (content: string) => {
    return JSON.parse(content) as NacosModel;
  };

  try {
    const content = await configClient.getConfig(
      process.env.NACOS_ENV,
      nacosGroup,
    );

    const formattedData = JSON.parse(content) as NacosModel;

    configClient.subscribe(
      {
        dataId: process.env.NACOS_ENV,
        group: nacosGroup,
      },
      listener,
    );
    return formattedData;
  } catch (error) {
    configClient.unSubscribe(
      {
        dataId: process.env.NACOS_ENV,
        group: nacosGroup,
      },
      listener,
    );
    throw new Error('Error al obtener la configuración de Nacos');
  }
};
