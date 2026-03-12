/*
  Warnings:

  - You are about to drop the `GlobalTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GlobalTemplate";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GlobalConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'global-settings',
    "emergencyPause" BOOLEAN NOT NULL DEFAULT false,
    "priorityRule" TEXT NOT NULL DEFAULT 'override',
    "brandColor" TEXT NOT NULL DEFAULT '#0a0a0a',
    "headerText" TEXT NOT NULL DEFAULT 'Supporting Local Business',
    "footerText" TEXT NOT NULL DEFAULT 'Powered by MCOMLinks System',
    "showSocials" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_GlobalConfig" ("emergencyPause", "id", "priorityRule", "updatedAt") SELECT "emergencyPause", "id", "priorityRule", "updatedAt" FROM "GlobalConfig";
DROP TABLE "GlobalConfig";
ALTER TABLE "new_GlobalConfig" RENAME TO "GlobalConfig";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
