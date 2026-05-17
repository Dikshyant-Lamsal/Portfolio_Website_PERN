// server/routes/projects.js
// All API routes for the `projects` table.
// Mounted in server.js at /api/projects

const express = require('express')
const router  = express.Router()
const pool    = require('../config/db') // shared connection pool

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/projects
// Returns all projects, newest first.
// Optional query param: ?featured=true → only featured projects
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query

    // Build query dynamically based on ?featured param
    const query = featured === 'true'
      ? 'SELECT * FROM projects WHERE featured = true ORDER BY created_at DESC'
      : 'SELECT * FROM projects ORDER BY created_at DESC'

    const result = await pool.query(query)
    res.json(result.rows)            // rows is an array of project objects
  } catch (err) {
    console.error('GET /api/projects error:', err.message)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/projects/:id
// Returns a single project by its primary key.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'SELECT * FROM projects WHERE id = $1',
      [id]   // $1 is a parameterised placeholder — safe from SQL injection
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error('GET /api/projects/:id error:', err.message)
    res.status(500).json({ error: 'Failed to fetch project' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/projects
// Creates a new project. All fields from req.body.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      tech_stack,   // expect an array: ["React", "Node"]
      github_link,
      live_link,
      image_url,
      featured,
    } = req.body

    // Basic validation
    if (!title || !description) {
      return res.status(400).json({ error: 'title and description are required' })
    }

    const result = await pool.query(
      `INSERT INTO projects
         (title, description, tech_stack, github_link, live_link, image_url, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,          // RETURNING * gives back the newly created row
      [title, description, tech_stack, github_link, live_link, image_url, featured ?? false]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('POST /api/projects error:', err.message)
    res.status(500).json({ error: 'Failed to create project' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/projects/:id
// Updates every field of an existing project (full replace).
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const {
      title, description, tech_stack,
      github_link, live_link, image_url, featured,
    } = req.body

    const result = await pool.query(
      `UPDATE projects
       SET title = $1, description = $2, tech_stack = $3,
           github_link = $4, live_link = $5, image_url = $6, featured = $7
       WHERE id = $8
       RETURNING *`,
      [title, description, tech_stack, github_link, live_link, image_url, featured, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error('PUT /api/projects/:id error:', err.message)
    res.status(500).json({ error: 'Failed to update project' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/projects/:id
// Removes a project permanently.
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 RETURNING id',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' })
    }

    res.json({ message: `Project ${id} deleted` })
  } catch (err) {
    console.error('DELETE /api/projects/:id error:', err.message)
    res.status(500).json({ error: 'Failed to delete project' })
  }
})

module.exports = router