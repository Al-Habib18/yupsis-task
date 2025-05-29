/** @format */

import prisma from "../schemas/prisma";
import { VerificationCodeType, AccountStatus } from "@prisma/client";
import { generateVerificationCode, generateToken } from "../utils";

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
            },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                isVerified: true,
            },
        });
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
};

// update user to active status
const updateUserAccountStatus = async (
    id: string,
    accountStatus: AccountStatus
) => {
    try {
        const user = await prisma.user.update({
            where: { id: id },
            data: { status: accountStatus },
        });
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const updateUserToVerified = async (id: string) => {
    try {
        const user = await prisma.user.update({
            where: { id: id },
            data: { isVerified: true },
        });
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
};
// update user to verified status
const createVerifiactionCode = async (
    email: string,
    type: VerificationCodeType
) => {
    try {
        const code = generateVerificationCode();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        const verificationCode = await prisma.verificationCode.create({
            data: {
                otp: code,
                email: email,
                expiresAt: expiresAt,
                type: type,
            },
        });
        return verificationCode;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const getVerificationCode = async (email: string, code: string) => {
    try {
        const verificationCode = await prisma.verificationCode.findFirst({
            where: {
                email: email,
                otp: code,
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
            data: { verified: true },
        });
        return true;
    } catch (error) {
        console.log();
        return null;
    }
};

const createRefreshToken = async (data: { id: string; email: string }) => {
    try {
        const token = generateToken(data);
        const refreshToken = await prisma.refreshToken.create({
            data: {
                token: token,
                userId: data.id,
                email: data.email,
            },
        });
        return refreshToken;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const getRefreshToken = async (token: string) => {
    try {
        const refreshToken = await prisma.refreshToken.findUnique({
            where: { token: token },
        });
        return refreshToken;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const deleteRefreshToken = async (token: string) => {
    console.log("token:-", token);
    try {
        const refreshToken = await prisma.refreshToken.findUnique({
            where: { token: token },
        });
        if (!refreshToken) {
            throw new Error("Refresh token not found");
        }
        await prisma.refreshToken.delete({ where: { token: token } });
        return true;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export {
    /* user */
    getExitingUser,
    createUser,
    updateUserAccountStatus,
    updateUserToVerified,
    /* otp */
    createVerifiactionCode,
    getVerificationCode,
    updateVerificationCode,
    /* refresh token */
    createRefreshToken,
    getRefreshToken,
    deleteRefreshToken,
};
