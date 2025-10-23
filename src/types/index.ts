export interface NacosModel {
    SQL_PORT: number;
    SQL_HOST: string;
    SQL_USER: string;
    SQL_PASSWORD: string;
    SQL_DATABASE: string;
    PORT_NS_70: number;
}

export type QueueConfig = {
  name: string;
  listenSync?: boolean;
  sync?: Sync;
  prefetchCount: number;
  queueError: string;
  cronExpression: string;
  listener: Listener;
  service: Service;
};


type Sync = {
  field: string;
  value: string;
};

type Listener = {
  node: string;
  queueMessage: string;
  onchildadded: boolean;
  onchildchanged: boolean;
  onchildremoved: boolean;
  onchildmoved: boolean;
};

type Service = {
  method: string;
  path: string;
};

export interface AppConfig {
  global: Record<string, object>;
  roles: Record<string, object>;
}
