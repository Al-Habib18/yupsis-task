/** @format */

import { Request, Response } from "express";

const otpSentRegistrationController = (req: Request, res: Response) => {
    res.json({ message: "otpSentRegistrationController controller" });
};

export default otpSentRegistrationController;
