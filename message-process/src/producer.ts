/** @format */

import boss from "./pgBoss";
import createMessage from "./db";

const QUEUE = "readme-queue";

async function produceJob() {
    await createMessage();
    const id = await boss.send(QUEUE, { arg1: "read me" });
    console.log(`created job ${id} in queue ${QUEUE}`);
}

export default produceJob;
