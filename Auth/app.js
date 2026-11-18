const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

connectDB();

const allowedOrigins = [
    ...((process.env.FRONTEND_URL || "").split(",").map((origin) => origin.trim())),
    "http://localhost:5173",
    "http://localhost:8080",
].filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            // Requests made outside a browser do not send an Origin header.
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Origin not allowed by CORS"));
        },
        credentials: true,
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CodeLens API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
