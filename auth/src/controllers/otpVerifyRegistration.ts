/** @format */

import { Request, Response } from "express";
import {
    getExitingUser,
    getVerificationCode,
    updateVerificationCode,
    updateUserAccountStatus,
    updateUserToVerified,
} from "../lib";
import { emailVerificationSchema } from "../schemas";
import { AccountStatus } from "@prisma/client";

const otpVerifyRegistrationController = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json({ message: "Email and code are required" });
        }

        // Validate the request body
        const parsedBody = emailVerificationSchema.safeParse({ email, otp });
        if (!parsedBody.success) {
            res.status(400).json({ errors: parsedBody.error.errors });
        }

        // check if the user with email exists
        const user = await getExitingUser(email);
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }

        // if the code has expired
        if (user) {
            // find the verification code
            const verificationCode = await getVerificationCode(user.id, otp);
            if (!verificationCode) {
                res.status(404).json({ message: "Invalid verification code" });
            } else {
                if (verificationCode.expiresAt < new Date()) {
                    res.status(400).json({
                        message: "Verification code expired",
                    });
                }

                // update user status to verified
                await updateUserToVerified(user.id);

                // update user to active
                await updateUserAccountStatus(user.id, AccountStatus.ACTIVE);

                // update verification code status to used
                await updateVerificationCode(verificationCode.id);

                //TODO: send to email to user using mail service

                res.status(200).json({
                    message: "Email verified successfully",
                });
            }
        }
    } catch (error) {
        console.log("Error in otpVerifyRegistrationController", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default otpVerifyRegistrationController;
