import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is not defined in environment variables");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE URL is not defined in environment variables");
}

if (!process.env.JWT_SECERT_KEY) {
  throw new Error("JWT KEY is not defined in environment variables");
}

const config = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECERT_KEY: process.env.JWT_SECERT_KEY,
};

export default config;
