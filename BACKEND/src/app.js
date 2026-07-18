const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const connectDB = require("./config/database.js");
const { authRouter } = require("./routes/auth.js");
const { profileRouter } = require("./routes/profileRouter.js");
const { userRouter } = require("./routes/userRouter.js");
const {requestRouter} = require("./routes/requestRouter.js")

const app = express();

const PORT = 3000;

// ─── Middleware ───────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

// ─── Routes ──────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.end("HELLOOOOOOOOOO");
});

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", requestRouter);

// ─── Database Connection & Server Start ──────────────────────
connectDB()
    .then(() => {
        console.log("Database connection established... 🔌");

        app.listen(PORT, () => {
            console.log(`Backend service is running fine on port ${PORT}. ✅🛩️`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed! ❌", err.message);
        process.exit(1);
    });