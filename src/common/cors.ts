import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables before using them

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:4000'];

export const options: cors.CorsOptions = {
  origin: allowedOrigins
};