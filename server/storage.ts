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

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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

  // Seed the database with initial data if it's empty
  async seedInitialData() {
    // Check if we have any schemes already
    const existingSchemes = await this.getSchemes();
    if (existingSchemes.length === 0) {
      // Add certification schemes
      const schemes = [
        {
          name: "Digital Marketing",
          slug: "digital-marketing",
          description: "Melakukan aktivitas promosi untuk sebuah produk atau brand menggunakan media Digital.",
          icon: "bullhorn",
          iconBackground: "bg-primary",
          category: "Digital Marketing & Office",
          popular: 10
        },
        {
          name: "Social Media Marketing",
          slug: "social-media-marketing",
          description: "Mengembangkan dan mengelola strategi pemasaran melalui media sosial untuk bisnis.",
          icon: "hashtag",
          iconBackground: "bg-secondary",
          category: "Digital Marketing & Office",
          popular: 8
        },
        {
          name: "Business Analyst",
          slug: "business-analyst",
          description: "Menganalisis proses bisnis dan mengusulkan solusi untuk meningkatkan efisiensi dan profitabilitas.",
          icon: "briefcase",
          iconBackground: "bg-tertiary-light",
          category: "Data Science",
          popular: 7
        },
        {
          name: "Entrepreneur Muda",
          slug: "entrepreneur-muda",
          description: "Memulai dan mengembangkan usaha dengan pendekatan modern dan inovatif.",
          icon: "chart-line",
          iconBackground: "bg-primary-light",
          category: "Kewirausahaan",
          popular: 9
        },
        {
          name: "Business Development",
          slug: "business-development",
          description: "Mempersiapkan dan mengimplementasikan strategi pertumbuhan bisnis yang berkelanjutan.",
          icon: "chart-line",
          iconBackground: "bg-primary-dark",
          category: "Pengembangan Bisnis",
          popular: 6
        },
        {
          name: "E-Commerce Manager",
          slug: "e-commerce-manager",
          description: "Mengelola operasional platform penjualan online dan strategi pertumbuhan penjualan.",
          icon: "shopping-cart",
          iconBackground: "bg-secondary-light",
          category: "E-Commerce",
          popular: 8
        },
        {
          name: "Pelaksana Penjamah Makanan",
          slug: "pelaksana-penjamah-makanan",
          description: "Melaksanakan tugas sebagai penjamah makanan dengan mematuhi standar keamanan dan kebersihan.",
          icon: "utensils",
          iconBackground: "bg-tertiary",
          category: "Kuliner",
          popular: 9
        }
      ];

      for (const scheme of schemes) {
        await this.createScheme(scheme);
      }
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
    }

    // Check if we have any schedules already
    const existingSchedules = await this.getSchedules();
    if (existingSchedules.length === 0) {
      // Add schedules
      const schedules = [
        { 
          label: "31/12/2024 - 30/12/2025",
          startDate: new Date("2024-12-31"),
          endDate: new Date("2025-12-30")
        },
        { 
          label: "01/01/2025 - 30/06/2025",
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-06-30")
        },
        { 
          label: "01/07/2025 - 31/12/2025",
          startDate: new Date("2025-07-01"),
          endDate: new Date("2025-12-31")
        }
      ];

      for (const schedule of schedules) {
        await this.createSchedule(schedule);
      }
    }

    // Check if we have any partners already
    const existingPartners = await this.getPartners();
    if (existingPartners.length === 0) {
      // Add partners
      const partners = [
        { name: "Partner 1", logo: "partner1-logo", website: "https://partner1.com" },
        { name: "Partner 2", logo: "partner2-logo", website: "https://partner2.com" },
        { name: "Partner 3", logo: "partner3-logo", website: "https://partner3.com" },
        { name: "Partner 4", logo: "partner4-logo", website: "https://partner4.com" },
        { name: "Partner 5", logo: "partner5-logo", website: "https://partner5.com" },
        { name: "Partner 6", logo: "partner6-logo", website: "https://partner6.com" }
      ];

      for (const partner of partners) {
        await this.createPartner(partner);
      }
    }
  }
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
