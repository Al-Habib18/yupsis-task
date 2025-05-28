/** @format */

import boss from "./pgBoss";
import processNextMessage from "./jobPorcessor";
import dotenv from "dotenv";
dotenv.config();

const QUEUE = process.env.QUEUE || "readme-queue";

async function startWorker() {
    await boss.start();
    await boss.createQueue(QUEUE);

    await boss.work(QUEUE, async () => {
        console.log(`Processing next message...`);
        try {
            await processNextMessage();
        } catch (err) {
            console.error("Job failed:", err);
            throw err;
        }
    });

    console.log(`Worker started for queue: ${QUEUE}`);
}

export default startWorker;
