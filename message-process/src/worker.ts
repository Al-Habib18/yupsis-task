/** @format */

import boss from "./pgBoss";
import processNextMessage from "./jobPorcessor";

const QUEUE = "readme-queue";

async function startWorker() {
    await boss.start();
    await boss.createQueue(QUEUE);

    await boss.work(QUEUE, async () => {
        console.log(`Processing next message...`);
        await processNextMessage();
    });

    console.log(`Worker started for queue: ${QUEUE}`);
}

export default startWorker;
