import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiPrefix = "/api";

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
