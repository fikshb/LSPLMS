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
  type InsertPartner,
  asesors,
  questions,
  type Question,
  type InsertQuestion,
  examinationTemplates,
  type ExaminationTemplate,
  type InsertExaminationTemplate,
  examinations,
  type Examination,
  type InsertExamination,
  examinationQuestions,
  type ExaminationQuestion,
  type InsertExaminationQuestion,
  competencyUnits,
  schemeCompetencyUnits
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, or, and, ilike, count } from "drizzle-orm";
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
  
  // Asesor methods
  getAsesors(): Promise<User[]>;
  getAsesorById(id: number): Promise<User | undefined>;
  createAsesor(asesor: Omit<InsertUser, "role"> & { bidangKompetensi?: string, nomorRegistrasi?: string }): Promise<User>;
  updateAsesor(id: number, asesor: Partial<InsertUser> & { bidangKompetensi?: string, nomorRegistrasi?: string }): Promise<User>;
  deleteAsesor(id: number): Promise<boolean>;
  
  // Certification Scheme methods
  getSchemes(): Promise<CertificationScheme[]>;
  getSchemeById(id: number): Promise<CertificationScheme | undefined>;
  getSchemeBySlug(slug: string): Promise<CertificationScheme | undefined>;
  getSchemesByCategory(category: string): Promise<CertificationScheme[]>;
  getPopularSchemes(limit?: number): Promise<CertificationScheme[]>;
  searchSchemes(query: string): Promise<CertificationScheme[]>;
  createScheme(scheme: InsertCertificationScheme): Promise<CertificationScheme>;
  updateScheme(id: number, scheme: Partial<InsertCertificationScheme>): Promise<CertificationScheme>;
  deleteScheme(id: number): Promise<boolean>;
  
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
  
  // Admin methods
  getDashboardCounts(): Promise<{ usersCount: number, activeAssessmentsCount: number, schemesCount: number, asesorsCount: number }>;
  
  // Question Bank methods
  getQuestions(schemeId?: number, unitId?: number): Promise<Question[]>;
  getQuestionById(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: number, question: Partial<InsertQuestion>): Promise<Question>;
  deleteQuestion(id: number): Promise<boolean>;
  
  // Examination Template methods
  getExaminationTemplates(schemeId?: number): Promise<ExaminationTemplate[]>;
  getExaminationTemplateById(id: number): Promise<ExaminationTemplate | undefined>;
  createExaminationTemplate(template: InsertExaminationTemplate): Promise<ExaminationTemplate>;
  updateExaminationTemplate(id: number, template: Partial<InsertExaminationTemplate>): Promise<ExaminationTemplate>;
  deleteExaminationTemplate(id: number): Promise<boolean>;
  
  // Examination methods
  getExaminations(applicationId?: number): Promise<Examination[]>;
  getExaminationById(id: number): Promise<Examination | undefined>;
  createExamination(examination: InsertExamination): Promise<Examination>;
  startExamination(id: number): Promise<Examination>;
  submitExamination(id: number, answers: { questionId: number, answer: string }[]): Promise<Examination>;
  evaluateExamination(id: number, evaluatorId: number): Promise<Examination>;
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
  
  async updateScheme(id: number, schemeData: Partial<InsertCertificationScheme>): Promise<CertificationScheme> {
    const [scheme] = await db
      .update(certificationSchemes)
      .set({
        ...schemeData,
        updatedAt: new Date()
      })
      .where(eq(certificationSchemes.id, id))
      .returning();
    return scheme;
  }
  
  async deleteScheme(id: number): Promise<boolean> {
    try {
      // Check if scheme exists before deleting
      const scheme = await this.getSchemeById(id);
      if (!scheme) {
        return false;
      }
      
      // Delete scheme
      await db.delete(certificationSchemes).where(eq(certificationSchemes.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting scheme:", error);
      return false;
    }
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
  
  // Asesor methods
  async getAsesors(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, "asesor"));
  }

  async getAsesorById(id: number): Promise<User | undefined> {
    // Pastikan ID valid
    if (!id) return undefined;
    
    // Cari user yang memiliki role asesor dengan id tertentu
    const asesors = await db.select()
      .from(users)
      .where(eq(users.id, id));
    
    // Periksa apakah user ditemukan dan memiliki role asesor
    const asesor = asesors.find(a => a.role === "asesor");
    return asesor;
  }

  async createAsesor(asesorData: Omit<InsertUser, "role"> & { bidangKompetensi?: string, nomorRegistrasi?: string }): Promise<User> {
    // Extract asesor specific data
    const { bidangKompetensi, nomorRegistrasi, ...userData } = asesorData;
    
    // Create the user with asesor role
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        role: "asesor"
      })
      .returning();
    
    // For simplicity, we'll store bidangKompetensi in the specialization field of user
    // In a complete implementation, you'd properly link to the asesors table
    
    return user;
  }

  async updateAsesor(id: number, asesorData: Partial<InsertUser> & { bidangKompetensi?: string, nomorRegistrasi?: string }): Promise<User> {
    // Extract asesor specific data
    const { bidangKompetensi, nomorRegistrasi, ...userData } = asesorData;
    
    // Don't update empty password
    if (userData.password === "") {
      delete userData.password;
    } else if (userData.password) {
      userData.password = await this.hashPassword(userData.password);
    }
    
    // Update the user record
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    
    return user;
  }

  async deleteAsesor(id: number): Promise<boolean> {
    try {
      // Delete the user (this would cascade to asesor records with proper DB constraints)
      const result = await db.delete(users).where(eq(users.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting asesor:", error);
      return false;
    }
  }
  
  // Admin methods
  async getDashboardCounts(): Promise<{ usersCount: number, activeAssessmentsCount: number, schemesCount: number, asesorsCount: number }> {
    // Count users with asesi role
    const [usersCountResult] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "asesi"));
    
    // Count active assessments (this is a placeholder - implement with actual assessment table)
    const activeAssessmentsCount = 5; // Placeholder
    
    // Count certification schemes
    const [schemesCountResult] = await db
      .select({ count: count() })
      .from(certificationSchemes);
    
    // Count users with asesor role
    const [asesorsCountResult] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "asesor"));
    
    return {
      usersCount: usersCountResult?.count || 0,
      activeAssessmentsCount,
      schemesCount: schemesCountResult?.count || 0,
      asesorsCount: asesorsCountResult?.count || 0
    };
  }
  
  // Helper function for password hashing
  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }
  
  // Question Bank methods
  async getQuestions(schemeId?: number, unitId?: number): Promise<Question[]> {
    let query = db.select().from(questions);
    
    if (schemeId) {
      query = query.where(eq(questions.schemeId, schemeId));
    }
    
    if (unitId) {
      query = query.where(eq(questions.unitId, unitId));
    }
    
    return await query;
  }
  
  async getQuestionById(id: number): Promise<Question | undefined> {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question || undefined;
  }
  
  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db
      .insert(questions)
      .values(insertQuestion)
      .returning();
    return question;
  }
  
  async updateQuestion(id: number, questionData: Partial<InsertQuestion>): Promise<Question> {
    const [question] = await db
      .update(questions)
      .set({
        ...questionData,
        updatedAt: new Date()
      })
      .where(eq(questions.id, id))
      .returning();
    return question;
  }
  
  async deleteQuestion(id: number): Promise<boolean> {
    try {
      // Check if question exists before deleting
      const question = await this.getQuestionById(id);
      if (!question) {
        return false;
      }
      
      // Delete question
      await db.delete(questions).where(eq(questions.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting question:", error);
      return false;
    }
  }
  
  // Examination Template methods
  async getExaminationTemplates(schemeId?: number): Promise<ExaminationTemplate[]> {
    let query = db.select().from(examinationTemplates);
    
    if (schemeId) {
      query = query.where(eq(examinationTemplates.schemeId, schemeId));
    }
    
    return await query;
  }
  
  async getExaminationTemplateById(id: number): Promise<ExaminationTemplate | undefined> {
    const [template] = await db.select().from(examinationTemplates).where(eq(examinationTemplates.id, id));
    return template || undefined;
  }
  
  async createExaminationTemplate(insertTemplate: InsertExaminationTemplate): Promise<ExaminationTemplate> {
    const [template] = await db
      .insert(examinationTemplates)
      .values(insertTemplate)
      .returning();
    return template;
  }
  
  async updateExaminationTemplate(id: number, templateData: Partial<InsertExaminationTemplate>): Promise<ExaminationTemplate> {
    const [template] = await db
      .update(examinationTemplates)
      .set({
        ...templateData,
        updatedAt: new Date()
      })
      .where(eq(examinationTemplates.id, id))
      .returning();
    return template;
  }
  
  async deleteExaminationTemplate(id: number): Promise<boolean> {
    try {
      // Check if template exists before deleting
      const template = await this.getExaminationTemplateById(id);
      if (!template) {
        return false;
      }
      
      // Delete template
      await db.delete(examinationTemplates).where(eq(examinationTemplates.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting examination template:", error);
      return false;
    }
  }
  
  // Examination methods
  async getExaminations(applicationId?: number): Promise<Examination[]> {
    let query = db.select().from(examinations);
    
    if (applicationId) {
      query = query.where(eq(examinations.applicationId, applicationId));
    }
    
    return await query;
  }
  
  async getExaminationById(id: number): Promise<Examination | undefined> {
    const [examination] = await db.select().from(examinations).where(eq(examinations.id, id));
    return examination || undefined;
  }
  
  async createExamination(insertExamination: InsertExamination): Promise<Examination> {
    // Fetch template to get duration and total questions
    const template = await this.getExaminationTemplateById(insertExamination.templateId);
    
    const [examination] = await db
      .insert(examinations)
      .values({
        ...insertExamination,
        duration: template?.duration || 60,
        totalQuestions: template?.totalQuestions || 20,
        status: "pending"
      })
      .returning();
    
    // If we have a template and it defines to randomize questions, select random questions from the question bank
    if (template && template.randomizeQuestions) {
      // Get questions for the scheme
      const questionsPool = await this.getQuestions(template.schemeId);
      
      // Shuffle and select questions up to totalQuestions
      const selectedQuestions = this.shuffleArray(questionsPool).slice(0, template.totalQuestions);
      
      // Add questions to examination
      for (let i = 0; i < selectedQuestions.length; i++) {
        await db.insert(examinationQuestions).values({
          examinationId: examination.id,
          questionId: selectedQuestions[i].id,
          order: i + 1
        });
      }
    }
    
    return examination;
  }
  
  async startExamination(id: number): Promise<Examination> {
    const [examination] = await db
      .update(examinations)
      .set({
        startTime: new Date(),
        status: "in_progress",
        updatedAt: new Date()
      })
      .where(eq(examinations.id, id))
      .returning();
    
    return examination;
  }
  
  async submitExamination(id: number, answers: { questionId: number, answer: string }[]): Promise<Examination> {
    // Update examination status
    const [examination] = await db
      .update(examinations)
      .set({
        endTime: new Date(),
        status: "completed",
        updatedAt: new Date()
      })
      .where(eq(examinations.id, id))
      .returning();
    
    // Save user answers
    for (const answer of answers) {
      // Get corresponding examination question
      const [examQuestion] = await db
        .select()
        .from(examinationQuestions)
        .where(
          and(
            eq(examinationQuestions.examinationId, id),
            eq(examinationQuestions.questionId, answer.questionId)
          )
        );
      
      if (examQuestion) {
        // Get the original question to check for correctness
        const question = await this.getQuestionById(answer.questionId);
        
        if (question) {
          // Update user answer
          await db
            .update(examinationQuestions)
            .set({
              userAnswer: answer.answer,
              isCorrect: answer.answer === question.correctAnswer,
              answeredAt: new Date()
            })
            .where(eq(examinationQuestions.id, examQuestion.id));
        }
      }
    }
    
    return examination;
  }
  
  async evaluateExamination(id: number, evaluatorId: number): Promise<Examination> {
    // Get all examination questions
    const examQuestions = await db
      .select()
      .from(examinationQuestions)
      .where(eq(examinationQuestions.examinationId, id));
    
    // Calculate score
    const totalQuestions = examQuestions.length;
    const correctAnswers = examQuestions.filter(q => q.isCorrect).length;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    // Get template to check passing score
    const examination = await this.getExaminationById(id);
    const template = examination ? await this.getExaminationTemplateById(examination.templateId) : undefined;
    const passingScore = template?.passingScore || 70;
    
    // Update examination with score and status
    const [updatedExamination] = await db
      .update(examinations)
      .set({
        correctAnswers,
        score,
        passed: score >= passingScore,
        evaluatedBy: evaluatorId,
        evaluatedAt: new Date(),
        status: "evaluated",
        updatedAt: new Date()
      })
      .where(eq(examinations.id, id))
      .returning();
    
    return updatedExamination;
  }
  
  // Utility function to shuffle array (Fisher-Yates algorithm)
  private shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
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
