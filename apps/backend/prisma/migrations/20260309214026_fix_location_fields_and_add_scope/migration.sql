/*
  Warnings:

  - Added the required column `address` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Location" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "campaignName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT,
    "postcode" TEXT,
    "scope" TEXT NOT NULL DEFAULT 'hyperlocal',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Location" ("campaignName", "createdAt", "id", "name", "updatedAt") SELECT "campaignName", "createdAt", "id", "name", "updatedAt" FROM "Location";
DROP TABLE "Location";
ALTER TABLE "new_Location" RENAME TO "Location";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
