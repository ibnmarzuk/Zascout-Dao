import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import axios from "axios";

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

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Gemini AI Discovery Agent
  app.post("/api/ai/discover", async (req, res) => {
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
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // DAO Data Service
  app.get("/api/dao/opportunities", async (req, res) => {
    const mocks = [
      { id: "1", title: "AI Tooling Grant", type: "grant", dao: "ZeroAuth", reward: 5000, tags: ["AI", "Infra"], status: "active", deadline: "2024-12-01", activityScore: 92, sourceUrl: "https://zeroauthoritydao.com/funding/degrants" },
      { id: "2", title: "Governance Dashboard Bounty", type: "bounty", dao: "DeveloperDAO", reward: 1200, tags: ["Frontend", "React"], status: "open", deadline: "2024-11-15", activityScore: 78, sourceUrl: "https://zeroauthoritydao.com/bounty" },
      { id: "3", title: "ZKP Research Proposal", type: "proposal", dao: "PrivacyDAO", reward: 0, tags: ["ZKP", "Research"], status: "voting", deadline: "2024-11-05", activityScore: 85, sourceUrl: "https://zeroauthoritydao.com/sip" },
      { id: "4", title: "Community Management Grant", type: "grant", dao: "SocialDAO", reward: 3000, tags: ["Community", "Ops"], status: "active", deadline: "2024-12-30", activityScore: 64, sourceUrl: "https://zeroauthoritydao.com/funding/degrants" },
      { id: "5", title: "Solidity Security Audit", type: "bounty", dao: "ZeroAuth", reward: 2500, tags: ["Security", "Solidity"], status: "open", deadline: "2024-11-20", activityScore: 88, sourceUrl: "https://zeroauthoritydao.com/bounty" },
      { id: "6", title: "Technical Writing Bounty", type: "bounty", dao: "DocsDAO", reward: 800, tags: ["Writing", "Docs"], status: "open", deadline: "2024-11-25", activityScore: 45, sourceUrl: "https://zeroauthoritydao.com/bounty" },
      { id: "7", title: "DeFi Yield Optimizer Strategy", type: "proposal", dao: "YieldDAO", reward: 0, tags: ["DeFi", "Strategy"], status: "voting", deadline: "2024-11-10", activityScore: 95, sourceUrl: "https://zeroauthoritydao.com/sip" },
      { id: "8", title: "Web3 SDK Development Grant", type: "grant", dao: "BuilderDAO", reward: 10000, tags: ["Web3", "SDK", "DevEx"], status: "active", deadline: "2025-01-15", activityScore: 82, sourceUrl: "#" },
      { id: "9", title: "Frontend UI Kit Contributor", type: "bounty", dao: "DesignDAO", reward: 1500, tags: ["Frontend", "UI"], status: "open", deadline: "2024-11-30", activityScore: 70, sourceUrl: "#" },
      { id: "10", title: "Zero Knowledge Proof Infrastructure", type: "grant", dao: "PrivacyDAO", reward: 15000, tags: ["ZKP", "Backend"], status: "active", deadline: "2025-02-01", activityScore: 98, sourceUrl: "#" },
    ];

    try {
      // Attempt to fetch from real Zero Authority API
      // Note: We use a timeout to ensure mock fallback if the external API is slow
      const response = await axios.get("https://zeroauthoritydao.com/api/v1/bounties", { timeout: 3000 });
      if (response.data && Array.isArray(response.data)) {
        // Transform real data to our format if needed
        const realOps = response.data.map((b: any) => ({
          id: `zap-${b.id || Math.random()}`,
          title: b.title || "Untitled Opportunity",
          type: "bounty",
          dao: "ZeroAuth",
          reward: b.reward || 0,
          tags: b.tags || ["General"],
          status: b.status || "open",
          deadline: b.deadline || "TBD",
          activityScore: Math.floor(Math.random() * 40) + 60,
          sourceUrl: `https://zeroauthoritydao.com/bounty/${b.id}`
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
    } catch (e: any) {
      res.status(e.response?.status || 500).json({ error: e.message });
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
