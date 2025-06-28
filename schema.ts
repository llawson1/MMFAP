import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const transfers = pgTable("transfers", {
  id: serial("id").primaryKey(),
  fromTeam: text("from_team").notNull(),
  toTeam: text("to_team").notNull(),
  playerName: text("player_name").notNull(),
  fee: integer("fee"), // in millions
  description: text("description").notNull(),
  source: text("source").notNull(),
  reliabilityScore: integer("reliability_score").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  league: text("league").notNull(),
  position: integer("position").notNull(),
  played: integer("played").notNull(),
  won: integer("won").notNull(),
  drawn: integer("drawn").notNull(),
  lost: integer("lost").notNull(),
  goalDifference: integer("goal_difference").notNull(),
  points: integer("points").notNull(),
});

export const scenarios = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  playerName: text("player_name").notNull(),
  transferFee: integer("transfer_fee").notNull(),
  positionImpact: integer("position_impact").notNull(),
  pointsProjection: real("points_projection").notNull(),
  confidence: integer("confidence").notNull(),
  psrCompliant: boolean("psr_compliant").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const reliabilitySources = pgTable("reliability_sources", {
  sourceName: text("source_name").notNull().unique().primaryKey(),
  trackRecord: integer("track_record").notNull(),
  networkCredibility: integer("network_credibility").notNull(),
  verificationLevel: integer("verification_level").notNull(),
  recencyFactor: integer("recency_factor").notNull(),
  overallScore: integer("overall_score").notNull(),
  description: text("description"),
});

export const liveStats = pgTable("live_stats", {
  id: serial("id").primaryKey(),
  transferRumors: integer("transfer_rumors").notNull(),
  confirmedDeals: integer("confirmed_deals").notNull(),
  activeUsers: integer("active_users").notNull(),
  lastUpdate: timestamp("last_update").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTransferSchema = createInsertSchema(transfers).omit({
  id: true,
  timestamp: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
});

export const insertScenarioSchema = createInsertSchema(scenarios).omit({
  id: true,
  timestamp: true,
});

export const insertReliabilitySourceSchema = createInsertSchema(reliabilitySources);

export const insertLiveStatsSchema = createInsertSchema(liveStats).omit({
  id: true,
  lastUpdate: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Transfer = typeof transfers.$inferSelect;
export type InsertTransfer = z.infer<typeof insertTransferSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Scenario = typeof scenarios.$inferSelect;
export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type ReliabilitySource = typeof reliabilitySources.$inferSelect;
export type InsertReliabilitySource = z.infer<typeof insertReliabilitySourceSchema>;
export type LiveStats = typeof liveStats.$inferSelect;
export type InsertLiveStats = z.infer<typeof insertLiveStatsSchema>;
