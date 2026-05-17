import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

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
        Based on this, return a list of recommended DAO opportunity types (grants, bounties, proposals), 
        suggested keywords for filtering, and a brief summary of why these are relevant to the user in the context of the Zero Authority ecosystem.
        Response in JSON: { "recommendations": string[], "keywords": string[], "summary": string }`,
        config: {
          responseMimeType: "application/json"
        }
      });
      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Mock DAO Data Service (Simulating Zero Authority API)
  app.get("/api/dao/opportunities", (req, res) => {
    // In a real app, this would call Zero Authority API
    const mocks = [
      { id: "1", title: "AI Tooling Grant", type: "grant", dao: "ZeroAuth", reward: "$5000", tags: ["AI", "Infra"], status: "active", deadline: "2024-12-01", activityScore: 92, sourceUrl: "#" },
      { id: "2", title: "Governance Dashboard Bounty", type: "bounty", dao: "DeveloperDAO", reward: "$1200", tags: ["Frontend", "React"], status: "open", deadline: "2024-11-15", activityScore: 78, sourceUrl: "#" },
      { id: "3", title: "ZKP Research Proposal", type: "proposal", dao: "PrivacyDAO", reward: "N/A", tags: ["ZKP", "Research"], status: "voting", deadline: "2024-11-05", activityScore: 85, sourceUrl: "#" },
      { id: "4", title: "Community Management Grant", type: "grant", dao: "SocialDAO", reward: "$3000", tags: ["Community", "Ops"], status: "active", deadline: "2024-12-30", activityScore: 64, sourceUrl: "#" },
      { id: "5", title: "Solidity Security Audit", type: "bounty", dao: "ZeroAuth", reward: "$2500", tags: ["Security", "Solidity"], status: "open", deadline: "2024-11-20", activityScore: 88, sourceUrl: "#" },
    ];
    res.json(mocks);
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
