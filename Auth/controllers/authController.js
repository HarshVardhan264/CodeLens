const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const RevokedToken = require("../models/RevokedToken");

// ============================================================
// GENERATE JWT
// ============================================================

const generateToken = (userId) => {
    return jwt.sign(
        {
            id: userId,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

// ============================================================
// FORMAT USER
// Keeps signup/login/getMe responses consistent
// ============================================================

const formatUser = (user) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        reviewsUsed: user.reviewsUsed,
        planActivatedAt: user.planActivatedAt || null,
    };
};

// ============================================================
// SIGNUP
// ============================================================

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Validate password
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters",
            });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Check existing user
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,

            // CodeLens free plan
            plan: "free",
            reviewsUsed: 0,

            // Payment fields
            razorpayOrderId: null,
            razorpayPaymentId: null,
            planActivatedAt: null,
        });

        // Generate JWT
        const token = generateToken(user._id);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",

            token,

            user: formatUser(user),
        });
    } catch (error) {
        console.error("Signup error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// ============================================================
// LOGIN
// ============================================================

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Find user
        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate JWT
        const token = generateToken(user._id);

        return res.json({
            success: true,
            message: "Login successful",

            token,

            user: formatUser(user),
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// ============================================================
// CURRENT USER
// ============================================================

const getMe = async (req, res) => {
    try {
        return res.json({
            success: true,
            user: formatUser(req.user),
        });
    } catch (error) {
        console.error("Get user error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// ============================================================
// LOGOUT
// ============================================================

const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(400).json({
                success: false,
                message: "Authentication token missing",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Authentication token missing",
            });
        }

        // Verify token before revoking it
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store token in revoked-token collection
        await RevokedToken.create({
            token,
            expiresAt: new Date(decoded.exp * 1000),
        });

        return res.json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("Logout error:", error.message);

        return res.status(400).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    signup,
    login,
    getMe,
    logout,
};