/** @format */

import { Request, Response } from "express";
import { userCreateSchema } from "../schemas";
import { getExitingUser, createVerifiactionCode, createUser } from "../lib";
import { generateHash } from "../utils";

const registrationController = async (req: Request, res: Response) => {
    try {
        // Validate the request body
        const parsedBody = userCreateSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ errors: parsedBody.error.errors });
        }

        // Check if the user already exists
        const existingUser = await getExitingUser(parsedBody.data.email);
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Check if terms and conditions are accepted
        if (parsedBody.data.termsAndCondtions === false) {
            return res
                .status(400)
                .json({ message: "Terms and conditions not accepted" });
        }

        // // Hash the password
        const hashedPassword = await generateHash(parsedBody.data.password);

        // // Create the auth user
        const user = await createUser({
            ...parsedBody.data,
            password: hashedPassword,
            termsAndConditions: true,
        });
        if (!user) {
            return res.status(500).json({ message: "Error creating user__" });
        }

        // //Implement verification logic
        const verificationCode = await createVerifiactionCode(user.id);
        if (!verificationCode) {
            return res
                .status(500)
                .json({ message: "Error creating verification code" });
        }

        // //create mail option
        // const emailOption = {
        //     from: default_email_sender || "alhabib@gmail.com",
        //     to: user.email,
        //     subject: "user registration",
        //     text: `Your Verification code is ${verificationCode}`,
        //     source: "user_registration",
        // };

        // // call an mail servce to send an email
        // const exchacnge = "auth_exchange";
        // const queue = "registration";
        // sendToQueue(exchacnge, queue, emailOption);

        return res.status(201).json({
            message: "User created successfully",
            // user,
            // Code: verificationCode,
        });
    } catch (error) {
        console.error("Error during registration:", error);
        // Handle error and return appropriate response to client
        return res.status(500).json({ message: "Error creating user" });
    }
};

export default registrationController;
