// server/config/db.js
// Creates and exports a PostgreSQL connection pool using the `pg` package.
// All credentials are read from environment variables — never hardcoded.

const { Pool } = require('pg')

// Pool automatically reuses connections, which is ideal for web servers.
// The connection string format is:
//   postgresql://<user>:<password>@<host>:<port>/<database>
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Required for Neon PostgreSQL (and most hosted PG providers):
  // SSL must be enabled, but self-signed certs are accepted.
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
})

// Test the connection on startup so you know immediately if the DB is reachable
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ PostgreSQL connection error:', err.message)
  } else {
    console.log('✅ PostgreSQL connected')
    release() // return the client back to the pool
  }
})

module.exports = pool