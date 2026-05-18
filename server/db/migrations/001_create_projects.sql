-- server/db/migrations/001_create_projects.sql
-- Run this once in your Neon SQL editor (or psql) to create the projects table.
-- Neon dashboard → SQL Editor → paste → Run

CREATE TABLE IF NOT EXISTS projects (
    id           SERIAL PRIMARY KEY,
    title        VARCHAR(100)       NOT NULL,
    description  TEXT               NOT NULL,
    tech_stack   TEXT[],            -- PostgreSQL native array, e.g. '{"React","Node","PostgreSQL"}'
    github_link  TEXT,
    live_link    TEXT,
    image_url    TEXT,
    featured     BOOLEAN            DEFAULT false,
    created_at   TIMESTAMP          DEFAULT CURRENT_TIMESTAMP
);

-- ── Optional: seed a sample project so the frontend has something to show ──
INSERT INTO projects (title, description, tech_stack, github_link, live_link, featured)
VALUES (
  'PERN Portfolio',
  'A full-stack developer portfolio built with PostgreSQL, Express, React, and Node.js.',
  ARRAY['React', 'Node.js', 'Express', 'PostgreSQL'],
  'https://github.com/yourname/pern-portfolio',
  NULL,
  true
)
ON CONFLICT DO NOTHING;