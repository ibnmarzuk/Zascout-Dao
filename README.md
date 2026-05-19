# ZA Scout - AI-Powered DAO Intelligence Platform

ZA Scout is a premium, responsive dashboard designed for the Zero Authority DAO ecosystem. It serves as a centralized intelligence hub to help contributors discover and track high-impact bounties, grants, and quests, empowered by Gemini 3.1 AI insights and the Model Context Protocol (MCP).

## Key Features

-   **Deep Discovery Explorer:** Real-time filtering for DAO opportunities based on reward amount, asset type (Bounty, Grant, Quest), and keyword tags. Featuring **high-fidelity detail overlays** for every opportunity.
-   **Gemini AI Insights:** A dedicated Discovery Agent that analyzes search queries to suggest relevant DAOs, specific skill requirements, and high-level opportunity summaries.
-   **Model Context Protocol (MCP):** Full configuration guide for connecting ZA Scout directly to AI assistants like Claude Desktop, Cursor, and Claude Code for automated bounty drafting and searching.
-   **Ambassador Quests:** A dedicated mission system to track community engagement, Discord participation, and technical contributions. Featuring **dynamic multi-step progress indicators**, detailed mission modals with contribution links, and XP rewards.
-   **Premium Visual System:** A bento-grid based interface featuring glassmorphism, fluid animations (Framer Motion style via Tailwind), and zero-emoji professional branding.
-   **Dynamic Theming:** Native support for both Dark (OLED midnight) and Light (High-contrast slate) modes with smooth transitions.

## Tech Stack

-   **Backend:** Node.js, Express, TypeScript (run via `tsx`)
-   **Templating:** EJS (Embedded JavaScript) with dynamic server-side rendering
-   **AI Engine:** Google Gemini 3.1 (via @google/genai)
-   **Styling:** Tailwind CSS 4.0, Lucide Icons
-   **Build System:** esbuild for lightning-fast server bundling
-   **Security:** Helmet.js, CSRF protection, and adaptive rate limiting

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [npm](https://www.npmjs.com/)
-   A Google Gemini API Key

### Installation & Run

1.  **Clone and Install:**
    ```bash
    npm install
    ```

2.  **Environment Setup:**
    Create a `.env` file and provide your Gemini API key:
    ```env
    GEMINI_API_KEY=your_gemini_api_key
    ```

3.  **Development Mode:**
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
