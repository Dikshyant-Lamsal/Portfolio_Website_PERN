# PERN Portfolio — Foundation Setup

A beginner-friendly full-stack portfolio built with **PostgreSQL · Express · React · Node**.

```
pern-portfolio/
├── client/                   ← React + Vite frontend
│   ├── index.html            ← Vite HTML entry point
│   ├── vite.config.js        ← Vite config + dev proxy
│   ├── package.json
│   └── src/
│       ├── main.jsx          ← React root mount
│       ├── App.jsx           ← App shell + theme toggle + API fetch
│       └── index.css         ← CSS variables, dark/light themes, global styles
│
└── server/                   ← Express + Node.js backend
    ├── server.js             ← Express app entry point
    ├── package.json
    ├── .env.example          ← Template — copy to .env and fill in values
    └── config/
        └── db.js             ← PostgreSQL pool (pg package)
```

---

## Quick Start

### 1. Clone / enter the project

```bash
cd pern-portfolio
```

### 2. Set up the backend

```bash
cd server
npm install

# Create your .env from the template
cp .env.example .env
# Then open .env and paste in your Neon DATABASE_URL
```

### 3. Set up the frontend

```bash
cd ../client
npm install
```

---

## Run in Development

Open **two terminals**:

**Terminal 1 — Backend**
```bash
cd server
npm run dev        # nodemon watches for changes → http://localhost:5000
```

**Terminal 2 — Frontend**
```bash
cd client
npm run dev        # Vite dev server → http://localhost:5173
```

Visit [http://localhost:5173](http://localhost:5173).  
The status card should show **✓ Backend running** when Express is up.

---

## API Routes

| Method | Path        | Description          |
|--------|-------------|----------------------|
| GET    | /api/test   | Health check         |

---

## Environment Variables (server/.env)

| Key            | Description                              |
|----------------|------------------------------------------|
| `PORT`         | Express port (default 5000)              |
| `DATABASE_URL` | Neon PostgreSQL connection string        |
| `CORS_ORIGIN`  | Allowed frontend origin                  |
| `NODE_ENV`     | `development` or `production`            |

---

## Theme System

- **Default**: dark mode
- Toggle via the button in the top-right corner
- Theme is stored in React `useState`; applied as `data-theme` on `<html>`
- All colours are CSS variables — add new tokens in `index.css` under `:root`
- Transitions are smooth (0.35 s ease) across all colour properties

---

## Tech Stack

| Layer     | Technology              | Hosting  |
|-----------|-------------------------|----------|
| Frontend  | React 18 + Vite 5       | Vercel   |
| Backend   | Express 4 + Node 18+    | Render   |
| Database  | PostgreSQL (Neon)        | Neon     |

---

## Next Steps (not included in this foundation)

- Add database tables (`CREATE TABLE` migrations)
- Add portfolio section components (Projects, Skills, Contact)
- Add API routes for each section
- Configure Vercel + Render deployment