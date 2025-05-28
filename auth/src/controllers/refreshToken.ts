/** @format */

import { Request, Response } from "express";

const refreshTokenController = (req: Request, res: Response) => {
    res.json({ message: "refreshTokenController controller" });
};

export default refreshTokenController;
