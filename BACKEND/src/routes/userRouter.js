const express = require("express");

const User = require("../model/user.js");

const userRouter = express.Router();

// ─── GET /all ────────────────────────────────────────────────
userRouter.get("/all", async (req, res) => {
    const users = await User.find().select("-password");
    res.json({
        user: users
    });
});

module.exports = { userRouter };
