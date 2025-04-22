import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { setupAuth } from "./auth";
import { insertCertificationSchemeSchema } from "../shared/schema";
import { desc, eq, or, ilike, count } from "drizzle-orm";
import { setupExaminationRoutes } from "./routes/examinations";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up auth with Passport
  setupAuth(app);
  // API routes prefix
  const apiPrefix = "/api";

  // Middleware untuk memastikan user adalah admin
  const requireAdmin = (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden. Admin access required." });
    }
    next();
  };

  // Middleware untuk memastikan user adalah asesor
  const requireAsesor = (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user?.role !== "asesor") {
      return res.status(403).json({ message: "Forbidden. Asesor access required." });
    }
    next();
  };

  // Middleware untuk memastikan user adalah asesi
  const requireAsesi = (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user?.role !== "asesi") {
      return res.status(403).json({ message: "Forbidden. Asesi access required." });
    }
    next();
  };

  // Endpoint Admin

  // Get admin dashboard counts
  app.get(`${apiPrefix}/admin/counts`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const counts = await storage.getDashboardCounts();
      res.json(counts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard counts" });
    }
  });

  // Get all asesor
  app.get(`${apiPrefix}/admin/asesors`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const asesors = await storage.getAsesors();
      res.json(asesors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch asesors" });
    }
  });

  // Get asesor by ID
  app.get(`${apiPrefix}/admin/asesors/:id`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const asesor = await storage.getAsesorById(id);
      if (!asesor) {
        return res.status(404).json({ message: "Asesor not found" });
      }
      
      res.json(asesor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch asesor" });
    }
  });

  // Tambah asesor baru
  app.post(`${apiPrefix}/admin/asesors`, requireAdmin, async (req: Request, res: Response) => {
    try {
      // Validasi input dengan zod
      const asesorSchema = z.object({
        username: z.string().min(4, "Username minimal 4 karakter"),
        email: z.string().email("Email tidak valid"),
        password: z.string().min(6, "Password minimal 6 karakter"),
        fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
        bidangKompetensi: z.string().optional(),
        nomorRegistrasi: z.string().optional(),
        isActive: z.boolean().default(true)
      });
      
      const asesorData = asesorSchema.parse(req.body);
      
      // Cek apakah username sudah dipakai
      const existingUser = await storage.getUserByUsername(asesorData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username sudah digunakan" });
      }
      
      // Hash password
      const hashedPassword = await storage.hashPassword(asesorData.password);
      
      // Create asesor
      const asesor = await storage.createAsesor({
        ...asesorData,
        password: hashedPassword
      });
      
      res.status(201).json(asesor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validasi gagal", 
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create asesor" });
    }
  });

  // Update asesor
  app.patch(`${apiPrefix}/admin/asesors/:id`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Pastikan asesor ada
      const existingAsesor = await storage.getAsesorById(id);
      if (!existingAsesor) {
        return res.status(404).json({ message: "Asesor not found" });
      }
      
      // Validasi input dengan zod
      const updateSchema = z.object({
        username: z.string().min(4, "Username minimal 4 karakter").optional(),
        email: z.string().email("Email tidak valid").optional(),
        password: z.string().optional(),
        fullName: z.string().min(3, "Nama lengkap minimal 3 karakter").optional(),
        bidangKompetensi: z.string().optional(),
        nomorRegistrasi: z.string().optional(),
        isActive: z.boolean().optional()
      });
      
      const updateData = updateSchema.parse(req.body);
      
      // Cek apakah username baru sudah dipakai oleh user lain
      if (updateData.username && updateData.username !== existingAsesor.username) {
        const existingUser = await storage.getUserByUsername(updateData.username);
        if (existingUser && existingUser.id !== id) {
          return res.status(400).json({ message: "Username sudah digunakan" });
        }
      }
      
      // Update asesor
      const updatedAsesor = await storage.updateAsesor(id, updateData);
      
      res.json(updatedAsesor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validasi gagal", 
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to update asesor" });
    }
  });

  // Delete asesor
  app.delete(`${apiPrefix}/admin/asesors/:id`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Pastikan asesor ada
      const existingAsesor = await storage.getAsesorById(id);
      if (!existingAsesor) {
        return res.status(404).json({ message: "Asesor not found" });
      }
      
      // Delete asesor
      const result = await storage.deleteAsesor(id);
      
      if (result) {
        res.status(200).json({ message: "Asesor berhasil dihapus" });
      } else {
        res.status(500).json({ message: "Failed to delete asesor" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete asesor" });
    }
  });

  // Admin - Manage Certification Schemes
  
  // Get all schemes (admin view - shows all data including inactive)
  app.get(`${apiPrefix}/admin/schemes`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const schemes = await storage.getSchemes();
      res.json(schemes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schemes" });
    }
  });
  
  // Get scheme by ID
  app.get(`${apiPrefix}/admin/schemes/:id`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const scheme = await storage.getSchemeById(id);
      
      if (!scheme) {
        return res.status(404).json({ message: "Skema tidak ditemukan" });
      }
      
      res.json(scheme);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scheme" });
    }
  });
  
  // Create a new scheme
  app.post(`${apiPrefix}/admin/schemes`, requireAdmin, async (req: Request, res: Response) => {
    try {
      // Validasi input menggunakan insertCertificationSchemeSchema dari schema.ts
      const schemeData = insertCertificationSchemeSchema.parse(req.body);
      
      // Generate slug dari nama jika tidak ada
      if (!schemeData.slug) {
        schemeData.slug = schemeData.name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '');
      }
      
      const scheme = await storage.createScheme(schemeData);
      res.status(201).json(scheme);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validasi gagal", errors: error.errors });
      } else {
        console.error(error);
        res.status(500).json({ message: "Failed to create scheme" });
      }
    }
  });
  
  // Update an existing scheme
  app.patch(`${apiPrefix}/admin/schemes/:id`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Cek apakah skema ada
      const existingScheme = await storage.getSchemeById(id);
      if (!existingScheme) {
        return res.status(404).json({ message: "Skema tidak ditemukan" });
      }
      
      // Validasi body request dengan partial skema
      const updateData = insertCertificationSchemeSchema.partial().parse(req.body);
      
      // Update scheme
      const updatedScheme = await storage.updateScheme(id, updateData);
      res.json(updatedScheme);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validasi gagal", errors: error.errors });
      } else {
        console.error(error);
        res.status(500).json({ message: "Failed to update scheme" });
      }
    }
  });
  
  // Delete a scheme
  app.delete(`${apiPrefix}/admin/schemes/:id`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Pastikan skema ada
      const existingScheme = await storage.getSchemeById(id);
      if (!existingScheme) {
        return res.status(404).json({ message: "Skema tidak ditemukan" });
      }
      
      const result = await storage.deleteScheme(id);
      
      if (result) {
        res.status(200).json({ message: "Skema berhasil dihapus" });
      } else {
        res.status(500).json({ message: "Failed to delete scheme" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete scheme" });
    }
  });

  // Endpoint Publik

  // Get all certification schemes
  app.get(`${apiPrefix}/schemes`, async (req: Request, res: Response) => {
    try {
      const schemes = await storage.getSchemes();
      res.json(schemes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schemes" });
    }
  });

  // Get a certification scheme by slug
  app.get(`${apiPrefix}/schemes/:slug`, async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const scheme = await storage.getSchemeBySlug(slug);
      
      if (!scheme) {
        return res.status(404).json({ message: "Scheme not found" });
      }
      
      res.json(scheme);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scheme" });
    }
  });

  // Get all schemes by category
  app.get(`${apiPrefix}/schemes/category/:category`, async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const schemes = await storage.getSchemesByCategory(category);
      res.json(schemes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schemes by category" });
    }
  });

  // Get popular schemes
  app.get(`${apiPrefix}/schemes/popular/:limit?`, async (req: Request, res: Response) => {
    try {
      const limitSchema = z.object({
        limit: z.string().optional().transform(val => val ? parseInt(val) : 10)
      });
      
      const { limit } = limitSchema.parse(req.params);
      const schemes = await storage.getPopularSchemes(limit);
      res.json(schemes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular schemes" });
    }
  });

  // Search schemes
  app.get(`${apiPrefix}/schemes/search/:query`, async (req: Request, res: Response) => {
    try {
      const { query } = req.params;
      const schemes = await storage.searchSchemes(query);
      res.json(schemes);
    } catch (error) {
      res.status(500).json({ message: "Failed to search schemes" });
    }
  });

  // Get all provinces
  app.get(`${apiPrefix}/provinces`, async (req: Request, res: Response) => {
    try {
      const provinces = await storage.getProvinces();
      res.json(provinces);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch provinces" });
    }
  });

  // Get all schedules
  app.get(`${apiPrefix}/schedules`, async (req: Request, res: Response) => {
    try {
      const schedules = await storage.getSchedules();
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedules" });
    }
  });

  // Get all partners
  app.get(`${apiPrefix}/partners`, async (req: Request, res: Response) => {
    try {
      const partners = await storage.getPartners();
      res.json(partners);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch partners" });
    }
  });

  // API untuk bank soal
  app.get(`${apiPrefix}/questions`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const schemeId = req.query.schemeId ? parseInt(req.query.schemeId as string) : undefined;
      const unitId = req.query.unitId ? parseInt(req.query.unitId as string) : undefined;
      
      const questions = await storage.getQuestions(schemeId, unitId);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data soal" });
    }
  });
  
  app.get(`${apiPrefix}/questions/:id`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const question = await storage.getQuestionById(id);
      
      if (!question) {
        return res.status(404).json({ message: "Soal tidak ditemukan" });
      }
      
      res.json(question);
    } catch (error) {
      console.error("Error fetching question:", error);
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data soal" });
    }
  });
  
  app.post(`${apiPrefix}/questions`, requireAdmin, async (req: Request, res: Response) => {
    try {
      // Add created_by from authenticated user
      const question = await storage.createQuestion({
        ...req.body,
        createdBy: req.user?.id
      });
      
      res.status(201).json(question);
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(500).json({ message: "Terjadi kesalahan saat membuat soal" });
    }
  });
  
  app.patch(`${apiPrefix}/questions/:id`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const question = await storage.updateQuestion(id, req.body);
      
      res.json(question);
    } catch (error) {
      console.error("Error updating question:", error);
      res.status(500).json({ message: "Terjadi kesalahan saat mengupdate soal" });
    }
  });
  
  app.delete(`${apiPrefix}/questions/:id`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteQuestion(id);
      
      if (!success) {
        return res.status(404).json({ message: "Soal tidak ditemukan" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ message: "Terjadi kesalahan saat menghapus soal" });
    }
  });
  
  // API untuk template ujian
  app.get(`${apiPrefix}/examination-templates`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const schemeId = req.query.schemeId ? parseInt(req.query.schemeId as string) : undefined;
      
      const templates = await storage.getExaminationTemplates(schemeId);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching examination templates:", error);
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data template ujian" });
    }
  });
  
  app.get(`${apiPrefix}/examination-templates/:id`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getExaminationTemplateById(id);
      
      if (!template) {
        return res.status(404).json({ message: "Template ujian tidak ditemukan" });
      }
      
      res.json(template);
    } catch (error) {
      console.error("Error fetching examination template:", error);
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data template ujian" });
    }
  });
  
  app.post(`${apiPrefix}/examination-templates`, requireAdmin, async (req: Request, res: Response) => {
    try {
      // Add created_by from authenticated user
      const template = await storage.createExaminationTemplate({
        ...req.body,
        createdBy: req.user?.id
      });
      
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating examination template:", error);
      res.status(500).json({ message: "Terjadi kesalahan saat membuat template ujian" });
    }
  });
  
  app.patch(`${apiPrefix}/examination-templates/:id`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.updateExaminationTemplate(id, req.body);
      
      res.json(template);
    } catch (error) {
      console.error("Error updating examination template:", error);
      res.status(500).json({ message: "Terjadi kesalahan saat mengupdate template ujian" });
    }
  });
  
  app.delete(`${apiPrefix}/examination-templates/:id`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteExaminationTemplate(id);
      
      if (!success) {
        return res.status(404).json({ message: "Template ujian tidak ditemukan" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting examination template:", error);
      res.status(500).json({ message: "Terjadi kesalahan saat menghapus template ujian" });
    }
  });
  
  // Setup examination routes from separate file
  await setupExaminationRoutes(app, apiPrefix);

  const httpServer = createServer(app);
  return httpServer;
}
