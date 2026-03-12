-- CreateTable
CREATE TABLE "GlobalConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'global-settings',
    "emergencyPause" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);
