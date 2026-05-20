# Dikshyant Lamsal — PERN Portfolio

Personal portfolio website for **Dikshyant Lamsal**, Full Stack Developer & Machine Learning Engineer.

Live at: [portfolio-website-pern.vercel.app](https://portfolio-website-pern.vercel.app)

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 18 + Vite 5                   |
| Backend     | Express 4 + Node.js                 |
| Database    | PostgreSQL (Neon)                   |
| Images      | Cloudinary                          |
| Frontend    | Vercel                              |
| Backend     | Render                              |

---

## Features

### Public Portfolio
- Dynamic Hero section (name, role, bio, resume link from DB)
- About section with profile CMS data
- Education timeline (BE AIML, Grade 12, Grade 10)
- Experience section (internships)
- Skills grid
- Projects grid (CRUD-managed via admin)
- Certifications grid
- Contact form with PostgreSQL storage
- Light / dark theme toggle
- Fully responsive layout
- Hash-based routing (no react-router)

### Admin Dashboard (`/#/admin`)
- JWT authentication (login / logout)
- Profile CMS — edit name, bio, links, resume URL, availability
- Project CRUD — create, edit, delete, Cloudinary image upload
- Contact message management — view and delete submissions
- Reply via Email button (mailto prefilled)
- Email notification on new contact submission (Nodemailer + Gmail SMTP)

---

## Project Structure

```text
pern-portfolio/
├── client/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── config/
│       │   └── api.js               # centralized API base URL
│       ├── hooks/
│       │   ├── useProfile.js
│       │   └── useProjects.js
│       ├── pages/
│       │   ├── Admin.jsx
│       │   ├── Admin.css
│       │   ├── Login.jsx
│       │   └── Login.css
│       └── components/
│           ├── Navbar.jsx / .css
│           ├── Hero.jsx / .css
│           ├── About.jsx / .css
│           ├── Education.jsx / .css
│           ├── Experience.jsx / .css
│           ├── Skills.jsx / .css
│           ├── Projects.jsx / .css
│           ├── Certifications.jsx / .css
│           ├── Contact.jsx / .css
│           ├── ProfileForm.jsx / .css
│           ├── ProjectForm.jsx / .css
│           ├── ProjectList.jsx / .css
│           ├── ProjectItem.jsx / .css
│           └── MessageList.jsx / .css
│
├── server/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/
│   │   ├── db.js                    # PostgreSQL pool (Neon)
│   │   └── cloudinary.js
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   └── upload.js                # Multer for Cloudinary
│   ├── routes/
│   │   ├── auth.js                  # POST /api/auth/login
│   │   ├── profile.js               # GET + PUT /api/profile
│   │   ├── projects.js              # CRUD /api/projects
│   │   ├── contact.js               # POST + GET + DELETE /api/contact
│   │   └── upload.js                # POST /api/upload
│   ├── utils/
│   │   └── sendMail.js              # Nodemailer Gmail notification
│   └── scripts/
│       ├── seedAdmin.js
│       └── seedProfile.js
│
└── README.md
```

---

## Local Setup

### 1. Clone

```bash
git clone <your-repo-url>
cd pern-portfolio
```

### 2. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
DATABASE_URL=your_neon_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

# Cloudinary (for project image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email notifications (Gmail App Password — NOT your Gmail login password)
# Generate at: https://myaccount.google.com/apppasswords
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
```

Seed the database:

```bash
node scripts/seedAdmin.js    # creates the admin user
node scripts/seedProfile.js  # seeds profile data
```

Start the backend:

```bash
npm run dev
```

Runs on: `http://localhost:5000`

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

Runs on: `http://localhost:5173`

The Vite dev proxy (`vite.config.js`) forwards all `/api/*` requests to port 5000 automatically.

---

## API Routes

| Method | Route                  | Auth     | Description                        |
|--------|------------------------|----------|------------------------------------|
| POST   | /api/auth/login        | Public   | Admin login — returns JWT          |
| GET    | /api/profile           | Public   | Fetch profile (Hero, About, etc.)  |
| PUT    | /api/profile           | Admin    | Update profile fields              |
| GET    | /api/projects          | Public   | Fetch all projects                 |
| POST   | /api/projects          | Admin    | Create a project                   |
| PUT    | /api/projects/:id      | Admin    | Update a project                   |
| DELETE | /api/projects/:id      | Admin    | Delete a project                   |
| POST   | /api/contact           | Public   | Submit contact form                |
| GET    | /api/contact           | Admin    | View all contact messages          |
| DELETE | /api/contact/:id       | Admin    | Delete a contact message           |
| POST   | /api/upload            | Admin    | Upload image to Cloudinary         |

---

## Environment Variables

### Backend (`server/.env`)

| Variable                | Description                                      |
|-------------------------|--------------------------------------------------|
| `PORT`                  | Express server port (default 5000)               |
| `DATABASE_URL`          | Neon PostgreSQL connection string                |
| `JWT_SECRET`            | Secret key for signing JWTs                      |
| `CORS_ORIGIN`           | Allowed frontend origin                          |
| `NODE_ENV`              | `development` or `production`                    |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                            |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                               |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                            |
| `EMAIL_USER`            | Gmail address for sending notifications          |
| `EMAIL_PASS`            | Gmail App Password (not login password)          |

### Frontend (`client/.env` or Vercel dashboard)

| Variable        | Description                        |
|-----------------|------------------------------------|
| `VITE_API_URL`  | Backend URL (e.g. Render URL)      |

---

## Deployment

| Service   | Platform | URL                                              |
|-----------|----------|--------------------------------------------------|
| Frontend  | Vercel   | https://portfolio-website-pern.vercel.app        |
| Backend   | Render   | https://portfolio-website-pern.onrender.com      |
| Database  | Neon     | Managed PostgreSQL                               |
| Images    | Cloudinary | Managed image hosting                          |

### Deploy checklist

**Render (backend):**
- Add all `server/.env` variables in Render dashboard → Environment
- Build command: `npm install`
- Start command: `node server.js`

**Vercel (frontend):**
- Add `VITE_API_URL=https://portfolio-website-pern.onrender.com` in Vercel dashboard → Settings → Environment Variables
- Build command: `npm run build`
- Output directory: `dist`

---

## Admin Access

Navigate to `/#/admin` — you'll be redirected to `/#/login`.

Default credentials are set via `node scripts/seedAdmin.js`.  
Change the password in that script before running it in production.

---

## Gmail App Password Setup

Required for contact form email notifications:

1. Enable 2-Step Verification on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Create an app password for "Mail"
4. Copy the 16-character password into `EMAIL_PASS`

If `EMAIL_USER` or `EMAIL_PASS` are not set, email notifications are skipped silently — the contact form still works.