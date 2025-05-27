/** @format */

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function generateTransaction() {
    const trxId = Math.floor(Math.random() * 1000);
    const amount = Math.floor(Math.random() * (1000 - 10 + 1)) + 10;
    return { trxId, amount };
}

async function createMessage() {
    const { trxId, amount } = generateTransaction();
    await prisma.message.create({
        data: {
            trxId,
            amount,
            nextAttemptAt: new Date(),
        },
    });
    console.log("Message added:", trxId);
}

export default createMessage;
