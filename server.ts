import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import axios from "axios";
import crypto from "crypto";
import helmet from "helmet";
import csrf from "csurf";
import cookieParser from "cookie-parser";

dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:", "wss:"],
      },
    },
  }));
  app.use(express.json());
  app.use(cookieParser());
  
  // Custom CSRF error handler since this is an API
  const csrfProtection = csrf({ cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' } });
  
  app.get("/api/csrf-token", csrfProtection, (req, res) => {
    res.json({ csrfToken: (req as express.Request & { csrfToken: () => string }).csrfToken() });
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    // Only return ok without sensitive info
    res.json({ status: "ok" });
  });

  // Gemini AI Discovery Agent
  app.post("/api/ai/discover", csrfProtection, async (req, res) => {
    try {
      const { query } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are ZA Scout AI, an expert DAO intelligence assistant. 
        The user is asking: "${query}". 
        Based on this, return a list of recommended DAO opportunity types (grant, bounty, proposal), 
        suggested keywords for filtering, a brief summary, and specific filter hints if applicable (e.g., status, reward range).
        Response in JSON: { 
          "recommendations": string[], 
          "keywords": string[], 
          "summary": string,
          "filterHints": {
            "status"?: "active" | "open" | "voting",
            "type"?: "grant" | "bounty" | "proposal"
          }
        }`,
        config: {
          responseMimeType: "application/json"
        }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error" });
      }
    }
  });

  // DAO Data Service
  app.get("/api/dao/opportunities", async (req, res) => {
    const mocks = [
      { id: "1", title: "AI Tooling Grant", type: "grant", dao: "ZeroAuth", reward: 5000, tags: ["AI", "Infra"], status: "active", deadline: "2024-12-01", activityScore: 92, sourceUrl: "https://zeroauthoritydao.com/funding/degrants", sourcePlatform: "ZeroAuth" },
      { id: "2", title: "Governance Dashboard Bounty", type: "bounty", dao: "DeveloperDAO", reward: 1200, tags: ["Frontend", "React"], status: "open", deadline: "2024-11-15", activityScore: 78, sourceUrl: "https://gitcoin.co/", sourcePlatform: "Gitcoin" },
      { id: "3", title: "ZKP Research Proposal", type: "proposal", dao: "PrivacyDAO", reward: 0, tags: ["ZKP", "Research"], status: "voting", deadline: "2024-11-05", activityScore: 85, sourceUrl: "https://snapshot.org/", sourcePlatform: "Snapshot" },
      { id: "4", title: "Community Management Grant", type: "grant", dao: "SocialDAO", reward: 3000, tags: ["Community", "Ops"], status: "active", deadline: "2024-12-30", activityScore: 64, sourceUrl: "https://tally.xyz/", sourcePlatform: "Tally" },
      { id: "5", title: "Solidity Security Audit", type: "bounty", dao: "ZeroAuth", reward: 2500, tags: ["Security", "Solidity"], status: "open", deadline: "2024-11-20", activityScore: 88, sourceUrl: "https://zeroauthoritydao.com/bounty", sourcePlatform: "ZeroAuth" },
      { id: "6", title: "Technical Writing Bounty", type: "bounty", dao: "DocsDAO", reward: 800, tags: ["Writing", "Docs"], status: "open", deadline: "2024-11-25", activityScore: 45, sourceUrl: "https://app.safe.global/", sourcePlatform: "Safe" },
      { id: "7", title: "DeFi Yield Optimizer Strategy", type: "proposal", dao: "YieldDAO", reward: 0, tags: ["DeFi", "Strategy"], status: "voting", deadline: "2024-11-10", activityScore: 95, sourceUrl: "https://arbitrum.io/", sourcePlatform: "Arbitrum" },
      { id: "8", title: "Web3 SDK Development Grant", type: "grant", dao: "BuilderDAO", reward: 10000, tags: ["Web3", "SDK", "DevEx"], status: "active", deadline: "2025-01-15", activityScore: 82, sourceUrl: "https://optimism.io/", sourcePlatform: "Optimism" },
      { id: "9", title: "Frontend UI Kit Contributor", type: "bounty", dao: "DesignDAO", reward: 1500, tags: ["Frontend", "UI"], status: "open", deadline: "2024-11-30", activityScore: 70, sourceUrl: "https://zeroauthoritydao.com/bounty", sourcePlatform: "ZeroAuth" },
      { id: "10", title: "Zero Knowledge Proof Infrastructure", type: "grant", dao: "PrivacyDAO", reward: 15000, tags: ["ZKP", "Backend"], status: "active", deadline: "2025-02-01", activityScore: 98, sourceUrl: "https://gitcoin.co/", sourcePlatform: "Gitcoin" },
    ];

    try {
      // Attempt to fetch from real Zero Authority API
      // Note: We use a timeout to ensure mock fallback if the external API is slow
      const response = await axios.get("https://zeroauthoritydao.com/api/v1/bounties", { timeout: 3000 });
      if (response.data && Array.isArray(response.data)) {
        // Transform real data to our format if needed
        const realOps = response.data.map((b: Record<string, unknown>) => ({
          id: `zap-${b.id || crypto.randomUUID()}`,
          title: typeof b.title === 'string' ? b.title : "Untitled Opportunity",
          type: "bounty",
          dao: "ZeroAuth",
          reward: typeof b.reward === 'number' ? b.reward : 0,
          tags: Array.isArray(b.tags) ? b.tags : ["General"],
          status: typeof b.status === 'string' ? b.status : "open",
          deadline: typeof b.deadline === 'string' ? b.deadline : "TBD",
          activityScore: crypto.randomInt(60, 100),
          sourceUrl: `https://zeroauthoritydao.com/bounty/${b.id}`,
          sourcePlatform: "ZeroAuth"
        }));
        return res.json([...realOps, ...mocks]);
      }
    } catch (e) {
      console.warn("Could not fetch real data from Zero Authority, using mocks only.");
    }
    
    res.json(mocks);
  });

  // Zero Authority Direct Proxy
  app.get("/api/v1/:resource", async (req, res) => {
    const { resource } = req.params;
    const zapApiUrl = `https://zeroauthoritydao.com/api/v1/${resource}`;
    try {
      const response = await axios.get(zapApiUrl);
      res.json(response.data);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        res.status(e.response?.status || 500).json({ error: e.message });
      } else if (e instanceof Error) {
        res.status(500).json({ error: e.message });
      } else {
        res.status(500).json({ error: "Unknown error" });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
