# ZA Scout - DAO Intelligence Platform

ZA Scout is a premium, fully responsive dashboard designed for the Zero Authority DAO ecosystem. It serves as a centralized intelligence hub to help contributors discover and track high-impact Web3 bounties, grants, gigs, and quests, empowered by Google Gemini AI insights and the Model Context Protocol (MCP).

## Key Features

- **Deep Discovery Explorer:** Real-time filtering for DAO opportunities based on reward amount, asset type (Bounty, Grant, Quest), and keyword tags, featuring custom detailed overlays for high-fidelity opportunities.
- **Ecosystem Events Calendar:** A fully responsive calendar hub featuring list grid and monthly schedules. Supports date-selection event triggers, highlighting active days, dynamic agendas, and client-side RSVP persistence using local storage.
- **Gemini AI Scout:** An integrated, intelligent Discovery Agent that analyzes conversational search queries to recommend live ecosystem matches, custom tailored skills, and matching reasons.
- **Model Context Protocol (MCP):** Standardized, ready-to-use configuration guide for connecting ZA Scout directly to developers' local AI engines (Claude Desktop, Cursor, Claude Code) for automated searching and proposal drafting.
- **Ambassador Quests Portal:** Structured progress trackers monitoring public community milestones, Discord contributions, and code submissions, detailed with contribution modals containing live linking states.
- **Refined Mobile Layout:** Streamlined mobile navigation and dashboard interfaces designed to prevent blocking states, incorporating sleek overlay transitions, custom close indicators, and mobile-responsive action bars.
- **Dynamic Theming:** Seamless support for Dark (Midnight OLED) and Light (High-contrast slate) views with instant system responsiveness.

## Tech Stack

- **Backend:** Node.js, Express, TypeScript (executed via `tsx` in development)
- **Templating:** EJS (Embedded JavaScript) with dynamic server-side rendering
- **AI Engine:** Google Gemini (via `@google/genai` modern SDK)
- **Styling & Assets:** Tailwind CSS, Lucide Icons, responsive container layouts
- **Build System:** esbuild for automated server bundling and minification
- **Security:** CSRF protection, Helmet middleware, and request limit controls

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- A Google Gemini API Key

### Installation & Run

1. **Clone and Install:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file at the root level and provide your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Development Mode:**
   ```bash
   npm run dev
   ```
   Access the platform at `http://localhost:3000`.

## MCP Integration

ZA Scout exposes a standardized Model Context Protocol interface. Contributors can empower their local AI agents by adding the following to their `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "zero-authority": {
      "command": "npx",
      "args": ["-y", "@zeroauthority/mcp-server"],
      "env": {
        "ZA_API_KEY": "YOUR_ZA_ACCESS_KEY"
      }
    }
  }
}
```

## Production Deployment

The project uses a specialized build pipeline:
-   `npm run build`: Bundles `server.ts` into a standalone `dist/server.cjs` using esbuild.
-   `npm run start`: Runs the production-optimized CommonJS server.

## License

This project is licensed under the MIT License.
