/** @format */
/** @format */
import { Resend } from "resend";
import { RESEND_API_KEY } from "../config/env";

const resend = new Resend(RESEND_API_KEY);

const sendOtpEmail = async (email: string, otp: string) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Resend <creativeshop@resend.dev>",
            to: email,
            subject: "Your OTP Code for Verification",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 8px; color: #333;">
                    <h2 style="color: #e91e63;">Verify Your Email</h2>
                    <p>Hi there,</p>
                    <p>Use the following One-Time Password (OTP) to verify your email address:</p>
                    <div style="margin: 24px 0; font-size: 28px; font-weight: bold; color: #111; background-color: #fff; padding: 12px 24px; border-radius: 6px; display: inline-block; border: 1px dashed #e91e63;">
                        ${otp}
                    </div>
                    <p>This code is valid for the next 5 minutes. Please do not share it with anyone.</p>
                    <hr style="margin: 32px 0;" />
                    <p>If you did not request this code, you can safely ignore this email.</p>
                    <p>— Creative Shop Auth Team</p>
                </div>
            `,
        });

        if (error) {
            console.error("Error sending payment confirmation email:", error);
        } else {
            console.log("Email send:", data);
        }
    } catch (err) {
        console.error("Failed to send payment success email:", err);
    }
};

export default sendOtpEmail;
