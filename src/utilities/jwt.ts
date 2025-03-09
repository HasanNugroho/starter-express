import jwt from 'jsonwebtoken'
import { User } from '../entities/user.entity';

export function GenerateToken(user: any) {
    const JWT_SECRET = process.env.JWT_SECRET || "secret";
    const JWT_EXPIRED = process.env.JWT_EXPIRED || "1h";

    return jwt.sign(
        user,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRED }
    );
}