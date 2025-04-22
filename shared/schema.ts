import { pgTable, text, serial, integer, date, varchar, timestamp, boolean, pgEnum, jsonb, primaryKey, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enum untuk status
export const statusEnum = pgEnum('status', ['active', 'inactive', 'pending', 'approved', 'rejected']);

// Enum untuk roles
export const roleEnum = pgEnum('role', ['admin', 'asesor', 'asesi']);

// Enum untuk gender
export const genderEnum = pgEnum('gender', ['L', 'P']);

// Enum untuk education level
export const educationLevelEnum = pgEnum('education_level', [
  'SD', 'SMP', 'SMA/SMK', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3'
]);

// Enum untuk assessment type
export const assessmentTypeEnum = pgEnum('assessment_type', [
  'Sertifikasi', 'Sertifikasi Ulang', 'Pengakuan Kompetensi Terkini (PKT)', 'Rekognisi Pembelajaran Lampau (RPL)'
]);

// Enum untuk difficulty level pada soal
export const difficultyLevelEnum = pgEnum('difficulty_level', [
  'mudah', 'sedang', 'sulit'
]);

// Enum untuk question type
export const questionTypeEnum = pgEnum('question_type', [
  'pilihan_ganda', 'benar_salah', 'essay'
]);

// Tabel pengguna
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  role: roleEnum("role").default("asesi").notNull(),
  phoneNumber: text("phone_number"),
  address: text("address"),
  profilePicture: text("profile_picture"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relasi users akan didefinisikan di bagian bawah setelah semua tabel didefinisikan

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
  phoneNumber: true,
  address: true,
  profilePicture: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Tabel Asesor
export const asesors = pgTable("asesors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  licenseNumber: text("license_number").unique(),
  licenseExpiry: date("license_expiry"),
  specialization: text("specialization"),
  experience: integer("experience"), // dalam tahun
  certifications: text("certifications"),
  status: statusEnum("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relasi asesors akan didefinisikan di bagian bawah

export const insertAsesorSchema = createInsertSchema(asesors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAsesor = z.infer<typeof insertAsesorSchema>;
export type Asesor = typeof asesors.$inferSelect;

// Tabel Asesi (Peserta Sertifikasi)
export const asesis = pgTable("asesis", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  nik: text("nik").unique(),
  gender: genderEnum("gender"),
  birthPlace: text("birth_place"),
  birthDate: date("birth_date"),
  nationality: text("nationality"),
  postalCode: text("postal_code"),
  educationLevel: educationLevelEnum("education_level"),
  company: text("company"),
  jobTitle: text("job_title"),
  companyAddress: text("company_address"),
  companyPostalCode: text("company_postal_code"),
  companyPhone: text("company_phone"),
  companyEmail: text("company_email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relasi asesis akan didefinisikan di bagian bawah

export const insertAsesiSchema = createInsertSchema(asesis).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAsesi = z.infer<typeof insertAsesiSchema>;
export type Asesi = typeof asesis.$inferSelect;

// Tabel Unit Kompetensi
export const competencyUnits = pgTable("competency_units", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  type: text("type"), // SKKNI, Standar Khusus, Standar Internasional
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relasi competencyUnits akan didefinisikan di bagian bawah

export const insertCompetencyUnitSchema = createInsertSchema(competencyUnits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCompetencyUnit = z.infer<typeof insertCompetencyUnitSchema>;
export type CompetencyUnit = typeof competencyUnits.$inferSelect;

// Tabel skema sertifikasi
export const certificationSchemes = pgTable("certification_schemes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  code: text("code").unique(),
  description: text("description"),
  category: text("category"),
  price: text("price"),
  duration: text("duration"),
  requirements: text("requirements"),
  isPopular: boolean("is_popular").default(false),
  popular: integer("popular").default(0),
  icon: text("icon"),
  iconBackground: text("icon_background"),
  image: text("image"),
  eligibility: text("eligibility"),
  benefits: text("benefits"),
  status: statusEnum("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relasi certificationSchemes akan didefinisikan di bagian bawah

export const insertCertificationSchemeSchema = createInsertSchema(certificationSchemes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCertificationScheme = z.infer<typeof insertCertificationSchemeSchema>;
export type CertificationScheme = typeof certificationSchemes.$inferSelect;

// Tabel relasi Skema dengan Unit Kompetensi (Many-to-Many)
export const schemeCompetencyUnits = pgTable("scheme_competency_units", {
  schemeId: integer("scheme_id").references(() => certificationSchemes.id).notNull(),
  unitId: integer("unit_id").references(() => competencyUnits.id).notNull(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.schemeId, t.unitId] })
}));

export const schemeCompetencyUnitsRelations = relations(schemeCompetencyUnits, ({ one }) => ({
  scheme: one(certificationSchemes, {
    fields: [schemeCompetencyUnits.schemeId],
    references: [certificationSchemes.id],
  }),
  unit: one(competencyUnits, {
    fields: [schemeCompetencyUnits.unitId],
    references: [competencyUnits.id],
  }),
}));

// Tabel Aplikasi Sertifikasi (FR.APL.01)
export const certificationApplications = pgTable("certification_applications", {
  id: serial("id").primaryKey(),
  applicationNumber: text("application_number").unique(),
  asesiId: integer("asesi_id").references(() => asesis.id).notNull(),
  schemeId: integer("scheme_id").references(() => certificationSchemes.id).notNull(),
  assessmentType: assessmentTypeEnum("assessment_type").default("Sertifikasi"),
  otherPurpose: text("other_purpose"),
  status: statusEnum("status").default("pending"),
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  processedBy: integer("processed_by").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relasi certificationApplications akan didefinisikan di bagian bawah

export const insertCertificationApplicationSchema = createInsertSchema(certificationApplications).omit({
  id: true,
  applicationNumber: true,
  status: true,
  processedAt: true,
  processedBy: true,
  appliedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCertificationApplication = z.infer<typeof insertCertificationApplicationSchema>;
export type CertificationApplication = typeof certificationApplications.$inferSelect;

// Tabel Asesmen Mandiri (FR.APL.02)
export const selfAssessments = pgTable("self_assessments", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => certificationApplications.id).notNull().unique(),
  competencyData: jsonb("competency_data").notNull(), // menyimpan array elemen kompetensi dan jawaban
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const selfAssessmentsRelations = relations(selfAssessments, ({ one }) => ({
  application: one(certificationApplications, {
    fields: [selfAssessments.applicationId],
    references: [certificationApplications.id],
  }),
}));

export const insertSelfAssessmentSchema = createInsertSchema(selfAssessments).omit({
  id: true,
  submittedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSelfAssessment = z.infer<typeof insertSelfAssessmentSchema>;
export type SelfAssessment = typeof selfAssessments.$inferSelect;

// Tabel Asesmen (hasil assessment oleh asesor)
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => certificationApplications.id).notNull().unique(),
  asesorId: integer("asesor_id").references(() => asesors.id).notNull(),
  assessmentDate: date("assessment_date").notNull(),
  assessmentLocation: text("assessment_location"),
  assessmentType: text("assessment_type"),
  recommendation: text("recommendation"), // Kompeten, Belum Kompeten
  feedbackNotes: text("feedback_notes"),
  assessmentData: jsonb("assessment_data"), // menyimpan hasil asesmen detail
  validUntil: date("valid_until"),
  certificateNumber: text("certificate_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const assessmentsRelations = relations(assessments, ({ one }) => ({
  application: one(certificationApplications, {
    fields: [assessments.applicationId],
    references: [certificationApplications.id],
  }),
  asesor: one(asesors, {
    fields: [assessments.asesorId],
    references: [asesors.id],
  }),
}));

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

// Tabel dokumen persyaratan (portofolio peserta)
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => certificationApplications.id).notNull(),
  name: text("name").notNull(),
  type: text("type"),
  path: text("path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  verifiedAt: timestamp("verified_at"),
  verifiedBy: integer("verified_by").references(() => users.id),
  status: statusEnum("status").default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const documentsRelations = relations(documents, ({ one }) => ({
  application: one(certificationApplications, {
    fields: [documents.applicationId],
    references: [certificationApplications.id],
  }),
  verifier: one(users, {
    fields: [documents.verifiedBy],
    references: [users.id],
  }),
}));

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
  verifiedAt: true,
  verifiedBy: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// Tabel bank soal (questions bank)
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  schemeId: integer("scheme_id").references(() => certificationSchemes.id).notNull(),
  unitId: integer("unit_id").references(() => competencyUnits.id),
  question: text("question").notNull(),
  questionType: questionTypeEnum("question_type").default("pilihan_ganda").notNull(),
  options: jsonb("options"), // Array opsi jawaban untuk pilihan ganda [{value: "A", text: "Jawaban A"}, ...]
  correctAnswer: text("correct_answer").notNull(), // Untuk pilihan ganda bisa "A", "B", etc
  explanation: text("explanation"), // Penjelasan jawaban benar
  difficultyLevel: difficultyLevelEnum("difficulty_level").default("sedang"),
  tags: text("tags"), // Tag kategori, dipisahkan dengan koma
  points: integer("points").default(1), // Nilai poin jika benar
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id),
});

export const questionsRelations = relations(questions, ({ one, many }) => ({
  scheme: one(certificationSchemes, {
    fields: [questions.schemeId],
    references: [certificationSchemes.id],
  }),
  unit: one(competencyUnits, {
    fields: [questions.unitId],
    references: [competencyUnits.id],
  }),
  creator: one(users, {
    fields: [questions.createdBy],
    references: [users.id],
  }),
}));

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

// Tabel template ujian
export const examinationTemplates = pgTable("examination_templates", {
  id: serial("id").primaryKey(),
  schemeId: integer("scheme_id").references(() => certificationSchemes.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  duration: integer("duration").default(60), // Durasi ujian dalam menit
  totalQuestions: integer("total_questions").default(20),
  passingScore: integer("passing_score").default(70), // Nilai kelulusan (persentase)
  randomizeQuestions: boolean("randomize_questions").default(true),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id),
});

export const examinationTemplatesRelations = relations(examinationTemplates, ({ one }) => ({
  scheme: one(certificationSchemes, {
    fields: [examinationTemplates.schemeId],
    references: [certificationSchemes.id],
  }),
  creator: one(users, {
    fields: [examinationTemplates.createdBy],
    references: [users.id],
  }),
}));

export const insertExaminationTemplateSchema = createInsertSchema(examinationTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertExaminationTemplate = z.infer<typeof insertExaminationTemplateSchema>;
export type ExaminationTemplate = typeof examinationTemplates.$inferSelect;

// Tabel ujian peserta
export const examinations = pgTable("examinations", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").references(() => examinationTemplates.id).notNull(),
  applicationId: integer("application_id").references(() => certificationApplications.id).notNull(),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // Durasi aktual dalam menit
  totalQuestions: integer("total_questions"),
  correctAnswers: integer("correct_answers"),
  score: integer("score"), // Nilai persentase (0-100)
  passed: boolean("passed"),
  status: text("status").default("pending"), // pending, in_progress, completed, evaluated
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  evaluatedBy: integer("evaluated_by").references(() => users.id),
  evaluatedAt: timestamp("evaluated_at"),
});

export const examinationsRelations = relations(examinations, ({ one }) => ({
  template: one(examinationTemplates, {
    fields: [examinations.templateId],
    references: [examinationTemplates.id],
  }),
  application: one(certificationApplications, {
    fields: [examinations.applicationId],
    references: [certificationApplications.id],
    relationName: "applicationExaminations",
  }),
  evaluator: one(users, {
    fields: [examinations.evaluatedBy],
    references: [users.id],
  }),
}));

// Tabel jawaban ujian peserta
export const examinationAnswers = pgTable("examination_answers", {
  id: serial("id").primaryKey(),
  examinationId: integer("examination_id").references(() => examinations.id).notNull(),
  questionId: integer("question_id").references(() => questions.id).notNull(),
  answer: text("answer").notNull(),
  isCorrect: boolean("is_correct"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const examinationAnswersRelations = relations(examinationAnswers, ({ one }) => ({
  examination: one(examinations, {
    fields: [examinationAnswers.examinationId],
    references: [examinations.id],
  }),
  question: one(questions, {
    fields: [examinationAnswers.questionId],
    references: [questions.id],
  }),
}));

export const insertExaminationAnswerSchema = createInsertSchema(examinationAnswers).omit({
  id: true,
  isCorrect: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertExaminationAnswer = z.infer<typeof insertExaminationAnswerSchema>;
export type ExaminationAnswer = typeof examinationAnswers.$inferSelect;

export const insertExaminationSchema = createInsertSchema(examinations).omit({
  id: true,
  startTime: true,
  endTime: true,
  correctAnswers: true,
  score: true,
  passed: true,
  createdAt: true,
  updatedAt: true,
  evaluatedBy: true,
  evaluatedAt: true,
});

export type InsertExamination = z.infer<typeof insertExaminationSchema>;
export type Examination = typeof examinations.$inferSelect;

// Tabel relasi ujian dengan pertanyaan
export const examinationQuestions = pgTable("examination_questions", {
  id: serial("id").primaryKey(),
  examinationId: integer("examination_id").references(() => examinations.id).notNull(),
  questionId: integer("question_id").references(() => questions.id).notNull(),
  order: integer("order").default(0),
  userAnswer: text("user_answer"),
  isCorrect: boolean("is_correct"),
  answeredAt: timestamp("answered_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const examinationQuestionsRelations = relations(examinationQuestions, ({ one }) => ({
  examination: one(examinations, {
    fields: [examinationQuestions.examinationId],
    references: [examinations.id],
  }),
  question: one(questions, {
    fields: [examinationQuestions.questionId],
    references: [questions.id],
  }),
}));

export const insertExaminationQuestionSchema = createInsertSchema(examinationQuestions).omit({
  id: true,
  isCorrect: true,
  answeredAt: true,
  createdAt: true,
});

export type InsertExaminationQuestion = z.infer<typeof insertExaminationQuestionSchema>;
export type ExaminationQuestion = typeof examinationQuestions.$inferSelect;

// Tabel provinsi
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

// Tabel jadwal
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  schemeId: integer("scheme_id").references(() => certificationSchemes.id),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  label: text("label"),
  location: text("location"),
  provinceId: integer("province_id").references(() => provinces.id),
  quota: integer("quota"),
  registeredCount: integer("registered_count").default(0),
  status: statusEnum("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const schedulesRelations = relations(schedules, ({ one }) => ({
  scheme: one(certificationSchemes, {
    fields: [schedules.schemeId],
    references: [certificationSchemes.id],
  }),
  province: one(provinces, {
    fields: [schedules.provinceId],
    references: [provinces.id],
  }),
}));

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
  registeredCount: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type Schedule = typeof schedules.$inferSelect;

// Tabel partner
export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  website: text("website"),
  description: text("description"),
  status: statusEnum("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type Partner = typeof partners.$inferSelect;

// Definisikan semua relasi yang dihapus untuk menghindari referensi siklik
export const usersRelations = relations(users, ({ one, many }) => ({
  asesor: one(asesors, {
    fields: [users.id],
    references: [asesors.userId],
  }),
  asesi: one(asesis, {
    fields: [users.id],
    references: [asesis.userId],
  }),
  certificationApplicationsProcessed: many(certificationApplications, { relationName: "processor" }),
  documentsVerified: many(documents, { relationName: "verifier" }),
}));

export const asesorsRelations = relations(asesors, ({ one, many }) => ({
  user: one(users, {
    fields: [asesors.userId],
    references: [users.id],
  }),
  assessments: many(assessments),
}));

export const asesisRelations = relations(asesis, ({ one, many }) => ({
  user: one(users, {
    fields: [asesis.userId],
    references: [users.id],
  }),
  certificationApplications: many(certificationApplications),
}));

export const competencyUnitsRelations = relations(competencyUnits, ({ many }) => ({
  schemeUnits: many(schemeCompetencyUnits),
}));

export const certificationSchemesRelations = relations(certificationSchemes, ({ many }) => ({
  schemeUnits: many(schemeCompetencyUnits),
  schedules: many(schedules),
  applications: many(certificationApplications),
}));

export const certificationApplicationsRelations = relations(certificationApplications, ({ one, many }) => ({
  asesi: one(asesis, {
    fields: [certificationApplications.asesiId],
    references: [asesis.id],
  }),
  scheme: one(certificationSchemes, {
    fields: [certificationApplications.schemeId],
    references: [certificationSchemes.id],
  }),
  processor: one(users, {
    fields: [certificationApplications.processedBy],
    references: [users.id],
    relationName: "processor",
  }),
  selfAssessment: one(selfAssessments, {
    fields: [certificationApplications.id],
    references: [selfAssessments.applicationId],
  }),
  assessment: one(assessments, {
    fields: [certificationApplications.id],
    references: [assessments.applicationId],
  }),
  documents: many(documents),
  examinations: many(examinations, { relationName: "applicationExaminations" }),
}));
