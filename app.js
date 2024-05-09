const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

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
module.exports = {app};
