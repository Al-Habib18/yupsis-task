/** @format */

import { Request, Response } from "express";

const otpVerifyResetPasswordController = (req: Request, res: Response) => {
    res.json({ message: "otpVerifyResetPasswordController controller" });
};

export default otpVerifyResetPasswordController;
