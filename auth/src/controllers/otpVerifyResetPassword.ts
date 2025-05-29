/** @format */

import { Request, Response } from "express";
import {
    getExitingUser,
    getVerificationCode,
    updateVerificationCode,
} from "../lib";
import { emailVerificationSchema } from "../schemas";
const otpVerifyResetPasswordController = async (
    req: Request,
    res: Response
) => {
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
            res.status(404).json({ message: "Email not found" });
        } else {
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

                // update verification code status to verified
                await updateVerificationCode(verificationCode.id);

                //TODO: send to email to user using mail service for reset password
                res.status(200).json({ message: "Otp verified successfully" });
            }
        }
    } catch (error) {
        console.log("Error in otp Verify Reset Password Controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default otpVerifyResetPasswordController;
