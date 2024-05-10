// In controllers/profileController.js
const { pool } = require("../database/config");
const { isURL } = require("validator"); // Import a library to validate URLs

const getProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    if (typeof userId !== 'number') {
      return res.status(400).json({ error: "User ID must be a number." });
    }

    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    const user = userResult.rows[0];
    const { name: name, bio: bio, phone: phone, profile_image: image, profile_visibility: visibility } = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      message: "Profile Fetched SuccessFully !",
      user: {
        name: name,
        bio: bio,
        phone: phone,
        profile_image: image,
        profile_visibility: visibility,
      },
    });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};


const updateProfile = async (req, res) => {
  try {

    const { userId } = req.user;
    const { name, bio, phone, profile_image, profile_visibility } = req.body;

    if (!name || typeof name !== 'string' || name.length < 4) {
      return res.status(400).json({ error: "Name must be at least 4 characters long." });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Phone number must be in a valid Indian format." });
    }

    if (profile_image && !isURL(profile_image)) {
      return res.status(400).json({ error: "Profile image must be a valid URL." });
    }

    if (!profile_visibility || !["public", "private"].includes(profile_visibility)) {
      return res.status(400).json({ error: "Profile visibility must be 'public' or 'private'." });
    }

    const updatedUser = await pool.query(
      "UPDATE users SET name = $1, bio = $2, phone = $3, profile_image = $4, profile_visibility = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *",
      [name, bio, phone, profile_image, profile_visibility, userId]
    );
    
    const { name: updatedName, bio: updatedBio, phone: updatedPhone, profile_image: updatedProfileImage, profile_visibility: updatedProfileVisibility } = updatedUser.rows[0];

    res.status(200).json({
      message: "Profile updated successfully!",
      user: {
        name: updatedName,
        bio: updatedBio,
        phone: updatedPhone,
        profile_image: updatedProfileImage,
        profile_visibility: updatedProfileVisibility,
      },
    });

    } 
    catch (error) {
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

const getProfiles = async (req, res) => {
  try {
    const { userId } = req.user;

    const userResult = await pool.query("SELECT id, is_admin FROM users WHERE id = $1", [userId]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (!user.is_admin) {
      const publicProfiles = await pool.query(
        "SELECT id, name, bio, profile_image FROM users WHERE profile_visibility = 'public'"
      );

      return res.status(200).json({ publicProfiles: publicProfiles.rows });
    }else{

      const AllProfiles = await pool.query(
        "SELECT id, name, bio, profile_image FROM users"
      );

      return res.status(200).json({ AllProfiles: AllProfiles.rows });
    }

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getPublicProfiles,
  getProfiles,
};
