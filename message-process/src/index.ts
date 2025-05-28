/** @format */

import startWorker from "./worker";
import boss from "./pgBoss";
import createMessage from "./db";
import dotenv from "dotenv";
dotenv.config();

const QUEUE = process.env.QUEUE || "readme-queue";
(async () => {
    await startWorker(); // initialize boss and worker ONCE

    setInterval(async () => {
        // create new message
        await createMessage();

        // enqueue jobs every second
        const id = await boss.send(QUEUE, { arg1: "read me" });
        console.log(`created job ${id} in queue ${QUEUE}`);
    }, 1000);
})();
