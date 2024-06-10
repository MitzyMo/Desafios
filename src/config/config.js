import "dotenv/config";

export const config = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.DB_URL,
  DB_NAME: process.env.DB_NAME,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  UTIL_SECRET: process.env.SECRET,
  ADMIN_USER: process.env.ADMIN_USER,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};