import { Injectable } from '@nestjs/common';
import { HanrtItemGroupRepository } from '../repository/hanrt_itemgroup.repository';
import { mapDbResultToGroupDto } from '../mappers/group.mapper';
import { ItemGroupDto } from '../dto';

@Injectable()
export class HanrtItemgroupService {
  constructor(
    private readonly groupRepo: HanrtItemGroupRepository,
  ){ }

  async getPlanningGroups(planId: string, blocked?: '00' | '01', vehicleId?: string): Promise<ItemGroupDto[]> {
    const data = await this.groupRepo.getPlanningGroups(planId, blocked, vehicleId);
    return data.map(mapDbResultToGroupDto);
  }
}