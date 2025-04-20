import { pgTable, text, serial, integer, date, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema still included from the original file
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Certification scheme schema
export const certificationSchemes = pgTable("certification_schemes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  iconBackground: text("icon_background").notNull(),
  category: text("category").notNull(),
  popular: integer("popular").default(0),
});

export const insertCertificationSchemeSchema = createInsertSchema(certificationSchemes).omit({
  id: true,
});

export type InsertCertificationScheme = z.infer<typeof insertCertificationSchemeSchema>;
export type CertificationScheme = typeof certificationSchemes.$inferSelect;

// Provinces schema
export const provinces = pgTable("provinces", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
});

export const insertProvinceSchema = createInsertSchema(provinces).omit({
  id: true,
});

export type InsertProvince = z.infer<typeof insertProvinceSchema>;
export type Province = typeof provinces.$inferSelect;

// Schedules schema
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  label: text("label").notNull(),
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
});

export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type Schedule = typeof schedules.$inferSelect;

// Partners schema
export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  website: text("website"),
});

export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
});

export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type Partner = typeof partners.$inferSelect;
