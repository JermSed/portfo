import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const guestbook = pgTable("guestbook", {
  id: serial("id").primaryKey(),
  createdBy: text("created_by").notNull(),
  body: text("body").notNull(),
  lastModified: timestamp("last_modified", { withTimezone: false }).notNull(),
  signature: text("signature").notNull(),
  approved: boolean("approved").default(false).notNull(),
  hascreatedentrybefore: text("hascreatedentrybefore"),
  localCreatedById: text("local_created_by_id"),
  localEntryId: text("local_entry_id"),
});
