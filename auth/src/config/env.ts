/** @format */

import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 4000;

export const BACKEND_URL = process.env.BACKEND_URL as string;

export const RESEND_API_KEY = process.env.RESEND_API_KEY as string;

export const JWT_SECRET = process.env.JWT_SECRET as string;

export const DATABASE_URL = process.env.DATABASE_URL as string;
