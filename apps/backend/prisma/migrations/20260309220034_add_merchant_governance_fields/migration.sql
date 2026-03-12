-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BusinessProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logoUrl" TEXT,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "address" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#2563eb',
    "secondaryColor" TEXT NOT NULL DEFAULT '#f8fafc',
    "ownerName" TEXT NOT NULL DEFAULT '',
    "plan" TEXT NOT NULL DEFAULT 'Basic',
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'active',
    "userId" TEXT NOT NULL,
    CONSTRAINT "BusinessProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BusinessProfile" ("address", "contactEmail", "contactPhone", "description", "id", "logoUrl", "name", "primaryColor", "secondaryColor", "userId") SELECT "address", "contactEmail", "contactPhone", "description", "id", "logoUrl", "name", "primaryColor", "secondaryColor", "userId" FROM "BusinessProfile";
DROP TABLE "BusinessProfile";
ALTER TABLE "new_BusinessProfile" RENAME TO "BusinessProfile";
CREATE UNIQUE INDEX "BusinessProfile_userId_key" ON "BusinessProfile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
