-- Add status and lastChecked columns to Endpoint table
ALTER TABLE "Endpoint" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE "Endpoint" ADD COLUMN "lastChecked" TIMESTAMP(3); 