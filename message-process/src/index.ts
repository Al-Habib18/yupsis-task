/** @format */

import createMessage from "./db";
import produceJob from "./producer";
import startWorker from "./worker";

(async () => {
    await startWorker(); // initialize boss and worker ONCE

    // enqueue jobs every second
    setInterval(async () => {
        //createMessage() ;
        await produceJob();
    }, 1000);
})();
