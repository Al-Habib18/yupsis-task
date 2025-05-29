/** @format */

import { Request, Response } from "express";
import { default_email_sender } from "../config/default";
import { getExitingUser, createVerifiactionCode } from "../lib";
import { VerificationCodeType } from "@prisma/client";
import { emailSchema } from "../schemas";
import sendEmailToQueue from "../utils/emailQueue";

const otpSentForgotPasswordController = async (req: Request, res: Response) => {
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
        }

        //Implement verification logic
        const verificationCode = await createVerifiactionCode(
            user.email,
            VerificationCodeType.FORGOT_PASSWORD
        );
        if (!verificationCode) {
            res.status(500).json({
                message: "Error creating verification code",
            });
        }

        //TODO: send email to user using RabbitMQ or Resend

        res.status(201).json({
            message: "Otp sent successfully",
        });
    } catch (error) {
        console.log("Error in otpSentRegistrationController", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default otpSentForgotPasswordController;
