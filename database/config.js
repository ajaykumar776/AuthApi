const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // Allows self-signed certificates
  },
  max: parseInt(process.env.DB_MAX, 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT, 10),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT, 10),
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    bio TEXT,
    profile_image TEXT,
    phone VARCHAR(15),
    is_admin BOOLEAN DEFAULT FALSE,
    profile_visibility VARCHAR(10) DEFAULT 'private',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );
`;

const deleteQuery = "DROP TABLE IF EXISTS users"; // Use IF EXISTS to avoid errors if the table doesn't exist

pool.connect((err, client, done) => {
  if (err) {
    console.error("Could not connect to PostgreSQL:", err);
    return;
  }

  // Drop the table
  client.query(deleteQuery, (error) => {
    if (error) {
      console.error("Error dropping 'users' table:", error);
    } else {
      console.log("Table 'users' dropped successfully!");
    }

    // Create the table after dropping
    client.query(createTableQuery, (createError) => {
      if (createError) {
        console.error("Error creating 'users' table:", createError);
      } else {
        console.log("Table 'users' created successfully!");
      }

      done(); // Release the client back to the pool after all queries are executed
    });
  });
});

// Export the pool
module.exports = { pool };
