/** @format */

import { Router } from "express";
const router = Router();

import {
    registrationController,
    loginController,
    logoutController,
    refreshTokenController,
    otpSentRegistrationController,
    otpVerifyRegistrationController,
    otpSentResetPasswordController,
    otpVerifyResetPasswordController,
    otpSentForgotPasswordController,
    otpVerifyForgotPasswordController,
} from "../controllers/index";

router.post("/registration", registrationController);
router.post("/login", loginController);
router.post("/logout/:refreshToken", logoutController);
router.get("/refresh-token/:refreshToken", refreshTokenController);

router.post("/otp/sent/registration", otpSentRegistrationController);
router.post("/otp/verify/registration", otpVerifyRegistrationController);

router.post("/otp/sent/reset-password", otpSentResetPasswordController);
router.post("/otp/verify/reset-password", otpVerifyResetPasswordController);

router.post("/otp/sent/forgot-password", otpSentForgotPasswordController);
router.post("/otp/verify/forgot-password", otpVerifyForgotPasswordController);

export default router;
