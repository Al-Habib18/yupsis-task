/** @format */

import { Request, Response } from "express";

const otpVerifyForgotPasswordController = (req: Request, res: Response) => {
    res.json({ message: "otpVerifyForgotPasswordController controller" });
};

export default otpVerifyForgotPasswordController;
