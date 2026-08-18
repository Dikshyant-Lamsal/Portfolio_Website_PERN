// server/scripts/seedProfile.js
// Run once to insert/update the single profile row with current data.
// Usage: node server/scripts/seedProfile.js
//
// Uses an upsert: inserts if no row exists, updates if one does.

require('dotenv').config()
const pool = require('../config/db')

const profile = {
    full_name: 'Dikshyant Lamsal',
    role_title: 'Full Stack Developer & Machine Learning Engineer',
    hero_subtitle: 'Motivated Full Stack Developer and Machine Learning Engineer passionate about building efficient, user-focused, and scalable web applications. Skilled in modern JavaScript technologies, backend systems, cloud deployment, machine learning workflows, and data engineering.',
    about_text: "Hi, I'm Dikshyant Lamsal — a Full Stack Developer and Machine Learning Engineer based in Bengaluru, India.\n\nI'm currently pursuing a Bachelor of Engineering in Artificial Intelligence & Machine Learning at CMR Institute of Technology (CGPA: 9.00). I'm passionate about building scalable web applications and exploring AI/ML systems.\n\nMy experience spans full-stack development with the PERN stack, desktop application development with Electron, blockchain projects on the Internet Computer Protocol, and data engineering with Snowflake. I'm eager to contribute to real-world development environments while continuously expanding my technical expertise.",
    github_url: 'https://github.com/Dikshyant-Lamsal',
    linkedin_url: 'https://linkedin.com/in/dikshyant-lamsal-1bb85139a',
    leetcode_url: 'https://leetcode.com/u/2mLmP6f91r',
    email: 'dikshyant2005@gmail.com',
    resume_url: '',
    profile_image_url: '',
    location: 'Marathalli, Bengaluru 560037',
    availability_status: 'Open to opportunities',
}

async function seed() {
    try {
        // Check if a profile row already exists
        const existing = await pool.query('SELECT id FROM profile LIMIT 1')

        if (existing.rows.length === 0) {
            // No row yet — INSERT
            await pool.query(`
        INSERT INTO profile (
          full_name, role_title, hero_subtitle, about_text,
          github_url, linkedin_url, leetcode_url, email,
          resume_url, profile_image_url, location, availability_status
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      `, [
                profile.full_name, profile.role_title, profile.hero_subtitle, profile.about_text,
                profile.github_url, profile.linkedin_url, profile.leetcode_url, profile.email,
                profile.resume_url, profile.profile_image_url, profile.location, profile.availability_status,
            ])
            console.log('✅ Profile row inserted.')
        } else {
            // Row exists — UPDATE
            await pool.query(`
        UPDATE profile SET
          full_name           = $1,
          role_title          = $2,
          hero_subtitle       = $3,
          about_text          = $4,
          github_url          = $5,
          linkedin_url        = $6,
          leetcode_url        = $7,
          email               = $8,
          resume_url          = $9,
          profile_image_url   = $10,
          location            = $11,
          availability_status = $12,
          updated_at          = NOW()
        WHERE id = (SELECT id FROM profile LIMIT 1)
      `, [
                profile.full_name, profile.role_title, profile.hero_subtitle, profile.about_text,
                profile.github_url, profile.linkedin_url, profile.leetcode_url, profile.email,
                profile.resume_url, profile.profile_image_url, profile.location, profile.availability_status,
            ])
            console.log('✅ Profile row updated.')
        }
    } catch (err) {
        console.error('❌ Seed error:', err.message)
    } finally {
        await pool.end()
    }
}

seed()