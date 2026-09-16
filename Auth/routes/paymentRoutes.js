const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PRO_PLAN_AMOUNT = 199900;
const PRO_PLAN_CURRENCY = "INR";

router.post("/create-order", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (user.plan === "pro") {
            return res.status(400).json({
                success: false,
                code: "ALREADY_PRO",
                message: "You already have a Pro plan.",
            });
        }

        const order = await razorpay.orders.create({
            amount: PRO_PLAN_AMOUNT,
            currency: PRO_PLAN_CURRENCY,
            receipt: `codelens_${user._id}_${Date.now()}`,
        });

        user.razorpayOrderId = order.id;
        await user.save();

        return res.status(200).json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            },
        });
    } catch (error) {
        console.error("Razorpay order creation error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create payment order.",
        });
    }
});

router.post("/verify", protect, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification data is incomplete.",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (user.plan === "pro") {
            return res.status(400).json({
                success: false,
                code: "ALREADY_PRO",
                message: "Your account already has a Pro plan.",
            });
        }

        if (
            !user.razorpayOrderId ||
            user.razorpayOrderId !== razorpay_order_id
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment order.",
            });
        }

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        const generatedBuffer = Buffer.from(
            generatedSignature,
            "utf8"
        );

        const receivedBuffer = Buffer.from(
            razorpay_signature,
            "utf8"
        );

        if (
            generatedBuffer.length !==
            receivedBuffer.length
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed.",
            });
        }

        const signatureValid = crypto.timingSafeEqual(
            generatedBuffer,
            receivedBuffer
        );

        if (!signatureValid) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed.",
            });
        }

        user.plan = "pro";
        user.razorpayPaymentId = razorpay_payment_id;
        user.planActivatedAt = new Date();
        user.razorpayOrderId = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                "Payment verified successfully. Pro plan activated.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                plan: user.plan,
                reviewsUsed: user.reviewsUsed,
                planActivatedAt: user.planActivatedAt,
            },
        });
    } catch (error) {
        console.error("Razorpay verification error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to verify payment.",
        });
    }
});

module.exports = router;