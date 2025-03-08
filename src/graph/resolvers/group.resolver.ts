import 'reflect-metadata';
import { GroupService } from '../../services/group.service';
import { container } from 'tsyringe';
import { validator } from '../../common/pipes/validation.pipe';
import { BadRequestError, CustomError, ServerError } from '../../common/errors';

const groupService = container.resolve(GroupService);

const groupResolvers = {
  Query: {
    groups: () => {
      return {};
    },
  },
  Mutation: {
    group: () => {
      return {};
    },
  },
  GroupQuery: {
    list() {
      return {};
    }
    // your code
  },
  GroupMutation: {
    create() {
      return {};
    }
    // your code
  }
};

export default groupResolvers;