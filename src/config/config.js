import dotenv from "dotenv";

const ENVIRONMENTS = ['development', 'production'];
const currentEnv = process.env.NODE_ENV || 'development';

if (!ENVIRONMENTS.includes(currentEnv)) {
  throw new Error(`Invalid NODE_ENV: ${currentEnv}. Valid environments are ${ENVIRONMENTS.join(', ')}.`);
}

const envFile = currentEnv === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });
console.log('Validating ENV passed: ',currentEnv);

export const config = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.DB_URL,
  DB_NAME: process.env.DB_NAME,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  UTIL_SECRET: process.env.SECRET,
  ADMIN_USER: process.env.ADMIN_USER,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  SERVICE_NODEMAILER: process.env.SERVICE_NODEMAILER,
  PORT_NODEMAILER: process.env.PORT_NODEMAILER,
  USER_NODEMAILER: process.env.USER_NODEMAILER,
  PASS_NODEMAILER: process.env.PASS_NODEMAILER,
  FROM_NODEMAILER: process.env.FROM_NODEMAILER
};