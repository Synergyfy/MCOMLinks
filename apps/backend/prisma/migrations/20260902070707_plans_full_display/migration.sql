-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "bestFor" TEXT,
ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "limitations" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "tagline" TEXT;
