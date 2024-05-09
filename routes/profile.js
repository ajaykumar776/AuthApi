// In routes/profile.js
const express = require("express");
const { getProfile, updateProfile, getPublicProfiles,getProfiles } = require("../controllers/profileController");
const { authenticateToken, isAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.get("/public-profiles", getPublicProfiles);
router.get("/user-profile", authenticateToken,getProfiles);

module.exports = router;
