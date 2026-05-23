import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { google } from "googleapis";
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
      // Attempt to hit ZA Scout API
      const response = await axios.get("https://zeroauthoritydao.com/api/v1/bounties", { timeout: 3000 });
      if (response.data && Array.isArray(response.data)) {
        opportunities = response.data.map((b: Record<string, unknown>) => ({
          id: b.id || crypto.randomUUID(),
          title: b.title || "Untitled Opportunity",
          type: "bounty",
          dao: "ZA Scout",
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
        { id: "zap-7", title: "Core Protocol V2 Development", type: "grant", dao: "ZA Scout", reward: 15000, tags: ["Dev", "Architecture"], status: "active" },
        { id: "zap-8", title: "Community Management Tooling", type: "grant", dao: "Optimism", reward: 5000, tags: ["Dev", "Social"], status: "open" },
        { id: "zap-9", title: "DeFi Research Dashboard", type: "grant", dao: "Aave Grants", reward: 8000, tags: ["Dev", "Design", "Data"], status: "open" },
        { id: "zap-10", title: "Write a deep dive on account abstraction", type: "quest", dao: "ZA Scout", reward: 100, tags: ["Writing"], status: "open" },
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

  app.get('/bounties', csrfProtection, (req, res) => {
    res.render('quests', { csrfToken: (req as any).csrfToken() }); // Reuse quests template for bounties explorer
  });

  app.get('/gigs', csrfProtection, (req, res) => {
    res.render('gigs', { csrfToken: (req as any).csrfToken() });
  });

  app.get('/grants', csrfProtection, (req, res) => {
    res.render('grants', { csrfToken: (req as any).csrfToken() });
  });

  app.get('/events', csrfProtection, (req, res) => {
    res.render('events', { csrfToken: (req as any).csrfToken() });
  });

  app.get('/ai-scout', csrfProtection, (req, res) => {
    res.render('ai-scout', { csrfToken: (req as any).csrfToken() });
  });

  app.get('/opportunities', csrfProtection, (req, res) => {
    // For now, redirect or render bounties as opportunities
    res.redirect('/bounties');
  });

  app.get('/reputation', csrfProtection, (req, res) => {
    // Simple inline render for reputation placeholder
    res.render('index', { 
      opportunities: [], 
      csrfToken: (req as any).csrfToken(),
      activePage: 'reputation' 
    });
  });

  app.get('/mcp', csrfProtection, (req, res) => {
    res.render('mcp', { csrfToken: (req as any).csrfToken() });
  });

  // Google Docs Integration
  app.get("/api/docs/list", async (req, res) => {
    // Placeholder for Google Docs integration.
    // OAuth token needs to be retrieved from user session
    res.json({ message: "Google Docs integration ready." });
  });

  if (process.env.NODE_ENV !== "production") {
    import("vite").then(async ({ createServer: createViteServer }) => {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "custom",
      });
      app.use(vite.middlewares);
    });
  } else {
    app.use(express.static(path.join(process.cwd(), "dist/client")));
  }

  // Gemini AI Discovery Agent
  app.post("/api/ai/discover", csrfProtection, async (req, res) => {
    try {
      const { query } = req.body;
      const ECOSYSTEM_BOUNTIES = [
        { id: "zap-1", title: "Smart contract audit", type: "Bounty", dao: "Compound DAO", reward: "$800", tags: ["Dev", "Auditing"], description: "Evaluate and audit smart contract codebase for vulnerabilities, reentrancy issues, storage leaks, and protocol logic correctness to ensure absolute settlement security." },
        { id: "zap-2", title: "Frontend integration", type: "Bounty", dao: "Aave Grants", reward: "$400", tags: ["Dev", "Web3 UI"], description: "Connect the newly deployed collateral risk protocol UI dashboard with mainnet and testnet client ethers/viem providers. Optimize responsive render latency." },
        { id: "zap-3", title: "Governance explainer", type: "Bounty", dao: "ENS DAO", reward: "$200", tags: ["Content", "Marketing"], description: "Create a highly engaging educational video overview or comprehensive graphics carousel explaining ENS DAO delegation voting weight parameters." },
        { id: "zap-4", title: "Thread on L2 scaling", type: "Bounty", dao: "Arbitrum DAO", reward: "$150", tags: ["Content", "Social"], description: "Draft a high-quality, comprehensive analysis thread explaining Arbitrum Nitro performance enhancements, sequencer limits, and batch compression systems." },
        { id: "zap-5", title: "Brand identity refresh", type: "Bounty", dao: "Nouns DAO", reward: "$600", tags: ["Design", "Art"], description: "Develop unique vector visual identity assets including high-fidelity banner templates, color guidelines, and media kits suited for public marketing." },
        { id: "zap-6", title: "Tokenomics analysis", type: "Bounty", dao: "Optimism", reward: "$500", tags: ["Research", "DeFi"], description: "Analyze weekly liquid velocity, token release emissions, liquidity incentives models, and deliver comprehensive analytical spreadsheets & PDF summaries." },
        { id: "zap-7", title: "Core Protocol V2 Development", type: "Grant", dao: "ZA Scout", reward: "$15,000", tags: ["Dev", "Architecture"], description: "Full stack architectural upgrades to core protocol registries, handling decentralized multi-governance protocols and storage adapters securely." },
        { id: "zap-8", title: "Community Management Tooling", type: "Grant", dao: "Optimism", reward: "$5,000", tags: ["Dev", "Social"], description: "Create automated tools, bot relays, and analytics dashboards that bridge community discord, forums and active snapshot protocols." },
        { id: "zap-9", title: "DeFi Research Dashboard", type: "Grant", dao: "Aave Grants", reward: "$8,000", tags: ["Dev", "Design", "Data"], description: "Interactive dashboards presenting real-time asset utilization, borrow ratios, health metrics, and liquidations models with fully open-source React views." },
        { id: "zap-10", title: "Write deep dive on account abstraction", type: "Quest", dao: "ZA Scout", reward: "$100", tags: ["Writing"], description: "Compose an engaging technical article highlighting ERC-4337, paymasters, and user operations workflow targeted for native multi-sig developers." },
        { id: "zap-11", title: "Review 5 PRs in core repo", type: "Quest", dao: "Compound DAO", reward: "$300", tags: ["Dev", "Review"], description: "Help maintain Compound DAO security standards by evaluating, testing, and leaving clear code reviews on 5 active pull requests." },
        { id: "zap-12", title: "Participate in weekly dev call", type: "Quest", dao: "ENS DAO", reward: "$50", tags: ["Community"], description: "Attend the weekly call, engage in ongoing developer initiatives, and help outline milestones for upcoming naming protocol releases." },
        { id: "trending-1", title: "Develop MCP Submorphic Plugin", type: "Bounty", dao: "ZA Scout", reward: "$1,200", tags: ["Typescript", "Node.js"], description: "Design a sub-module protocol supporting dynamic schema registrations and model coordination endpoints following general MCP specifications." },
        { id: "trending-2", title: "Smart Contract Vault Audit", type: "Bounty", dao: "Compound DAO", reward: "$500", tags: ["Solidity", "Security"], description: "Perform gas optimizations and access state checks on nested multi-sig deposit storage vaults to eliminate withdrawal vectors." },
        { id: "trending-3", title: "Design UI Kit for Governance", type: "Bounty", dao: "ENS DAO", reward: "$300", tags: ["Design", "Figma"], description: "Create a visual system framework covering proposals lists, delegate weights, voting panels, and user profile fields with pixel-perfect responsive metrics." },
        { id: "gig-1", title: "Frontend Developer (React/Web3)", type: "Gig", dao: "Uniswap Labs", reward: "$3,000 - $5,000/mo", tags: ["Frontend", "React", "Ethers.js"], description: "Full-time support for the Web3 web interface, connecting liquidity pools, and drafting core components." },
        { id: "gig-2", title: "Technical Content Writer", type: "Gig", dao: "Arbitrum", reward: "$500 per article", tags: ["Writing", "Layer 2", "DeFi"], description: "Deliver deep technical articles explaining Rollup engineering, safety assumptions, and developer portals." },
        { id: "gig-3", title: "Smart Contract Auditor", type: "Gig", dao: "Aave", reward: "Up to $15k per audit", tags: ["Solidity", "Security"], description: "Comprehensive audit reviews of smart contract upgrades, liquidity vaults, and yield aggregation modules." },
        { id: "gig-4", title: "Community Manager", type: "Gig", dao: "Lens Protocol", reward: "$2,000/mo", tags: ["Social", "Discord", "Growth"], description: "Manage growing community groups, organize content calendars, and assist in moderation and support tickets." }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are ZA Scout AI, an expert DAO intelligence assistant. 
        The user is asking: "${query}". 
        
        Analyze this user query and match it with the best active opportunities from the ecosystem database:
        ${JSON.stringify(ECOSYSTEM_BOUNTIES, null, 2)}
        
        Select up to 4 closest matching opportunities. Format each match exactly with its real "id", "title", "type", "dao", "reward", "tags", and include a custom "matchReason" explaining why it matches the user's skills or desires.
        
        If the user's request is extremely broad, general, or doesn't have a perfect match in the database, select 1 or 2 similar database items, and you may ALSO generate 1 custom tailored reward opportunity (use ID starting with "scout-gen-" e.g. "scout-gen-1") with an appropriate title, DAO, reward, tags and matchReason to perfectly satisfy their search.
        
        Respond STRICTLY in JSON format without markdown wrapping, matching this exact schema: {
          "summary": "A friendly, professional 2-3 sentence explanation of the found matches and how they fit user's request.",
          "matches": [
            {
              "id": string,
              "title": string,
              "type": string,
              "dao": string,
              "reward": string,
              "tags": string[],
              "matchReason": string
            }
          ],
          "keywords": string[],
          "skills": string[]
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

  // ZA Scout Live Quests API
  app.get("/api/quests/fetched", async (req, res) => {
    try {
      const response = await axios.get("https://zeroauthoritydao.com/api/quest/all", {
        headers: {
          "Authorization": `Bearer za_1a77fc60f98dafd7993383ddacce5bc3769e4db86c53fca1df1d108344cf1244`
        },
        timeout: 5000
      });
      
      const allQuests = response.data?.data || [];
      
      // Pagination parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 3;
      
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      
      const paginatedQuests = allQuests.slice(startIndex, endIndex);
      
      res.json({
        success: true,
        data: paginatedQuests,
        pagination: {
          page,
          limit,
          totalItems: allQuests.length,
          totalPages: Math.ceil(allQuests.length / limit)
        }
      });
    } catch (error: any) {
      console.error("Error fetching quests from ZA Scout:", error.message);
      res.status(500).json({ success: false, error: error.message || "Unknown error" });
    }
  });

  // ZA Scout Events API
  app.get("/api/events/fetched", async (req, res) => {
    try {
      const response = await axios.get("https://zeroauthoritydao.com/api/events", {
        headers: { "Authorization": "Bearer za_1a77fc60f98dafd7993383ddacce5bc3769e4db86c53fca1df1d108344cf1244" },
        timeout: 5000
      });
      const items = response.data?.data || Array.isArray(response.data) ? response.data : [];
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const offset = (page - 1) * limit;
      res.json({
        success: true,
        data: items.slice(offset, offset + limit),
        pagination: { page, limit, totalItems: items.length, totalPages: Math.ceil(items.length / limit) }
      });
    } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
  });

  // ZA Scout Gigs API
  app.get("/api/gigs/fetched", async (req, res) => {
    try {
      const response = await axios.get("https://zeroauthoritydao.com/api/gigs", {
        headers: { "Authorization": "Bearer za_1a77fc60f98dafd7993383ddacce5bc3769e4db86c53fca1df1d108344cf1244" },
        timeout: 5000
      });
      const items = response.data?.data || Array.isArray(response.data) ? response.data : [];
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const offset = (page - 1) * limit;
      res.json({
        success: true,
        data: items.slice(offset, offset + limit),
        pagination: { page, limit, totalItems: items.length, totalPages: Math.ceil(items.length / limit) }
      });
    } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
  });

  // ZA Scout Grants API
  app.get("/api/grants/fetched", async (req, res) => {
    try {
      const response = await axios.get("https://zeroauthoritydao.com/api/grant", {
        headers: { "Authorization": "Bearer za_1a77fc60f98dafd7993383ddacce5bc3769e4db86c53fca1df1d108344cf1244" },
        timeout: 5000
      });
      const items = response.data?.data || Array.isArray(response.data) ? response.data : [];
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const offset = (page - 1) * limit;
      res.json({
        success: true,
        data: items.slice(offset, offset + limit),
        pagination: { page, limit, totalItems: items.length, totalPages: Math.ceil(items.length / limit) }
      });
    } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
  });

  // ZA Scout Bounties API
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
