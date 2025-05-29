/** @format */

import { Request, Response } from "express";

import { getExitingUser, createVerifiactionCode } from "../lib";
import { VerificationCodeType } from "@prisma/client";
import { emailSchema } from "../schemas";
import sendOtpEmail from "../utils/email";
const otpSentResetPasswordController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: "Email is required" });
        }

        // validate request body
        const parsedBody = emailSchema.safeParse(email);
        if (!parsedBody.success) {
            res.status(400).json({ errors: parsedBody.error.errors });
        }

        // Check if the user  exists
        const user = await getExitingUser(email);
        if (!user) {
            res.status(400).json({ message: "Email does not  exists" });
        } else {
            const verificationCode = await createVerifiactionCode(
                user.email,
                VerificationCodeType.RESET_PASSWORD
            );
            if (!verificationCode) {
                res.status(500).json({
                    message: "Error creating verification code",
                });
            } else {
                // send email to user with otp using resend
                sendOtpEmail(user.email, verificationCode.otp);
                res.status(201).json({
                    message: "Otp sent successfully",
                });
            }
        }
    } catch (error) {
        console.log("Error in otpSent Reset Password Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default otpSentResetPasswordController;
