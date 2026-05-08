# Webpage Link Scrapper (PricePulse)

A full-stack app to search webpage products, store product history, run AI analysis, and export results in multiple formats.

## Highlights

- Modern dashboard UI built with React + Vite + Tailwind CSS.
- Express + TypeScript backend with SQLite persistence.
- AI integration via Exa and OpenRouter APIs.
- Product history tracking and dashboard statistics.
- Export support through dedicated API endpoints.

## Tech Stack

**Frontend (`client`)**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Query
- Axios

**Backend (`server`)**
- Node.js + Express
- TypeScript
- better-sqlite3
- dotenv
- exa-js
- openai (OpenRouter-compatible usage)

## Project Structure

```text
Shopee-Link-Scrapper/
|- client/                 # Frontend (Vite + React + Tailwind)
|- server/                 # Backend API (Express + SQLite)
|  |- data/                # SQLite database files
|  |- src/
|     |- controllers/      # Route handlers
|     |- db/               # DB initialization and access
|     |- middleware/       # Auth/error middleware
|     |- routes/           # API route groups
|- .gitignore
|- README.md
```

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm 9+

## Environment Setup

1. Create the backend env file:

```bash
cp server/.env.example server/.env
```

2. Fill `server/.env`:

```env
PORT=4000
EXA_API_KEY=your-exa-api-key-here
OPENROUTER_API_KEY=your-openrouter-api-key-here
NODE_ENV=development
```

## Installation

Install dependencies for both apps:

```bash
cd client && npm install
cd ../server && npm install
```

## Run Locally

Open two terminals.

**Terminal 1: backend**

```bash
cd server
npm run dev
```

Backend runs on `http://localhost:4000`.

**Terminal 2: frontend**

```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:3000`.

The frontend proxies `/api` requests to `http://localhost:4000`.

## Available Scripts

**Frontend (`client`)**
- `npm run dev` - Start Vite dev server.
- `npm run build` - Type-check and build for production.
- `npm run preview` - Preview production build.
- `npm run lint` - Run ESLint.

**Backend (`server`)**
- `npm run dev` - Run server with `tsx watch`.
- `npm run build` - Compile TypeScript to `dist`.
- `npm run start` - Start compiled server from `dist`.

## API Overview

Base URL: `http://localhost:4000/api`

- `POST /search` - Search products from a Shopee link/query.
- `GET /search/products` - Get recent products.
- `GET /search/products/:id` - Get product details.
- `POST /search/products/:id/analyze` - Run AI analysis for a product.
- `GET /dashboard/stats` - Get dashboard statistics.
- `GET /history` - Get search history.
- `DELETE /history/:id` - Delete one history record.
- `GET /settings/keys` - Check key status.
- `POST /settings/keys` - Save/update keys.
- `POST /settings/keys/test` - Validate API keys.
- `GET /export/:format` - Export data.

## Production Build

```bash
# frontend
cd client && npm run build

# backend
cd ../server && npm run build && npm run start
```

## Notes

- Keep `server/.env` private and never commit real API keys.
- SQLite data files are generated under `server/data`.
- Use the provided `.gitignore` to avoid committing generated files.
