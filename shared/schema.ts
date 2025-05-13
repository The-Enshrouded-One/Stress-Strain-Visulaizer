import { pgTable, text, serial, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (keeping the existing schema)
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

// Materials table for stress-strain data
export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
  youngsModulus: real("youngs_modulus").notNull(), // GPa
  yieldStrength: real("yield_strength").notNull(), // MPa
  ultimateStrength: real("ultimate_strength").notNull(), // MPa
  density: real("density").notNull(), // kg/m³
});

export const insertMaterialSchema = createInsertSchema(materials).omit({
  id: true,
});

export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type Material = typeof materials.$inferSelect;

// Stress-strain curve points
export const stressStrainPoints = pgTable("stress_strain_points", {
  id: serial("id").primaryKey(),
  materialId: integer("material_id").notNull(),
  strain: real("strain").notNull(), // percentage
  stress: real("stress").notNull(), // MPa
  pointType: text("point_type"), // 'elastic', 'yield', 'ultimate', etc.
});

export const insertPointSchema = createInsertSchema(stressStrainPoints).omit({
  id: true,
});

export type InsertPoint = z.infer<typeof insertPointSchema>;
export type StrainPoint = typeof stressStrainPoints.$inferSelect;
