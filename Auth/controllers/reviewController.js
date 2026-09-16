const User = require("../models/User");
const Review = require("../models/Review");

const reviewRepository = require("../services/codeReviewService");

const FREE_REVIEW_LIMIT = 4;


// ============================================================
// CREATE REVIEW
// ============================================================

const createReview = async (req, res) => {
    try {
        const { repoUrl } = req.body;

        // --------------------------------------------------------
        // Validate repository URL
        // --------------------------------------------------------

        if (!repoUrl || !repoUrl.trim()) {
            return res.status(400).json({
                success: false,
                message: "Repository URL is required",
            });
        }

        const cleanRepoUrl = repoUrl.trim();

        // --------------------------------------------------------
        // Get authenticated user
        // --------------------------------------------------------

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // --------------------------------------------------------
        // Check Free plan limit
        //
        // Free users:
        //     4 reviews maximum
        //
        // Pro users:
        //     Unlimited reviews
        // --------------------------------------------------------

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

        // --------------------------------------------------------
        // Run CodeLens AI review
        // --------------------------------------------------------

        console.log(
            `Starting review for user: ${user.email}`
        );

        const result = await reviewRepository(cleanRepoUrl);

        // --------------------------------------------------------
        // Validate AI result
        // --------------------------------------------------------

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

        // --------------------------------------------------------
        // Save completed review
        // --------------------------------------------------------

        const review = await Review.create({
            user: user._id,
            repoUrl: cleanRepoUrl,
            result,
            status: "completed",
        });

        // --------------------------------------------------------
        // Increase Free usage
        //
        // IMPORTANT:
        // Pro users do NOT consume review credits.
        // --------------------------------------------------------

        if (user.plan === "free") {
            user.reviewsUsed += 1;
            await user.save();
        }

        // --------------------------------------------------------
        // Response
        // --------------------------------------------------------

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


// ============================================================
// REVIEW HISTORY
// ============================================================

const getReviewHistory = async (req, res) => {
    try {
        const reviews = await Review.find({
            user: req.user._id,
        })
            .select("_id repoUrl status createdAt")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            reviews,
        });

    } catch (error) {
        console.error("History error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch review history",
        });
    }
};


// ============================================================
// SINGLE REVIEW
// ============================================================

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
        console.error("Get review error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch review",
        });
    }
};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    createReview,
    getReviewHistory,
    getReviewById,
};