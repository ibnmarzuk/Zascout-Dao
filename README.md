# ZA Scout - AI-Powered DAO Intelligence Platform

ZA Scout is a modern, responsive web application designed to help contributors navigate the vast DAO landscape. It aggregates signals from across the ecosystem to surface grants, bounties, and governance opportunities, enhanced by AI-driven filtering and analysis.

## 🚀 Features

-   **Intelligent Exploration:** Search through a curated database of DAO opportunities using AI-powered natural language queries.
-   **Contributor Intelligence:** Analyze reputation, participation history, and ecosystem signals for DAO contributors.
-   **Ecosystem Analytics:** Live visualization of funding volumes, sector distribution, and participant growth.
-   **Saved Opportunities:** Bookmark and track your favorite grants and bounties.
-   **Responsive Design:** Fully optimized for mobile, tablet, and desktop experiences.
-   **Dark/Light Mode:** Seamlessly switch between themes to suit your preference.

## 🛠️ Tech Stack

-   **Frontend:** React 18+, TypeScript, Vite
-   **Styling:** Tailwind CSS, Lucide React (Icons), Motion (Animations)
-   **AI Integration:** Gemini API (via server-side proxy)
-   **Charts:** Recharts
-   **State Management:** React Hooks & Context API

## 🏁 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <https://github.com/ibnmarzuk/Zascout-Dao>
    cd zascout
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add your Gemini API key:
    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    ```
    *Note: See `.env.example` for the required structure.*

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 🏗️ Building for Production

To create a production build, run:
```bash
npm run build
```
This will generate a `dist/` directory containing the bundled application and a compiled server in `dist/server.cjs`.

To start the production server:
```bash
npm run start
```

## 📄 License

This project is licensed under the MIT License.
