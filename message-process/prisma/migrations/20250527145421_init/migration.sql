-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "trxId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "nextAttemptAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
