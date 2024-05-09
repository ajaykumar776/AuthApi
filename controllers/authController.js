// In controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../database/config");

const registerUser = async (req, res) => {
  try {
    const { email, password, name, bio, phone } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name are required." });
    }

    // Check if the email already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    const result = await pool.query(
      "INSERT INTO users (email, password_hash, name, bio, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name",
      [email, hashedPassword, name, bio, phone]
    );

    const newUser = result.rows[0];

    // Create a JWT token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Respond with the new user details and token
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
// In controllers/authController.js
const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
      }
  
      // Find the user in the database
      const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = userResult.rows[0];
  
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password." });
      }
  
      // Compare the password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password." });
      }
  
      // Create a JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.status(200).json({ token });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };

  module.exports = {
    registerUser,
    loginUser,
  };
  