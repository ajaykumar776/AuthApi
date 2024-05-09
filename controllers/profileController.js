// In controllers/profileController.js
const { pool } = require("../app");

const getProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, bio, phone, profile_image, profile_visibility } = req.body;

    const updatedUser = await pool.query(
      "UPDATE users SET name = $1, bio = $2, phone = $3, profile_image = $4, profile_visibility = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *",
      [name, bio, phone, profile_image, profile_visibility, userId]
    );

    res.status(200).json({ user: updatedUser.rows[0] });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getPublicProfiles = async (req, res) => {
  try {
    const publicProfiles = await pool.query(
      "SELECT id, name, bio, profile_image FROM users WHERE profile_visibility = 'public'"
    );

    res.status(200).json({ publicProfiles: publicProfiles.rows });
  } catch (error) {
    console.error("Error fetching public profiles:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getPublicProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    const userResult = await pool.query("SELECT id, name, bio, profile_image, profile_visibility FROM users WHERE id = $1", [userId]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.profile_visibility === "private" && !req.user.is_admin) {
      return res.status(403).json({ error: "Access denied to private profile." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getPublicProfiles,
  getPublicProfileById,
};
