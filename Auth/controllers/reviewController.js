const User = require("../models/User");
const Review = require("../models/Review");

const reviewRepository = require("../services/codeReviewService");

const {
    createGitHubIssues,
} = require("../services/githubService");

const FREE_REVIEW_LIMIT = 4;

// Create a new AI code review
const createReview = async (req, res) => {
    try {
        const { repoUrl } = req.body;

        // Validate repository URL
        if (!repoUrl || !repoUrl.trim()) {
            return res.status(400).json({
                success: false,
                message: "Repository URL is required",
            });
        }

        const cleanRepoUrl = repoUrl.trim();

        // Get authenticated user
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // Check free review limit
        if (
            user.plan === "free" &&
            user.reviewsUsed >= FREE_REVIEW_LIMIT
        ) {
            return res.status(403).json({
                success: false,
                code: "REVIEW_LIMIT_REACHED",
                message:
                    "You have used all 4 free repository reviews.",
                usage: {
                    used: user.reviewsUsed,
                    limit: FREE_REVIEW_LIMIT,
                    plan: user.plan,
                },
            });
        }

        // Run CodeLens AI review
        console.log(
            `Starting review for user: ${user.email}`
        );

        const result = await reviewRepository(
            cleanRepoUrl
        );

        // Validate AI result
        if (!result || !result.report) {
            console.error(
                "Invalid review result:",
                result
            );

            return res.status(500).json({
                success: false,
                message:
                    "The AI review returned an invalid result.",
            });
        }

        // Save completed review
        const review = await Review.create({
            user: user._id,
            repoUrl: cleanRepoUrl,
            result,
            status: "completed",
        });

        // Increase free usage
        if (user.plan === "free") {
            user.reviewsUsed += 1;
            await user.save();
        }

        // Return review result
        return res.status(201).json({
            success: true,

            reviewId: review._id,

            repoUrl: review.repoUrl,

            result,

            usage: {
                used: user.reviewsUsed,

                limit:
                    user.plan === "free"
                        ? FREE_REVIEW_LIMIT
                        : null,

                plan: user.plan,
            },
        });

    } catch (error) {
        console.error("Review error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while reviewing the repository.",
        });
    }
};

// Create approved GitHub issues
const createReviewGithubIssues = async (req, res) => {
    try {
        const { id } = req.params;

        // Find review belonging to authenticated user
        const review = await Review.findOne({
            _id: id,
            user: req.user._id,
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        // Get AI-selected GitHub candidates
        const issues =
            review.result?.githubCandidates || [];

        // Check if candidates exist
        if (issues.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "No GitHub issues available to create",
            });
        }

        // Create issues on GitHub
        const createdIssues =
            await createGitHubIssues(
                review.repoUrl,
                issues
            );

        // Return created issues
        return res.status(201).json({
            success: true,
            message:
                "GitHub issues created successfully",
            issues: createdIssues,
        });

    } catch (error) {
        console.error(
            "GitHub issue creation error:",
            error.response?.data ||
                error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to create GitHub issues",
        });
    }
};

// Get review history
const getReviewHistory = async (req, res) => {
    try {
        const reviews = await Review.find({
            user: req.user._id,
        })
            .select(
                "_id repoUrl status createdAt"
            )
            .sort({
                createdAt: -1,
            });

        return res.json({
            success: true,
            reviews,
        });

    } catch (error) {
        console.error(
            "History error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch review history",
        });
    }
};

// Get a single review
const getReviewById = async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        return res.json({
            success: true,
            review,
        });

    } catch (error) {
        console.error(
            "Get review error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch review",
        });
    }
};

// Export controller functions
module.exports = {
    createReview,
    createReviewGithubIssues,
    getReviewHistory,
    getReviewById,
};