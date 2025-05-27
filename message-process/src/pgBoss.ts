/** @format */

import PgBoss from "pg-boss";
import dotenv from "dotenv";
dotenv.config();

const dbUrl =
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5433/postgres";

const boss = new PgBoss(dbUrl);

boss.on("error", console.error);

export default boss;
