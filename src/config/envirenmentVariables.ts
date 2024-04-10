import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const DATABASE_NAME = process.env.DATABASE_NAME;
export const DATABASE_HOST = process.env.DATABASE_HOST;
export const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;

export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

export const API_URL = process.env.API_URL;
export const CLIENT_URL = process.env.CLIENT_URL;

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const COOKIES_REFRESH_TOKEN = "refresh_token";

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;
