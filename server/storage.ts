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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private schemes: Map<number, CertificationScheme>;
  private schemesBySlug: Map<string, number>;
  private provinces: Map<number, Province>;
  private schedules: Map<number, Schedule>;
  private partners: Map<number, Partner>;
  
  userCurrentId: number;
  schemeCurrentId: number;
  provinceCurrentId: number;
  scheduleCurrentId: number;
  partnerCurrentId: number;

  constructor() {
    this.users = new Map();
    this.schemes = new Map();
    this.schemesBySlug = new Map();
    this.provinces = new Map();
    this.schedules = new Map();
    this.partners = new Map();
    
    this.userCurrentId = 1;
    this.schemeCurrentId = 1;
    this.provinceCurrentId = 1;
    this.scheduleCurrentId = 1;
    this.partnerCurrentId = 1;
    
    // Initialize with some default data
    this.initDefaultData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Certification Scheme methods
  async getSchemes(): Promise<CertificationScheme[]> {
    return Array.from(this.schemes.values());
  }

  async getSchemeById(id: number): Promise<CertificationScheme | undefined> {
    return this.schemes.get(id);
  }

  async getSchemeBySlug(slug: string): Promise<CertificationScheme | undefined> {
    const id = this.schemesBySlug.get(slug);
    if (id) {
      return this.schemes.get(id);
    }
    return undefined;
  }

  async getSchemesByCategory(category: string): Promise<CertificationScheme[]> {
    return Array.from(this.schemes.values()).filter(
      (scheme) => scheme.category === category
    );
  }

  async getPopularSchemes(limit: number = 10): Promise<CertificationScheme[]> {
    return Array.from(this.schemes.values())
      .sort((a, b) => b.popular - a.popular)
      .slice(0, limit);
  }

  async searchSchemes(query: string): Promise<CertificationScheme[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.schemes.values()).filter(
      (scheme) => 
        scheme.name.toLowerCase().includes(lowerQuery) || 
        scheme.description.toLowerCase().includes(lowerQuery)
    );
  }

  async createScheme(insertScheme: InsertCertificationScheme): Promise<CertificationScheme> {
    const id = this.schemeCurrentId++;
    const scheme: CertificationScheme = { ...insertScheme, id };
    this.schemes.set(id, scheme);
    this.schemesBySlug.set(scheme.slug, id);
    return scheme;
  }

  // Province methods
  async getProvinces(): Promise<Province[]> {
    return Array.from(this.provinces.values());
  }

  async getProvinceById(id: number): Promise<Province | undefined> {
    return this.provinces.get(id);
  }

  async createProvince(insertProvince: InsertProvince): Promise<Province> {
    const id = this.provinceCurrentId++;
    const province: Province = { ...insertProvince, id };
    this.provinces.set(id, province);
    return province;
  }

  // Schedule methods
  async getSchedules(): Promise<Schedule[]> {
    return Array.from(this.schedules.values());
  }

  async getScheduleById(id: number): Promise<Schedule | undefined> {
    return this.schedules.get(id);
  }

  async createSchedule(insertSchedule: InsertSchedule): Promise<Schedule> {
    const id = this.scheduleCurrentId++;
    const schedule: Schedule = { ...insertSchedule, id };
    this.schedules.set(id, schedule);
    return schedule;
  }

  // Partner methods
  async getPartners(): Promise<Partner[]> {
    return Array.from(this.partners.values());
  }

  async getPartnerById(id: number): Promise<Partner | undefined> {
    return this.partners.get(id);
  }

  async createPartner(insertPartner: InsertPartner): Promise<Partner> {
    const id = this.partnerCurrentId++;
    const partner: Partner = { ...insertPartner, id };
    this.partners.set(id, partner);
    return partner;
  }

  // Initialize default data
  private initDefaultData() {
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
      }
    ];

    schemes.forEach(scheme => {
      this.createScheme(scheme);
    });

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

    provinces.forEach(province => {
      this.createProvince(province);
    });

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

    schedules.forEach(schedule => {
      this.createSchedule(schedule);
    });

    // Add partners
    const partners = [
      { name: "Partner 1", logo: "partner1-logo", website: "https://partner1.com" },
      { name: "Partner 2", logo: "partner2-logo", website: "https://partner2.com" },
      { name: "Partner 3", logo: "partner3-logo", website: "https://partner3.com" },
      { name: "Partner 4", logo: "partner4-logo", website: "https://partner4.com" },
      { name: "Partner 5", logo: "partner5-logo", website: "https://partner5.com" },
      { name: "Partner 6", logo: "partner6-logo", website: "https://partner6.com" }
    ];

    partners.forEach(partner => {
      this.createPartner(partner);
    });
  }
}

export const storage = new MemStorage();
