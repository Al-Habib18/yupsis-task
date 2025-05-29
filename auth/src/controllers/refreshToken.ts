/** @format */

import { Request, Response } from "express";
import { refreshTokenSchema } from "../schemas";
import { decodeToken, getAccessToken } from "../utils";
import {
    createRefreshToken,
    deleteRefreshToken,
    getRefreshToken,
} from "../lib";

const refreshTokenController = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.params;
        if (!refreshToken) {
            res.status(400).json({ message: "Refresh token is required" });
        }

        // validate request body
        const parsedBody = refreshTokenSchema.safeParse(refreshToken);
        if (!parsedBody.success) {
            res.status(400).json({ errors: parsedBody.error.errors });
        }

        // check if the refresh token exists
        const existingRefreshToken = await getRefreshToken(refreshToken);
        if (!existingRefreshToken) {
            res.status(404).json({ message: "Refresh token not found" });
        }

        // //docode the refresh token
        const user = decodeToken(refreshToken);
        if (!user) {
            res.status(400).json({ message: "Invalid refresh token" });
        }
        // remove refresh token
        await deleteRefreshToken(refreshToken);

        // generate refresh token
        const newRefreshToken = await createRefreshToken({
            id: user.userId,
            email: user.email,
        });

        // create access token
        const accessToken = await getAccessToken({
            id: user.id,
            email: user.email,
            name: user.name,
        });

        res.status(200).json({
            code: 200,
            message: "Refresh token sent successfully",
            data: {
                accessToken: accessToken,
                refreshToken: newRefreshToken?.token,
            },
        });
    } catch (error) {
        console.log("Error in refreshTokenController", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default refreshTokenController;
