CREATE TABLE IF NOT EXISTS "guestbook" (
  "id" SERIAL PRIMARY KEY,
  "created_by" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "last_modified" TIMESTAMP NOT NULL,
  "signature" TEXT NOT NULL,
  "approved" BOOLEAN NOT NULL DEFAULT FALSE,
  "hascreatedentrybefore" TEXT,
  "local_created_by_id" TEXT,
  "local_entry_id" TEXT
);
