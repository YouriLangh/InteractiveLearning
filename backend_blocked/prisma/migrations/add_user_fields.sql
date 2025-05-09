-- Add code and updatedAt to User table
ALTER TABLE "User" ADD COLUMN "code" TEXT NOT NULL DEFAULT 'DEFAULT_CODE';
ALTER TABLE "User" ADD COLUMN "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Remove the default values after adding the columns
ALTER TABLE "User" ALTER COLUMN "code" DROP DEFAULT; 