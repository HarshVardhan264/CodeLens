const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createReview,
    createReviewGithubIssues,
    getReviewHistory,
    getReviewById,
} = require("../controllers/reviewController");

const router = express.Router();

// Create a new repository review
router.post("/", protect, createReview);

// Create approved GitHub issues
router.post(
    "/:id/github-issues",
    protect,
    createReviewGithubIssues
);

// Get previous reviews
router.get("/history", protect, getReviewHistory);

// Get a single previous review
router.get("/:id", protect, getReviewById);

module.exports = router;