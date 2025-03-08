import { GroupDao } from '../dao/groups.dao';
import { Group } from '../entities/group.entity';
import { inject, injectable } from 'tsyringe';
import { BadRequestError, NotFoundException } from '../common/errors';
import { generatePagination } from '../common/pagination';

@injectable()
export class GroupService {
  constructor(@inject(GroupDao) private groupDao: GroupDao) { }

  // your code
}