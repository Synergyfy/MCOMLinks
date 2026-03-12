/*
  Warnings:

  - You are about to drop the `SystemAlert` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SystemAlert";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "SystemLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'system',
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
