-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GlobalConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'global-settings',
    "emergencyPause" BOOLEAN NOT NULL DEFAULT false,
    "priorityRule" TEXT NOT NULL DEFAULT 'override',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_GlobalConfig" ("emergencyPause", "id", "updatedAt") SELECT "emergencyPause", "id", "updatedAt" FROM "GlobalConfig";
DROP TABLE "GlobalConfig";
ALTER TABLE "new_GlobalConfig" RENAME TO "GlobalConfig";
CREATE TABLE "new_Offer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessName" TEXT NOT NULL DEFAULT 'Unknown Business',
    "headline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "scans" INTEGER NOT NULL DEFAULT 0,
    "claims" INTEGER NOT NULL DEFAULT 0,
    "activeViewers" INTEGER NOT NULL DEFAULT 0,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME NOT NULL,
    "ctaLabel" TEXT NOT NULL DEFAULT 'Claim Offer',
    "ctaType" TEXT NOT NULL DEFAULT 'claim',
    "leadDestination" TEXT NOT NULL DEFAULT '',
    "redemptionCode" TEXT,
    "mediaType" TEXT NOT NULL DEFAULT 'image',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "rejectionReason" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'national',
    "targetPostcode" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "seasonId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Offer_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "SeasonalRule" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Offer" ("activeViewers", "businessName", "claims", "createdAt", "ctaLabel", "ctaType", "description", "endDate", "headline", "id", "imageUrl", "isPremium", "leadDestination", "mediaType", "redemptionCode", "rejectionReason", "scans", "startDate", "status", "targetPostcode", "updatedAt", "visibility") SELECT "activeViewers", "businessName", "claims", "createdAt", "ctaLabel", "ctaType", "description", "endDate", "headline", "id", "imageUrl", "isPremium", "leadDestination", "mediaType", "redemptionCode", "rejectionReason", "scans", "startDate", "status", "targetPostcode", "updatedAt", "visibility" FROM "Offer";
DROP TABLE "Offer";
ALTER TABLE "new_Offer" RENAME TO "Offer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
