import dotenv from 'dotenv';

dotenv.config();

export default {
  port: Number(process.env.PORT) || 3000,
  logLevel: process.env.LOG_LEVEL || 'silly',
  databaseURL: process.env.DATABASE_URL as string,
  authSecret: process.env.AUTH_SECRET as string,
  smtpHost: process.env.SMTP_HOST as string,
  smtpPort: Number(process.env.SMTP_PORT),
  smtpUser: process.env.SMTP_USER as string,
  smtpPass: process.env.SMTP_PASS as string,
};
