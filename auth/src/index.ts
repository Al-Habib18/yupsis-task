/** @format */

import cors from "cors";
import express from "express";
import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";

import routes from "./routes";
import morgan from "morgan";
const app = express();
config();

// Middleware
app.use(express.json());
app.use(cors()); //set corsOption
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.get("/hello", (_req, res) => {
    res.json({ message: "hello world" });
});
// Use combined routes
app.use("/auth", routes);

/* app.use("*", (req, res) => {
    console.log("req_url:-", req.url);
    res.status(404).json({ message: "Route Not Found" });
}); */

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ message: err.message });
});
/* 
app.use("*", (req, res) => {
    console.log("req_url:-", req.url);
    res.status(404).json({ message: "Route Not Found" });
}); */

const PORT = process.env.PORT || 3000;

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
