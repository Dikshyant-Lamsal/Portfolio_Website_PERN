// server/scripts/seedProfile.js
// ─────────────────────────────────────────────────────────────────────────────
// ONE-TIME SETUP SCRIPT — run this once to:
//   1. Create the `profile` table in your PostgreSQL database
//   2. Insert the single profile row pre-filled with your current info
//
// Usage (from the server/ directory):
//   node scripts/seedProfile.js
//
// Safe to re-run — skips insert if a row already exists.
// Edit the PROFILE object below before running if you want different defaults.
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config()
const pool = require('../config/db')

// ── Default profile data ───────────────────────────────────────────────────
// Pre-filled with the values currently hardcoded in your components.
// Change anything here before running the script.
const PROFILE = {
    full_name: 'Dikshyant Lamsal',
    role_title: 'Full-Stack Developer',
    hero_subtitle: 'I build clean, performant web applications using the PERN stack — React on the front, Node & Express on the back, PostgreSQL underneath. Focused on readable code and great user experiences.',
    about_text: "Hi, I'm Dikshyant Lamsal — a Full Stack Developer and AI/ML student based in India. I'm passionate about building scalable, clean web applications and exploring the intersection of modern web systems and artificial intelligence.\n\nMy primary focus is full-stack development using the PERN and MERN stacks, while simultaneously deepening my understanding of machine learning concepts through my engineering degree. I enjoy writing readable, maintainable code and designing user experiences that feel effortless.\n\nWhen I'm not coding, I'm exploring new tools, contributing to projects, or working through algorithmic challenges. I believe in learning by building — every project is a chance to grow.",
    github_url: 'https://github.com/Dikshyant-Lamsal',
    linkedin_url: 'https://linkedin.com/in/dikshyant-lamsal-1bb85139a/',
    leetcode_url: '',
    email: 'dikshyant01@gmail.com',
    resume_url: '',
    profile_image_url: '',
    location: 'India',
    availability_status: 'Open to opportunities',
}

async function seed() {
    try {
        // ── Step 1: Create the profile table ─────────────────────────────────────
        await pool.query(`
      CREATE TABLE IF NOT EXISTS profile (
        id                 SERIAL PRIMARY KEY,
        full_name          VARCHAR(100)  NOT NULL DEFAULT '',
        role_title         VARCHAR(100)  NOT NULL DEFAULT '',
        hero_subtitle      TEXT                   DEFAULT '',
        about_text         TEXT                   DEFAULT '',
        github_url         VARCHAR(255)           DEFAULT '',
        linkedin_url       VARCHAR(255)           DEFAULT '',
        leetcode_url       VARCHAR(255)           DEFAULT '',
        email              VARCHAR(255)           DEFAULT '',
        resume_url         VARCHAR(255)           DEFAULT '',
        profile_image_url  VARCHAR(255)           DEFAULT '',
        location           VARCHAR(100)           DEFAULT '',
        availability_status VARCHAR(100)          DEFAULT '',
        updated_at         TIMESTAMPTZ            DEFAULT NOW()
      )
    `)
        console.log('✅ profile table ready')

        // ── Step 2: Check if a row already exists ─────────────────────────────────
        const existing = await pool.query('SELECT id FROM profile LIMIT 1')
        if (existing.rows.length > 0) {
            console.log('ℹ️  Profile row already exists — skipping insert.')
            process.exit(0)
        }

        // ── Step 3: Insert the single profile row ─────────────────────────────────
        await pool.query(`
      INSERT INTO profile (
        full_name, role_title, hero_subtitle, about_text,
        github_url, linkedin_url, leetcode_url, email,
        resume_url, profile_image_url, location, availability_status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    `, [
            PROFILE.full_name,
            PROFILE.role_title,
            PROFILE.hero_subtitle,
            PROFILE.about_text,
            PROFILE.github_url,
            PROFILE.linkedin_url,
            PROFILE.leetcode_url,
            PROFILE.email,
            PROFILE.resume_url,
            PROFILE.profile_image_url,
            PROFILE.location,
            PROFILE.availability_status,
        ])

        console.log('✅ Profile row created successfully')
        console.log('   You can now edit your profile from the admin dashboard.')

    } catch (err) {
        console.error('❌ Seed failed:', err.message)
        process.exit(1)
    } finally {
        await pool.end()
    }
}

seed()