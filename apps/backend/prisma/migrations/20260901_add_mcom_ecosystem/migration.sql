-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "monthlyPrice" REAL NOT NULL DEFAULT 0,
    "quarterlyPrice" REAL NOT NULL DEFAULT 0,
    "annualPrice" REAL NOT NULL DEFAULT 0,
    "features" TEXT NOT NULL DEFAULT '[]',
    "configuration" TEXT NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'STANDARD',
    "trialDuration" INTEGER,
    "seasonId" TEXT,
    "stripeMonthlyPriceId" TEXT,
    "stripeQuarterlyPriceId" TEXT,
    "stripeAnnualPriceId" TEXT,
    "paypalMonthlyPlanId" TEXT,
    "paypalQuarterlyPlanId" TEXT,
    "paypalAnnualPlanId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- AlterTable
ALTER TABLE "User" ADD COLUMN "mcomUserId" TEXT;
ALTER TABLE "User" ADD COLUMN "mcomAccessToken" TEXT;
ALTER TABLE "User" ADD COLUMN "autoRenew" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "BusinessProfile" ADD COLUMN "activePlanId" TEXT;
ALTER TABLE "BusinessProfile" ADD COLUMN "planExpiresAt" DATETIME;

-- CreateIndex
CREATE UNIQUE INDEX "User_mcomUserId_key" ON "User"("mcomUserId");

-- AddForeignKey
ALTER TABLE "BusinessProfile" ADD CONSTRAINT "BusinessProfile_activePlanId_fkey" FOREIGN KEY ("activePlanId") REFERENCES "Plan" ("id") ON DELETE SET NULL ON UPDATE CASCADE;