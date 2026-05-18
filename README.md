# PERN Portfolio

Full-stack developer portfolio built using:

- React + Vite
- Express + Node.js
- PostgreSQL (Neon)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Express + Node.js |
| Database | PostgreSQL |
| Hosting | Vercel + Render + Neon |

---

## Project Structure

```text
pern-portfolio/
├── client/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## Local Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd pern-portfolio
```

---

## Backend Setup

```bash
cd server
npm install
```

Create:

```text
server/.env
```

Add:

```env
PORT=5000
DATABASE_URL=your_neon_database_url
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Run backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

## Frontend Setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Features

- Responsive layout
- Dark/light theme toggle
- React frontend
- Express backend API
- PostgreSQL database integration
- REST API architecture
- Modern developer portfolio structure

---

## Environment Variables

| Variable | Description |
|---|---|
| PORT | Express server port |
| DATABASE_URL | Neon PostgreSQL connection string |
| CORS_ORIGIN | Allowed frontend URL |
| NODE_ENV | development / production |

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | /api/test | Backend health check |

---

## Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon |