/** @format */

import prisma from "../schemas/prisma";
import jwt from "jsonwebtoken";
import { generateVerificationCode } from "../utils";

const getExitingUser = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
};

const createUser = async (data: {
    name: string;
    email: string;
    password: string;
    termsAndConditions: boolean;
}) => {
    try {
        if (data.termsAndConditions === false) {
            return null;
        }
        // Create the auth user
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                termsAndConditions: data.termsAndConditions,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                verified: true,
            },
        });
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const createVerifiactionCode = async (userId: string) => {
    try {
        const code = generateVerificationCode();
        const verificationCode = await prisma.verificationCode.create({
            data: {
                userId: userId,
                code,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
            },
        });
        return verificationCode;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const getVerificationCode = async (userId: string, code: string) => {
    try {
        const verificationCode = await prisma.verificationCode.findFirst({
            where: {
                userId: userId,
                code: code,
            },
        });
        return verificationCode;
    } catch (error) {
        console.log();
        return null;
    }
};

const updateVerificationCode = async (id: string) => {
    try {
        await prisma.verificationCode.update({
            where: { id: id },
            data: { status: "USED", verifiedAt: new Date() },
        });
        return true;
    } catch (error) {
        console.log();
        return null;
    }
};

export {
    getExitingUser,
    createUser,
    createVerifiactionCode,
    getVerificationCode,
    updateVerificationCode,
};
