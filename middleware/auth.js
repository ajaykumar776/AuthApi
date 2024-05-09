// In middleware/auth.js
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error authenticating token:", error);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const { userId } = req.user;

  pool.query("SELECT is_admin FROM users WHERE id = $1", [userId], (err, result) => {
    if (err) {
      console.error("Error fetching user role:", err);
      return res.status(500).json({ error: "Internal server error." });
    }

    const user = result.rows[0];

    if (!user || !user.is_admin) {
      return res.status(403).json({ error: "Admin access required." });
    }

    next();
  });
};

module.exports = {
  authenticateToken,
  isAdmin,
};
