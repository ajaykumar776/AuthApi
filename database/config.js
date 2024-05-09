const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER, // PostgreSQL username
  host: process.env.DB_HOST, // PostgreSQL host
  database: process.env.DB_NAME, // Your PostgreSQL database name
  password: process.env.DB_PASSWORD, // PostgreSQL password
  port: process.env.DB_PORT, // Default PostgreSQL port
  max: parseInt(process.env.DB_MAX, 10), // Maximum number of connections in the pool
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT, 10), // Connection idle timeout in milliseconds
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT, 10), // Connection timeout in milliseconds
});

// Use the pool to run a query
pool.connect((err) => {
  if (err) {
    console.error("Could not connect to PostgreSQL:", err.stack);
  } else {
    console.log("Connected to PostgreSQL successfully!");
  }
});
// Export the app (optional, for testing or use with other modules)
module.exports = { pool };
