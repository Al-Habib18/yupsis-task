/** @format */

import { Request, Response } from "express";
import { refreshTokenSchema } from "../schemas";
import { deleteRefreshToken, getRefreshToken } from "../lib";

const logoutController = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.params;
        if (!refreshToken) {
            res.status(400).json({ message: "Refresh token is required" });
        }

        // validate refreshToken
        const parsedBody = refreshTokenSchema.safeParse(refreshToken);
        if (!parsedBody.success) {
            res.status(400).json({ errors: parsedBody.error.errors });
        }

        // check if the refresh token exists
        const existingRefreshToken = await getRefreshToken(refreshToken);
        if (!existingRefreshToken) {
            res.status(404).json({ message: "Refresh token not found" });
        }

        // remove refresh token
        await deleteRefreshToken(refreshToken);

        // remove access token
        // res.clearCookie("accessToken");

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Logout failed" });
    }
};

export default logoutController;
