/** @format */
const bcrypt = require("bcryptjs");
import jwt, { JwtPayload } from "jsonwebtoken";
const generateVerificationCode = () => {
    // Get current timestamp in milliseconds
    const timestamp = new Date().getTime().toString();

    // Generate a random 2-digit number
    const randomNum = Math.floor(10 + Math.random() * 90); // Ensures 2-digit random number

    // Combine timestamp and random number and extract last 5 digits
    let code = (timestamp + randomNum).slice(-5);

    return code; //
};

const generateHash = async (payload: string, saltRound = 10) => {
    const salt = await bcrypt.genSalt(saltRound);
    return bcrypt.hash(payload, salt);
};

const hasMatched = async (raw: string, hash: string) => {
    const result = await bcrypt.compare(raw, hash);
    return result;
};

const generateToken = (data: { id: string; email: string; name?: string }) => {
    const token = jwt.sign(
        {
            userId: data.id,
            email: data.email,
            name: data.name,
        },
        process.env.JWT_SECRET ?? "My_Secret_Key",
        { expiresIn: "1h" }
    );
    return token;
};

const getAccessToken = (data: { id: string; email: string; name: string }) => {
    const accessToken = generateToken(data);
    return accessToken;
};

const decodeToken = (token: string) => {
    const user = jwt.verify(token, process.env.JWT_SECRET ?? "My_Secret_Key");
    return user as JwtPayload;
};

const getTokenExpiration = (token: string) => {
    try {
        const decoded = decodeToken(token);

        let expiration = decoded.exp;
        if (!expiration) {
            return new Error("Invalid token");
        }
        const currentTime = Math.floor(Date.now() / 1000);

        if (currentTime > expiration) {
            return true;
        }
        return false;
    } catch (err) {
        console.log(err);
        return err;
    }
};
// check token expiration

export {
    generateVerificationCode,
    generateHash,
    hasMatched,
    generateToken,
    getAccessToken,
    decodeToken,
    getTokenExpiration,
};
