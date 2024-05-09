// Import dependencies
const { Pool } = require("pg");
const fs = require("fs");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

const config = {
  user: "avnadmin",
  password: "AVNS_wWmpOuV1IyDZM3PIzmA",
  host: "pg-1840963b-ajaykrdtg5-52ec.a.aivencloud.com",
  port: "23155",
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem").toString(),
  },
};
const pool = new Pool(config);

pool.connect(function (err) {
  if (err) throw console.error("Database connection failed:", err);
  console.log("Database connected successfully.");
});

// Basic route to test server
app.get("/", (req, res) => {
  res.send("Welcome to the Authentication API!");
});

// Import route modules
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

// Use route modules
app.use("/auth", authRoutes);
app.use("/profiles", profileRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the app (optional, for testing or use with other modules)
module.exports = app;
