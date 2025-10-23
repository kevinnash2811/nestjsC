import { Injectable }             from '@nestjs/common';
import { InjectEntityManager }    from '@nestjs/typeorm';
import { EntityManager }          from 'typeorm';
// import { AccountLatLng }          from '../interface';
import * as querySQL              from '../SQL';

@Injectable()
export class HaneEntregasPathService {
  constructor(
    @InjectEntityManager('DBCRM') private readonly mssqlEntityManager: EntityManager,
  ){}

  
}
