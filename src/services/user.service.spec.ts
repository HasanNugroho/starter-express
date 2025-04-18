import 'reflect-metadata';

import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { NotFoundException } from '../common/errors';

describe('UserService - getById', () => {
    let service: UserService;
    let mockRepository: { findById: jest.Mock };

    beforeEach(() => {
        mockRepository = {
            findById: jest.fn(),
        };

        service = new UserService(mockRepository as any);
    });

    it('should return a user when found', async () => {
        const mockUser: User = {
            id: '123',
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: 'secret',
            is_system: true,
            is_active: true,
            created_at: new Date(),
            last_login_at: new Date(),
            updated_at: new Date(),
        };

        mockRepository.findById.mockResolvedValue(mockUser);

        const result = await service.getById('123');
        expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
        mockRepository.findById.mockResolvedValue(undefined);

        await expect(service.getById('notfound')).rejects.toThrow(NotFoundException);
    });
});
