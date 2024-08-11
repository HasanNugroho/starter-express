import { UserDao } from '../dao/users.dao';
import { User } from '../entities/user.entity';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UserService {
  constructor(@inject(UserDao) private userDao: UserDao) {}

  async create(payload: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    try {
      const user = await this.userDao.create(payload);
      return user;
    } catch (e) {
      console.error('Error creating user:', e);
      throw new Error('Failed to create user');
    }
  }

  async refreshToken(user: User): Promise<{ user: User; token: string }> {
    return {
      token: jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        'secretkeyappearshere',
        { expiresIn: '1h' }
      ),
      user,
    };
  }
}
