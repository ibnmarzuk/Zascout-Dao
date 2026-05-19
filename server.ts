import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import axios from "axios";
import crypto from "crypto";
import helmet from "helmet";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import compression from "compression";

dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
  
  app.use(express.static(path.join(process.cwd(), "public")));

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com", "https://unpkg.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:", "wss:"],
      },
    },
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(compression());
  
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/", apiLimiter);
  
  const csrfProtection = csrf({ cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' } });
  
  // Public route for the explorer interface (EJS)
  app.get('/', csrfProtection, async (req, res) => {
    let opportunities = [];
    try {
      // Attempt to hit Zero Authority API
      const response = await axios.get("https://zeroauthoritydao.com/api/v1/bounties", { timeout: 3000 });
      if (response.data && Array.isArray(response.data)) {
        opportunities = response.data.map((b: Record<string, unknown>) => ({
          id: b.id || crypto.randomUUID(),
          title: b.title || "Untitled Opportunity",
          type: "bounty",
          dao: "Zero Authority",
          reward: b.reward || 0,
          tags: Array.isArray(b.tags) ? b.tags : [],
          status: b.status || "open"
        }));
      }
    } catch (e) {
      // Meaningful mockup data based on Zero Authority domain if API is unreachable
      opportunities = [
        { id: "zap-1", title: "Implement MCP Server for AIBTC", type: "bounty", dao: "Zero Authority", reward: 2500, tags: ["AI", "Typescript", "MCP"], status: "open" },
        { id: "zap-2", title: "Build DeGrant Front-end", type: "grant", dao: "Zero Authority", reward: 5000, tags: ["Frontend", "Design"], status: "active" },
        { id: "zap-3", title: "Smart Contract Audit - SIP 10", type: "bounty", dao: "Security Council", reward: 8000, tags: ["Security", "Clarity"], status: "open" },
        { id: "zap-4", title: "Claude Desktop Integration Guide", type: "quest", dao: "Zero Authority", reward: 500, tags: ["Writing", "Docs"], status: "open" },
      ];
    }
    
    res.render('index', { 
      opportunities, 
      csrfToken: (req as any).csrfToken() 
    });
  });

  app.get('/mcp', csrfProtection, (req, res) => {
    res.render('mcp', { csrfToken: (req as any).csrfToken() });
  });

  // Zero Authority Bounties API
  app.get("/api/v1/:resource", async (req, res) => {
    const { resource } = req.params;
    const zapApiUrl = `https://zeroauthoritydao.com/api/v1/${resource}`;
    try {
      const response = await axios.get(zapApiUrl);
      res.json(response.data);
    } catch (e: any) {
      res.status(e.response?.status || 500).json({ error: e.message || "Unknown error" });
    }
  });

  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }

export default app;
