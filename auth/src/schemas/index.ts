/** @format */

import { z } from "zod";

export const userCreateSchema = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    password: z.string().min(6).max(30),
    termsAndConditions: z.boolean(),
});

export const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const emailVerificationSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    otp: z.string(),
});

export const emailSchema = z.string().email();

export const accessTokenSchema = z.object({
    accessToken: z.string(),
});

export const refreshTokenSchema = z.string();
