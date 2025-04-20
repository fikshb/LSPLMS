import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User } from "@shared/schema";

// Import connect-pg-simple for database sessions
import connectPgSimple from "connect-pg-simple";

declare global {
  namespace Express {
    // Extend Express.User with custom User properties from schema
    interface User {
      id: number;
      username: string;
      password: string;
      email: string;
      fullName: string | null;
      role: "admin" | "asesor" | "asesi";
      phoneNumber: string | null;
      address: string | null;
      profilePicture: string | null;
      isActive: boolean | null;
      lastLogin: Date | null;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "lsp-wirausaha-kompeten-nusantara-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Username atau password salah" });
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth routes
  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username sudah digunakan" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error, user: UserModel, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Login gagal" });
      }
      
      req.login(user, (err) => {
        if (err) return next(err);
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user as Express.User;
    res.json(userWithoutPassword);
  });

  // Role-based endpoints
  
  // Admin endpoints
  app.get("/api/admin/counts", (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    // In a real app, you would fetch these from the database
    res.json({
      usersCount: 120,
      activeAssessmentsCount: 15,
      schemesCount: 8,
      asesorsCount: 25
    });
  });
  
  // Asesor endpoints
  app.get("/api/asesor/assessments", (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "asesor") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    // In a real app, you would fetch these from the database
    res.json([]);
  });
  
  app.get("/api/asesor/forms", (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "asesor") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    // In a real app, you would fetch these from the database
    res.json([]);
  });
  
  // Asesi endpoints
  app.get("/api/asesi/applications", (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "asesi") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    // In a real app, you would fetch these from the database
    res.json([]);
  });
}