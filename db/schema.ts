import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const playRecords = pgTable("play_records", {
  id: serial().primaryKey(),
  message: text().notNull(),
  score: integer().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
