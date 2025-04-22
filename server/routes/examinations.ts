import { Request, Response } from "express";
import { storage } from "../storage";

export async function setupExaminationRoutes(app: any, apiPrefix: string) {
  // Get all examinations
  app.get(`${apiPrefix}/examinations`, async (req: Request, res: Response) => {
    try {
      const { status, applicationId } = req.query;
      const examinations = await storage.getExaminations(
        applicationId ? parseInt(applicationId as string) : undefined
      );
      res.json(examinations);
    } catch (error: any) {
      console.error("Error fetching examinations:", error);
      res.status(500).json({
        message: "Terjadi kesalahan saat mengambil data ujian",
        error: error.message,
      });
    }
  });

  // Get a specific examination by ID
  app.get(`${apiPrefix}/examinations/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const examination = await storage.getExaminationById(id);
      
      if (!examination) {
        return res.status(404).json({ message: "Ujian tidak ditemukan" });
      }
      
      res.json(examination);
    } catch (error: any) {
      console.error("Error fetching examination:", error);
      res.status(500).json({
        message: "Terjadi kesalahan saat mengambil data ujian",
        error: error.message,
      });
    }
  });

  // Create a new examination
  app.post(`${apiPrefix}/examinations`, async (req: Request, res: Response) => {
    try {
      const { templateId, applicationId } = req.body;
      
      // Validate required fields
      if (!templateId || !applicationId) {
        return res.status(400).json({ 
          message: "Template ujian dan aplikasi sertifikasi harus diisi" 
        });
      }
      
      const examination = await storage.createExamination({
        templateId,
        applicationId,
        status: "pending",
      });
      
      res.status(201).json(examination);
    } catch (error: any) {
      console.error("Error creating examination:", error);
      res.status(500).json({
        message: "Terjadi kesalahan saat membuat ujian",
        error: error.message,
      });
    }
  });

  // Start an examination
  app.post(`${apiPrefix}/examinations/:id/start`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const examination = await storage.startExamination(id);
      res.json(examination);
    } catch (error: any) {
      console.error("Error starting examination:", error);
      res.status(500).json({
        message: "Terjadi kesalahan saat memulai ujian",
        error: error.message,
      });
    }
  });

  // Submit examination answers
  app.post(`${apiPrefix}/examinations/:id/submit`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { answers } = req.body;
      
      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: "Jawaban ujian tidak valid" });
      }
      
      const examination = await storage.submitExamination(id, answers);
      res.json(examination);
    } catch (error: any) {
      console.error("Error submitting examination:", error);
      res.status(500).json({
        message: "Terjadi kesalahan saat mengirim jawaban ujian",
        error: error.message,
      });
    }
  });

  // Evaluate an examination
  app.post(`${apiPrefix}/examinations/:id/evaluate`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (!req.user) {
        return res.status(401).json({ message: "Anda harus login untuk mengevaluasi ujian" });
      }
      
      const examination = await storage.evaluateExamination(id, req.user.id);
      res.json(examination);
    } catch (error: any) {
      console.error("Error evaluating examination:", error);
      res.status(500).json({
        message: "Terjadi kesalahan saat mengevaluasi ujian",
        error: error.message,
      });
    }
  });

  // Get eligible applications for examinations
  app.get(`${apiPrefix}/certification-applications/eligible`, async (req: Request, res: Response) => {
    try {
      // Untuk sementara, kita gunakan data aplikasi sertifikasi yang ada
      // TODO: Implementasikan logika untuk aplikasi yang eligible
      const applications = [];  // Database belum siap, sementara return array kosong
      res.json(applications);
    } catch (error: any) {
      console.error("Error fetching eligible applications:", error);
      res.status(500).json({
        message: "Terjadi kesalahan saat mengambil data aplikasi",
        error: error.message,
      });
    }
  });
}