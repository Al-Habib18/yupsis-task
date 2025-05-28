/** @format */

import { Request, Response } from "express";

const registrationController = (req: Request, res: Response) => {
    res.json({ message: "Registration" });
};

export default registrationController;
