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
      // Meaningful mockup data based on the provided image
      opportunities = [
        { id: "zap-1", title: "Smart contract audit", type: "bounty", dao: "Compound DAO", reward: 800, tags: ["Dev"], status: "open" },
        { id: "zap-2", title: "Frontend integration", type: "bounty", dao: "Aave Grants", reward: 400, tags: ["Dev"], status: "open" },
        { id: "zap-3", title: "Governance explainer", type: "bounty", dao: "ENS DAO", reward: 200, tags: ["Content"], status: "open" },
        { id: "zap-4", title: "Thread on L2 scaling", type: "bounty", dao: "Arbitrum DAO", reward: 150, tags: ["Content"], status: "open" },
        { id: "zap-5", title: "Brand identity refresh", type: "bounty", dao: "Nouns DAO", reward: 600, tags: ["Design"], status: "open" },
        { id: "zap-6", title: "Tokenomics analysis", type: "bounty", dao: "Optimism", reward: 500, tags: ["Research"], status: "open" },
        { id: "zap-7", title: "Core Protocol V2 Development", type: "grant", dao: "Zero Authority", reward: 15000, tags: ["Dev", "Architecture"], status: "active" },
        { id: "zap-8", title: "Community Management Tooling", type: "grant", dao: "Optimism", reward: 5000, tags: ["Dev", "Social"], status: "open" },
        { id: "zap-9", title: "DeFi Research Dashboard", type: "grant", dao: "Aave Grants", reward: 8000, tags: ["Dev", "Design", "Data"], status: "open" },
        { id: "zap-10", title: "Write a deep dive on account abstraction", type: "quest", dao: "Zero Authority", reward: 100, tags: ["Writing"], status: "open" },
        { id: "zap-11", title: "Review 5 PRs in core repo", type: "quest", dao: "Compound DAO", reward: 300, tags: ["Dev", "Review"], status: "open" },
        { id: "zap-12", title: "Participate in weekly dev call", type: "quest", dao: "ENS DAO", reward: 50, tags: ["Community"], status: "completed" },
      ];
    }
    
    res.render('index', { 
      opportunities, 
      csrfToken: (req as any).csrfToken() 
    });
  });

  app.get('/quests', csrfProtection, (req, res) => {
    res.render('quests', { csrfToken: (req as any).csrfToken() });
  });

  app.get('/mcp', csrfProtection, (req, res) => {
    res.render('mcp', { csrfToken: (req as any).csrfToken() });
  });

  // Gemini AI Discovery Agent
  app.post("/api/ai/discover", csrfProtection, async (req, res) => {
    try {
      const { query } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3.1-8b-pro",
        contents: `You are ZA Scout AI, an expert DAO intelligence assistant. 
        The user is asking: "${query}". 
        Based on this, return a list of recommended DAO opportunity types (grant, bounty, proposal or quest), 
        suggested keywords/tags for filtering, a brief summary, recommended DAOs, and specific skills needed.
        Respond STRICTLY in JSON format without markdown wrapping, matching this exact schema: { 
          "recommendations": string[], 
          "keywords": string[],
          "daos": string[],
          "skills": string[],
          "summary": string,
          "filterHints": {
            "status": "active" | "open" | "voting",
            "type": "grant" | "bounty" | "proposal" | "quest"
          }
        }`,
        config: {
          responseMimeType: "application/json"
        }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error" });
      }
    }
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

  if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
    app.listen(PORT as number, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
  
  export default app;
