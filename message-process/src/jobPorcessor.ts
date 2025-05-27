/** @format */

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function getDelay(attempt: any) {
    const delays = [2, 5, 10, 20, 30, 60]; // in seconds
    //TODO: return delays[Math.min(attempt - 1, 5)] * 60 * 1000;
    return delays[Math.min(attempt - 1, 5)] * 1000;
}
async function processNextMessage() {
    const now = new Date();

    const message = await prisma.message.findFirst({
        where: {
            OR: [
                { status: "pending" },
                { status: "rejected", nextAttemptAt: { lte: now } },
            ],
        },
        orderBy: { createdAt: "asc" },
    });

    if (!message) return;

    const random = Math.floor(Math.random() * 1000);

    if (message.trxId === random) {
        await prisma.message.update({
            where: { id: message.id },
            data: { status: "success" },
        });
        console.log(`Success: trxId ${message.trxId}`);
    } else {
        const newAttempts = message.attemptCount + 1;
        const nextAttemptAt = new Date(Date.now() + getDelay(newAttempts));

        await prisma.message.update({
            where: { id: message.id },
            data: {
                attemptCount: newAttempts,
                status: "rejected",
                nextAttemptAt,
            },
        });
        console.log(
            `Failed: Will retry trxId ${message.trxId} at ${nextAttemptAt}`
        );
    }
}

export default processNextMessage;
