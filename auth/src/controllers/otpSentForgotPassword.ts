/** @format */

import { Request, Response } from "express";

const otpSentForgotPasswordController = (req: Request, res: Response) => {
    res.json({ message: "otpSentForgotPasswordController controller" });
};

export default otpSentForgotPasswordController;
