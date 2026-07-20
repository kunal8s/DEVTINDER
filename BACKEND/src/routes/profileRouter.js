const express = require("express");

const { userAuth } = require("../middlewares/auth.js");

const profileRouter = express.Router();

// ─── GET /user ───────────────────────────────────────────────



// PROTECTED ROUTE: /user
profileRouter.get("/user", userAuth, async (req, res) => {
    try {
        // req.user is automatically populated cleanly by your userAuth middleware
        console.log("Logged in user ID is : " + req.user._id);
        console.log("User Name: " + req.user.name);

        res.send(`Reading dashboard data for: ${req.user.name}`);
    } catch (err) {
        res.status(500).send("Error reading user data: " + err.message);
    }
});

// ─── GET /profile ────────────────────────────────────────────

// PROTECTED ROUTE: /profile
profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        // Reuses the exact same attached user info from userAuth middleware
        res.send(`Welcome to your profile, ${req.user.name}`);
    } catch (err) {
        res.status(500).send("Error reading profile data: " + err.message);
    }
});


module.exports = { profileRouter };
