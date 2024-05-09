// In routes/profile.js
const express = require("express");
const { getProfile, updateProfile, getPublicProfiles,getPublicProfileById } = require("../controllers/profileController");
const { authenticateToken, isAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.get("/public-profiles", getPublicProfiles);
router.get("/user-profile/:userId", authenticateToken, getPublicProfileById);

module.exports = router;
