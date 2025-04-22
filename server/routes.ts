import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { setupAuth } from "./auth";

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

  const httpServer = createServer(app);
  return httpServer;
}
