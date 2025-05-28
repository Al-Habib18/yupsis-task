/** @format */

import { Request, Response } from "express";

const otpVerifyRegistrationController = (req: Request, res: Response) => {
    res.json({ message: "otpSentRegistrationController controller" });
};

export default otpVerifyRegistrationController;
