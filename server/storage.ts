import { 
  users, 
  type User, 
  type InsertUser,
  certificationSchemes,
  type CertificationScheme,
  type InsertCertificationScheme,
  provinces,
  type Province,
  type InsertProvince,
  schedules,
  type Schedule,
  type InsertSchedule,
  partners,
  type Partner,
  type InsertPartner
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, or, ilike } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  hashPassword(password: string): Promise<string>;
  
  // Certification Scheme methods
  getSchemes(): Promise<CertificationScheme[]>;
  getSchemeById(id: number): Promise<CertificationScheme | undefined>;
  getSchemeBySlug(slug: string): Promise<CertificationScheme | undefined>;
  getSchemesByCategory(category: string): Promise<CertificationScheme[]>;
  getPopularSchemes(limit?: number): Promise<CertificationScheme[]>;
  searchSchemes(query: string): Promise<CertificationScheme[]>;
  createScheme(scheme: InsertCertificationScheme): Promise<CertificationScheme>;
  
  // Province methods
  getProvinces(): Promise<Province[]>;
  getProvinceById(id: number): Promise<Province | undefined>;
  createProvince(province: InsertProvince): Promise<Province>;
  
  // Schedule methods
  getSchedules(): Promise<Schedule[]>;
  getScheduleById(id: number): Promise<Schedule | undefined>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  
  // Partner methods
  getPartners(): Promise<Partner[]>;
  getPartnerById(id: number): Promise<Partner | undefined>;
  createPartner(partner: InsertPartner): Promise<Partner>;
}

export class DatabaseStorage implements IStorage {
  // Session store
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      tableName: 'sessions',
      createTableIfMissing: true 
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Certification Scheme methods
  async getSchemes(): Promise<CertificationScheme[]> {
    return await db.select().from(certificationSchemes);
  }

  async getSchemeById(id: number): Promise<CertificationScheme | undefined> {
    const [scheme] = await db.select().from(certificationSchemes).where(eq(certificationSchemes.id, id));
    return scheme || undefined;
  }

  async getSchemeBySlug(slug: string): Promise<CertificationScheme | undefined> {
    const [scheme] = await db.select().from(certificationSchemes).where(eq(certificationSchemes.slug, slug));
    return scheme || undefined;
  }

  async getSchemesByCategory(category: string): Promise<CertificationScheme[]> {
    return await db.select().from(certificationSchemes).where(eq(certificationSchemes.category, category));
  }

  async getPopularSchemes(limit: number = 10): Promise<CertificationScheme[]> {
    return await db.select().from(certificationSchemes).orderBy(desc(certificationSchemes.popular)).limit(limit);
  }

  async searchSchemes(query: string): Promise<CertificationScheme[]> {
    const lowerQuery = `%${query.toLowerCase()}%`;
    return await db.select().from(certificationSchemes).where(
      or(
        ilike(certificationSchemes.name, lowerQuery),
        ilike(certificationSchemes.description, lowerQuery)
      )
    );
  }

  async createScheme(insertScheme: InsertCertificationScheme): Promise<CertificationScheme> {
    const [scheme] = await db
      .insert(certificationSchemes)
      .values(insertScheme)
      .returning();
    return scheme;
  }

  // Province methods
  async getProvinces(): Promise<Province[]> {
    return await db.select().from(provinces);
  }

  async getProvinceById(id: number): Promise<Province | undefined> {
    const [province] = await db.select().from(provinces).where(eq(provinces.id, id));
    return province || undefined;
  }

  async createProvince(insertProvince: InsertProvince): Promise<Province> {
    const [province] = await db
      .insert(provinces)
      .values(insertProvince)
      .returning();
    return province;
  }

  // Schedule methods
  async getSchedules(): Promise<Schedule[]> {
    return await db.select().from(schedules);
  }

  async getScheduleById(id: number): Promise<Schedule | undefined> {
    const [schedule] = await db.select().from(schedules).where(eq(schedules.id, id));
    return schedule || undefined;
  }

  async createSchedule(insertSchedule: InsertSchedule): Promise<Schedule> {
    const [schedule] = await db
      .insert(schedules)
      .values(insertSchedule)
      .returning();
    return schedule;
  }

  // Partner methods
  async getPartners(): Promise<Partner[]> {
    return await db.select().from(partners);
  }

  async getPartnerById(id: number): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner || undefined;
  }

  async createPartner(insertPartner: InsertPartner): Promise<Partner> {
    const [partner] = await db
      .insert(partners)
      .values(insertPartner)
      .returning();
    return partner;
  }
  
  // Helper function for password hashing
  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }

  // Seed the database with initial data if it's empty
  async seedInitialData() {
    try {
      // Check if admin user exists
      const adminUser = await this.getUserByUsername("admin");
      if (!adminUser) {
        // Create admin user with hashed password
        const hashedPassword = await this.hashPassword("admin123"); // DO NOT USE IN PRODUCTION
        
        await this.createUser({
          username: "admin",
          password: hashedPassword,
          email: "admin@lspwkn.id",
          fullName: "Administrator",
          role: "admin",
          phoneNumber: "081234567890",
          address: "Jl. Admin No. 1, Jakarta",
          profilePicture: null
        });
        console.log("Admin user berhasil dibuat");
      }

      // Check if we have any provinces already
      const existingProvinces = await this.getProvinces();
      if (existingProvinces.length === 0) {
        // Add provinces
        const provinces = [
          { name: "ACEH", code: "aceh" },
          { name: "SUMATERA UTARA", code: "sumatera-utara" },
          { name: "SUMATERA BARAT", code: "sumatera-barat" },
          { name: "RIAU", code: "riau" },
          { name: "JAMBI", code: "jambi" },
          { name: "SUMATERA SELATAN", code: "sumatera-selatan" },
          { name: "BENGKULU", code: "bengkulu" },
          { name: "LAMPUNG", code: "lampung" },
          { name: "KEPULAUAN BANGKA BELITUNG", code: "bangka-belitung" },
          { name: "KEPULAUAN RIAU", code: "kepulauan-riau" },
          { name: "DKI JAKARTA", code: "dki-jakarta" },
          { name: "JAWA BARAT", code: "jawa-barat" },
          { name: "JAWA TENGAH", code: "jawa-tengah" },
          { name: "DI YOGYAKARTA", code: "di-yogyakarta" },
          { name: "JAWA TIMUR", code: "jawa-timur" },
          { name: "BANTEN", code: "banten" },
          { name: "BALI", code: "bali" }
        ];

        for (const province of provinces) {
          await this.createProvince(province);
        }
        console.log("Provinsi berhasil diseed");
      }
      
      // Seed data lain akan diaktifkan setelah migrasi database selesai
      // See komentar dibawah untuk petunjuk proses migrasi
    } catch (error) {
      console.error("Terjadi error saat seeding data:", error);
    }
  }
  
  /*
   * CATATAN UNTUK MIGRASI: 
   * 
   * Terjadi perubahan skema database yang cukup besar dengan penambahan kolom-kolom baru
   * di beberapa tabel. Untuk melakukan migrasi database secara aman:
   * 
   * 1. Jalankan pernyataan ALTER TABLE untuk menambahkan kolom-kolom baru sesuai skema database
   * 2. Aktifkan kode seeding untuk skema, jadwal, dan partner setelah migrasi kolom berhasil 
   * 
   * Contoh untuk menambahkan kolom pada tabel certification_schemes:
   * 
   * ALTER TABLE certification_schemes 
   *   ADD COLUMN IF NOT EXISTS code TEXT UNIQUE,
   *   ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT FALSE,
   *   ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
   *   ADD COLUMN IF NOT EXISTS price TEXT,
   *   ADD COLUMN IF NOT EXISTS duration TEXT,
   *   ADD COLUMN IF NOT EXISTS requirements TEXT,
   *   ADD COLUMN IF NOT EXISTS image TEXT,
   *   ADD COLUMN IF NOT EXISTS eligibility TEXT,
   *   ADD COLUMN IF NOT EXISTS benefits TEXT,
   *   ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
   *   ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
   */
}

export const storage = new DatabaseStorage();

// Call seedInitialData to ensure the database has initial data
(async () => {
  try {
    await (storage as DatabaseStorage).seedInitialData();
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
})();
