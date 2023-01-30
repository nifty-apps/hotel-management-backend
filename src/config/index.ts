import dotenv from 'dotenv';

dotenv.config();

export default {
  port: Number(process.env.PORT) || 3000,
  logLevel: process.env.LOG_LEVEL || 'silly',
  databaseURL: process.env.DATABASE_URL as string,
  authSecret: process.env.AUTH_SECRET as string,
};
