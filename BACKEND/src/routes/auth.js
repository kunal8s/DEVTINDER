const express = require("express");
const bcrypt = require("bcrypt");
const { z } = require("zod");

const { signupSchema } = require("../utils/signupSchema.js");
const { loginSchema } = require("../utils/loginSchema.js");
const User = require("../model/user.js");

const authRouter = express.Router();

// ─── POST /signup ────────────────────────────────────────────
authRouter.post('/signup', async (req, res) => {
    try {
        // Validate req.body against the schema
        const validatedData = signupSchema.parse(req.body);

        // Destructure validated data
        const { username, email, Password, Age } = validatedData;

        const hashedPassword = await bcrypt.hash(Password, 10);

        const user = new User({
            name: username,
            emailId: email,
            password: hashedPassword,
            age: Age
        });

        await user.save();

        res.status(200).send({ msg: "User added successfully...!!" });
        console.log(JSON.stringify(validatedData));

    } catch (error) {
        // Catch Zod validation errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                msg: "Validation failed",
                errors: error.issues.map(err => ({
                    field: err.path[0],
                    message: err.message
                }))
            });
        }

        // Catch general database or server errors
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// ─── POST /login ─────────────────────────────────────────────
authRouter.post("/login", async (req, res) => {
    try {
        // 1. Zod validation (will safely step into catch block if validation fails)
        const loginValidate = loginSchema.parse(req.body);
        const { email, Password } = loginValidate;

        // 2. Database search
        const users = await User.findOne({ emailId: email });

        if (!users) {
            return res.status(401).json({ msg: "Please check the email or kindly signup" });
        }

        // 3. Password check
        // const isPasswordMatch = await bcrypt.compare(Password, users.password);
        const isPasswordMatch = await users.validatePassword(Password);

        if (!isPasswordMatch) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        // 4. Construct safe payload
        const userinfo = {
            id: users._id,
            name: users.name,
            emailId: users.emailId,
            age: users.age
        };

        if (isPasswordMatch) {
            // now we generate the JWT token for the user
            const payload = {
                userId: userinfo.id // This is safe and all your server needs to identify them later
            };

            // 4. Generate (Sign) the JWT
            const token = await users.getJWT();

            // here we are wrpping up the token into the cookies to send back
            res.cookie('auth_token', token, {
                httpOnly: true,       // Prevents XSS attacks (Cross-Site Scripting via frontend JS)
                secure: false,        // Set to TRUE in production when using HTTPS
                sameSite: 'strict'    // Prevents CSRF attacks (Cross-Site Request Forgery)
            });

            res.json({
                USER: userinfo
            });
        }

    } catch (error) {
        // Handle Zod validation errors gracefully without crashing the server
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                msg: "Validation failed",
                errors: error.issues.map(err => ({
                    field: err.path[0],
                    message: err.message
                }))
            });
        }

        // Handle structural or database errors
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

authRouter.post("/logout", (req,res)=>{
    // res.clearCookie("auth_token");
    res.cookie("auth_token",null,{expires:new Date(Date.now())});

    res.json({message:"Logged out sucessfully...!!"})
})

module.exports = { authRouter };