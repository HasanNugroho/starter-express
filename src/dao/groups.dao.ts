import { Group } from '../entities/group.entity';
import { Repository } from 'typeorm';
import dataSourceConfig from '../db/data-source';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
export class GroupDao {
  private groupRepository: Repository<Group>;

  constructor() {
    this.groupRepository = dataSourceConfig.getRepository(Group);
  }

  // your code
}