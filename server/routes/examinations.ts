import { Request, Response } from "express";
import { storage } from "../storage";

// Definisikan fungsi middleware requireAdmin yang diperlukan
// untuk mengontrol akses ke endpoint admin
function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}

export async function setupExaminationRoutes(app: any, apiPrefix: string) {
  // Get all examinations
  app.get(`${apiPrefix}/examinations`, async (req: Request, res: Response) => {
    try {
      const { status, applicationId } = req.query;
      const examinations = await storage.getExaminations(
        applicationId ? parseInt(applicationId as string) : undefined
      );
      
      // Untuk setiap ujian, dapatkan informasi template
      const examinationsWithDetails = await Promise.all(
        examinations.map(async (examination) => {
          const template = await storage.getExaminationTemplateById(examination.templateId);
          
          // TODO: Dapatkan informasi aplikasi sertifikasi (dan asesi) ketika API siap
          const application = { id: examination.applicationId };
          
          return {
            ...examination,
            template,
            application
          };
        })
      );
      
      res.json(examinationsWithDetails);
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
      
      // Dapatkan informasi template ujian
      const template = await storage.getExaminationTemplateById(examination.templateId);
      
      // Dapatkan informasi aplikasi sertifikasi (dan asesi)
      // TODO: Implementasikan getCertificationApplicationById
      // const application = await storage.getCertificationApplicationById(examination.applicationId);
      const application = { id: examination.applicationId }; // Untuk sementara
      
      // Untuk ujian yang sudah selesai, dapatkan pertanyaan dan jawaban
      let questions: any[] = [];
      if (examination.status === "completed" || examination.status === "evaluated") {
        // TODO: Tambahkan metode untuk mendapatkan pertanyaan dan jawaban ujian
        // questions = await storage.getExaminationQuestions(examination.id);
      }
      
      // Gabungkan informasi
      const result = {
        ...examination,
        template,
        application,
        questions
      };
      
      res.json(result);
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
      // Buat data sample untuk aplikasi sertifikasi yang eligible
      const sampleApplications = [
        {
          id: 1,
          asesiId: 2,
          schemeId: 1,
          status: "approved",
          asesi: {
            userId: 4,
            user: {
              fullName: "Peserta Asesmen",
              email: "peserta@peserta.com"
            }
          },
          scheme: {
            name: "Digital Marketing"
          }
        },
        {
          id: 2,
          asesiId: 2,
          schemeId: 2,
          status: "approved",
          asesi: {
            userId: 4,
            user: {
              fullName: "Peserta Asesmen",
              email: "peserta@peserta.com"
            }
          },
          scheme: {
            name: "Web Development"
          }
        }
      ];
      
      res.json(sampleApplications);
    } catch (error: any) {
      console.error("Error fetching eligible applications:", error);
      res.status(500).json({
        message: "Terjadi kesalahan saat mengambil data aplikasi",
        error: error.message,
      });
    }
  });
  
  // Get applications for creating examinations
  app.get(`${apiPrefix}/applications`, requireAdmin, async (req: Request, res: Response) => {
    try {
      // Buat data sample untuk aplikasi sertifikasi
      const sampleApplications = [
        {
          id: 1,
          asesiId: 2,
          schemeId: 1,
          status: "approved",
          asesi: {
            userId: 4,
            user: {
              fullName: "Peserta Asesmen",
              email: "peserta@peserta.com"
            }
          },
          scheme: {
            name: "Digital Marketing"
          }
        },
        {
          id: 2,
          asesiId: 2,
          schemeId: 2,
          status: "approved",
          asesi: {
            userId: 4,
            user: {
              fullName: "Peserta Asesmen",
              email: "peserta@peserta.com"
            }
          },
          scheme: {
            name: "Web Development"
          }
        }
      ];
      
      res.json(sampleApplications);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      res.status(500).json({
        message: "Terjadi kesalahan saat mengambil data aplikasi",
        error: error.message,
      });
    }
  });
  
  // Get examination templates
  app.get(`${apiPrefix}/examination-templates`, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { schemeId } = req.query;
      
      // Buat data sample untuk template ujian
      const sampleTemplates = [
        {
          id: 1,
          name: "Template Ujian Digital Marketing",
          schemeId: 1,
          duration: 60, // dalam menit
          passingScore: 70,
          totalQuestions: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 1,
          scheme: {
            name: "Digital Marketing"
          }
        },
        {
          id: 2,
          name: "Template Ujian Web Development",
          schemeId: 2,
          duration: 90, // dalam menit
          passingScore: 75,
          totalQuestions: 25,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 1,
          scheme: {
            name: "Web Development"
          }
        }
      ];
      
      // Filter berdasarkan schemeId jika ada
      const templates = schemeId 
        ? sampleTemplates.filter(t => t.schemeId === parseInt(schemeId as string))
        : sampleTemplates;
      
      res.json(templates);
    } catch (error: any) {
      console.error("Error fetching examination templates:", error);
      res.status(500).json({
        message: "Terjadi kesalahan saat mengambil data template ujian",
        error: error.message,
      });
    }
  });
}