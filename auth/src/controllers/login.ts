/** @format */

import { Request, Response } from "express";
import { userLoginSchema } from "../schemas";
import { getExitingUser, createRefreshToken } from "../lib";
import { hasMatched, getAccessToken } from "../utils";

const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const parsedBody = userLoginSchema.safeParse({
            email,
            password,
        });
        if (!parsedBody.success) {
            res.status(400).json({ errors: parsedBody.error.errors });
        }

        // Check if the user exists
        const user = await getExitingUser(email);
        if (user === null || user === undefined) {
            res.status(400).json({ message: "User not found" });
        } else {
            // Check if the user is verified
            // if (!user.isVerified) {
            //     res.status(400).json({ message: "User not verified" });
            // }

            // Check if the user is pending
            // if (user.status === "PENDING") {
            //     res.status(400).json({ message: "User is pending" });
            // }

            // Check if the user is active
            if (user.status === "INACTIVE") {
                res.status(400).json({ message: "User is inactive" });
            }

            // Check if the user is suspended
            if (user.status === "SUSPENDED") {
                res.status(400).json({ message: "User is suspended" });
            }

            // Check if the password is correct
            const isPasswordValid = hasMatched(password, user.password);
            if (!isPasswordValid) {
                res.status(400).json({ message: "Invalid password" });
            }

            //create refresh token
            const refreshToken = await createRefreshToken({
                id: user.id,
                email: user.email,
            });

            const accessToken = await getAccessToken({
                id: user.id,
                email: user.email,
                name: user.name,
            });
            res.json({
                code: 200,
                message: "Login successful",
                data: {
                    accessToken: accessToken,
                    refreshToken: refreshToken?.token,
                },
            });
        }
    } catch (err) {
        console.log("error in loginController", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default loginController;
