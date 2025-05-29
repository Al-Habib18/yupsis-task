/** @format */

import { Request, Response } from "express";
import { userCreateSchema } from "../schemas";
import { getExitingUser, createUser } from "../lib";
import { generateHash, getAccessToken } from "../utils";

const registrationController = async (req: Request, res: Response) => {
    try {
        const { name, email, password, termsAndConditions } = req.body;

        // Validate the request body
        const parsedBody = userCreateSchema.safeParse(req.body);
        if (!parsedBody.success) {
            res.status(400).json({ errors: parsedBody.error.errors });
        }

        // Check if the user already exists
        const existingUser = await getExitingUser(email);
        if (existingUser) {
            res.status(400).json({ message: "Email already exists" });
        }

        // Check if terms and conditions are accepted
        if (termsAndConditions === false) {
            res.status(400).json({
                message: "Terms and conditions not accepted",
            });
        }

        // Hash the password
        const hashedPassword = await generateHash(password);

        // // Create the auth user
        const user = await createUser({
            name,
            email,
            password: hashedPassword,
            termsAndConditions: true,
        });
        if (user === null || user === undefined) {
            res.status(500).json({ message: "Error creating user__" });
        }

        // create access token
        else {
            const accessToken = await getAccessToken({
                id: user.id,
                email: user.email,
                name: user.name,
            });
            res.status(201).json({
                code: 201,
                message: "Registered successfully",
                data: {
                    accessToken: accessToken,
                },
            });
        }
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Error creating user" });
    }
};

export default registrationController;
