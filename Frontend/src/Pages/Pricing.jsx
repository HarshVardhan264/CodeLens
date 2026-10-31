import React, { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PricingCard from "../components/PricingCard";
import PricingFAQ from "../components/PricingFAQ";

// ============================================================
// GSAP
// ============================================================

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// PRICING PAGE
// ============================================================

const Pricing = () => {
    const pageRef = useRef(null);
    const heroRef = useRef(null);
    const cardsRef = useRef(null);

    const navigate = useNavigate();

    const [paymentLoading, setPaymentLoading] = useState(false);

    // ============================================================
    // INITIAL ANIMATIONS
    // ============================================================

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const timeline = gsap.timeline({
                defaults: {
                    ease: "power3.out",
                },
            });

            // ----------------------------------------------------
            // HERO
            // ----------------------------------------------------

            timeline.fromTo(
                heroRef.current,
                {
                    opacity: 0,
                    y: 35,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                }
            );

            // ----------------------------------------------------
            // PRICING CARDS
            // ----------------------------------------------------

            if (cardsRef.current) {
                timeline.fromTo(
                    cardsRef.current.children,
                    {
                        opacity: 0,
                        y: 45,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        stagger: 0.13,
                    },
                    "-=0.35"
                );
            }
        }, pageRef);

        return () => ctx.revert();
    }, []);

    // ============================================================
    // SCROLL REVEALS
    // GSAP + SCROLLTRIGGER
    // ============================================================

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const elements =
                gsap.utils.toArray(".pricing-reveal");

            elements.forEach((element) => {
                gsap.fromTo(
                    element,
                    {
                        opacity: 0,
                        y: 50,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.85,
                        ease: "power3.out",

                        scrollTrigger: {
                            trigger: element,
                            start: "top 86%",
                            once: true,
                        },
                    }
                );
            });
        }, pageRef);

        return () => ctx.revert();
    }, []);

    // ============================================================
    // FREE PLAN
    // ============================================================

    const handleFreePlan = () => {
        navigate("/review");
    };

    // ============================================================
    // LOAD RAZORPAY SCRIPT
    // ============================================================

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            // Already loaded
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => {
                resolve(true);
            };

            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    };

    // ============================================================
    // PRO PLAN / RAZORPAY
    // ============================================================

    const handleProPlan = async () => {
        if (paymentLoading) return;

        try {
            setPaymentLoading(true);

            // ----------------------------------------------------
            // 1. Load Razorpay Checkout
            // ----------------------------------------------------

            const razorpayLoaded =
                await loadRazorpayScript();

            if (!razorpayLoaded) {
                alert(
                    "Unable to load Razorpay. Please check your internet connection and try again."
                );

                setPaymentLoading(false);
                return;
            }

            // ----------------------------------------------------
            // 2. Get authentication token
            // ----------------------------------------------------

            const token =
                localStorage.getItem("token");

            // ----------------------------------------------------
            // 3. Create order on backend
            // ----------------------------------------------------

            const response = await fetch(
                `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/payment/create-order`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        ...(token
                            ? {
                                  Authorization: `Bearer ${token}`,
                              }
                            : {}),
                    },
                }
            );

            const data = await response.json();

            if (
                !response.ok ||
                !data.success
            ) {
                throw new Error(
                    data.message ||
                        "Unable to create payment order."
                );
            }

            // ----------------------------------------------------
            // 4. Razorpay Checkout Options
            // ----------------------------------------------------

            const options = {
                key:
                    import.meta.env
                        .VITE_RAZORPAY_KEY_ID,

                amount:
                    data.order.amount,

                currency:
                    data.order.currency,

                name: "CodeLens",

                description:
                    "CodeLens Pro - One-time purchase",

                order_id:
                    data.order.id,

                // ------------------------------------------------
                // PAYMENT SUCCESS
                // ------------------------------------------------

                handler: async function (
                    paymentResponse
                ) {
                    try {
                        // --------------------------------------------
                        // Verify payment on backend
                        // --------------------------------------------

                        const verifyResponse =
                            await fetch(
                                `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/payment/verify`,
                                {
                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json",

                                        ...(token
                                            ? {
                                                  Authorization: `Bearer ${token}`,
                                              }
                                            : {}),
                                    },

                                    body: JSON.stringify({
                                        razorpay_order_id:
                                            paymentResponse.razorpay_order_id,

                                        razorpay_payment_id:
                                            paymentResponse.razorpay_payment_id,

                                        razorpay_signature:
                                            paymentResponse.razorpay_signature,
                                    }),
                                }
                            );

                        const verifyData =
                            await verifyResponse.json();

                        if (
                            !verifyResponse.ok ||
                            !verifyData.success
                        ) {
                            throw new Error(
                                verifyData.message ||
                                    "Payment verification failed."
                            );
                        }

                        // --------------------------------------------
                        // Payment successful
                        // --------------------------------------------

                        alert(
                            "Payment successful! CodeLens Pro is now active."
                        );

                        window.location.reload();
                    } catch (error) {
                        console.error(
                            "Payment verification error:",
                            error
                        );

                        alert(
                            "Payment was received, but verification failed. Please contact support."
                        );
                    } finally {
                        setPaymentLoading(false);
                    }
                },

                // ------------------------------------------------
                // PREFILL
                // ------------------------------------------------

                prefill: {
                    name: "",
                    email: "",
                },

                // ------------------------------------------------
                // NOTES
                // ------------------------------------------------

                notes: {
                    product: "CodeLens Pro",
                },

                // ------------------------------------------------
                // THEME
                // ------------------------------------------------

                theme: {
                    color: "#9be86a",
                },

                // ------------------------------------------------
                // MODAL
                // ------------------------------------------------

                modal: {
                    ondismiss: function () {
                        setPaymentLoading(false);
                    },
                },
            };

            // ----------------------------------------------------
            // 5. Open Razorpay
            // ----------------------------------------------------

            const razorpay =
                new window.Razorpay(options);

            // ----------------------------------------------------
            // PAYMENT FAILED
            // ----------------------------------------------------

            razorpay.on(
                "payment.failed",
                function (response) {
                    console.error(
                        "Razorpay payment failed:",
                        response.error
                    );

                    alert(
                        response.error?.description ||
                            "Payment failed. Please try again."
                    );

                    setPaymentLoading(false);
                }
            );

            razorpay.open();
        } catch (error) {
            console.error(
                "Payment error:",
                error
            );

            alert(
                error.message ||
                    "Unable to start payment. Please try again."
            );

            setPaymentLoading(false);
        }
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <>
            {/* ====================================================
                GLOBAL SCROLLBAR HIDE
                SCROLLING STILL WORKS
            ==================================================== */}

            <style>
                {`
                    /* Firefox */
                    html,
                    body,
                    #root {
                        scrollbar-width: none !important;
                        -ms-overflow-style: none !important;
                    }

                    /* Chrome / Edge / Safari */
                    html::-webkit-scrollbar,
                    body::-webkit-scrollbar,
                    #root::-webkit-scrollbar {
                        display: none !important;
                        width: 0 !important;
                        height: 0 !important;
                    }

                    /* Any nested scroll container */
                    #root *::-webkit-scrollbar {
                        display: none !important;
                        width: 0 !important;
                        height: 0 !important;
                    }

                    #root * {
                        scrollbar-width: none !important;
                        -ms-overflow-style: none !important;
                    }

                    /* Prevent horizontal scrollbar */
                    html,
                    body {
                        overflow-x: hidden !important;
                    }
                `}
            </style>

            <div
                ref={pageRef}
                className="
                    min-h-screen
                    w-full
                    overflow-x-hidden
                    bg-[#131310]
                    text-[#eeeae1]
                "
            >
                {/* ==================================================
                    BACKGROUND GRID
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        fixed
                        inset-0
                        z-0
                        opacity-[0.025]
                    "
                    style={{
                        backgroundImage: `
                            linear-gradient(
                                rgba(255,255,255,0.5) 1px,
                                transparent 1px
                            ),
                            linear-gradient(
                                90deg,
                                rgba(255,255,255,0.5) 1px,
                                transparent 1px
                            )
                        `,
                        backgroundSize: "48px 48px",
                    }}
                />

                {/* ==================================================
                    TOP GLOW
                ================================================== */}

                <div
                    className="
                        pointer-events-none
                        fixed
                        left-1/2
                        top-0
                        z-0
                        h-[450px]
                        w-[850px]
                        -translate-x-1/2
                        rounded-full
                        bg-[#9be86a]/[0.018]
                        blur-[140px]
                    "
                />

                {/* ==================================================
                    NAVBAR
                ================================================== */}

                <div className="relative z-50">
                    <Navbar />
                </div>

                {/* ==================================================
                    MAIN
                ================================================== */}

                <main className="relative z-10">

                    {/* ==================================================
                        HERO
                    ================================================== */}

                    <section
                        ref={heroRef}
                        className="
                            flex
                            min-h-[72vh]
                            items-center
                            px-6
                            pb-24
                            pt-32
                            sm:px-8
                            lg:px-12
                            xl:px-16
                        "
                    >
                        <div className="mx-auto w-full max-w-[1500px]">

                            {/* Label */}

                            <div
                                className="
                                    mb-9
                                    flex
                                    items-center
                                    gap-4
                                    text-[10px]
                                    uppercase
                                    tracking-[0.24em]
                                    text-white/30
                                "
                            >
                                <span className="h-px w-12 bg-white/20" />

                                Pricing
                            </div>

                            {/* Heading */}

                            <h1
                                className="
                                    max-w-[1250px]
                                    text-[60px]
                                    font-medium
                                    leading-[0.87]
                                    tracking-[-0.067em]
                                    sm:text-[84px]
                                    lg:text-[115px]
                                "
                            >
                                Code review
                                <br />

                                <span className="text-white/25">
                                    without the limits.
                                </span>
                            </h1>

                            {/* Bottom */}

                            <div
                                className="
                                    mt-12
                                    flex
                                    flex-col
                                    justify-between
                                    gap-8
                                    lg:flex-row
                                    lg:items-end
                                "
                            >
                                <p
                                    className="
                                        max-w-[620px]
                                        text-[15px]
                                        leading-8
                                        text-white/38
                                        sm:text-[16px]
                                    "
                                >
                                    Start with everything you need
                                    to understand your code. Upgrade
                                    when your projects need deeper
                                    and unlimited reviews.
                                </p>

                                <div
                                    className="
                                        text-[9px]
                                        uppercase
                                        tracking-[0.18em]
                                        text-white/20
                                    "
                                >
                                    Simple pricing · No subscription
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ==================================================
                        PRICING CARDS
                    ================================================== */}

                    <section
                        ref={cardsRef}
                        className="
                            mx-auto
                            w-full
                            max-w-[1500px]
                            px-6
                            pb-36
                            sm:px-8
                            lg:px-12
                            xl:px-16
                        "
                    >
                        <div className="grid gap-6 lg:grid-cols-2">

                            {/* FREE */}

                            <PricingCard
                                type="FREE"
                                price="$0"
                                priceSuffix="forever"
                                description="
                                    Everything you need to try CodeLens
                                    and inspect your repositories.
                                "
                                features={[
                                    "4 repository reviews",
                                    "Bug detection",
                                    "Security analysis",
                                    "Code quality analysis",
                                    "Code health score",
                                ]}
                                buttonText="Start reviewing"
                                onClick={handleFreePlan}
                            />

                            {/* PRO */}

                            <PricingCard
                                type="PRO"
                                price="$20"
                                priceSuffix="one-time"
                                description="
                                    For developers who review regularly
                                    and want unlimited repository analysis.
                                "
                                popular
                                features={[
                                    "Unlimited repository reviews",
                                    "Bug detection",
                                    "Security analysis",
                                    "Code quality analysis",
                                    "Code health score",
                                    "Full review history",
                                    "Priority analysis",
                                ]}
                                buttonText={
                                    paymentLoading
                                        ? "Opening payment..."
                                        : "Upgrade to Pro"
                                }
                                onClick={handleProPlan}
                            />
                        </div>
                    </section>

                    {/* ==================================================
                        DIVIDER
                    ================================================== */}

                    <div
                        className="
                            mx-auto
                            max-w-[1500px]
                            px-6
                            sm:px-8
                            lg:px-12
                            xl:px-16
                        "
                    >
                        <div className="h-px bg-white/[0.07]" />
                    </div>

                    {/* ==================================================
                        COMPARISON
                    ================================================== */}

                    <section
                        className="
                            pricing-reveal
                            mx-auto
                            w-full
                            max-w-[1500px]
                            px-6
                            py-36
                            sm:px-8
                            lg:px-12
                            xl:px-16
                        "
                    >
                        <div
                            className="
                                mb-16
                                flex
                                flex-col
                                justify-between
                                gap-8
                                lg:flex-row
                                lg:items-end
                            "
                        >
                            <div>

                                <div
                                    className="
                                        mb-6
                                        text-[10px]
                                        uppercase
                                        tracking-[0.22em]
                                        text-white/25
                                    "
                                >
                                    Compare plans
                                </div>

                                <h2
                                    className="
                                        text-[48px]
                                        font-medium
                                        leading-[0.9]
                                        tracking-[-0.06em]
                                        sm:text-[64px]
                                    "
                                >
                                    Everything your
                                    <br />

                                    <span className="text-white/25">
                                        code needs.
                                    </span>
                                </h2>

                            </div>

                            <p
                                className="
                                    max-w-[420px]
                                    text-[13px]
                                    leading-7
                                    text-white/30
                                "
                            >
                                Both plans use the same CodeLens
                                analysis engine. Pro removes the
                                review limit and gives you unlimited
                                repository analysis.
                            </p>
                        </div>

                        {/* Comparison */}

                        <div className="border-t border-white/[0.08]">

                            {/* Header */}

                            <div
                                className="
                                    grid
                                    grid-cols-[1fr_100px_110px]
                                    gap-5
                                    border-b
                                    border-white/[0.07]
                                    py-5
                                    text-[9px]
                                    uppercase
                                    tracking-[0.17em]
                                    text-white/25
                                    sm:grid-cols-[1fr_150px_150px]
                                "
                            >
                                <div>Feature</div>

                                <div className="text-center">
                                    Free
                                </div>

                                <div className="text-center">
                                    Pro
                                </div>
                            </div>

                            {/* Rows */}

                            {[
                                [
                                    "Repository reviews",
                                    "4",
                                    "Unlimited",
                                ],
                                [
                                    "Bug detection",
                                    "✓",
                                    "✓",
                                ],
                                [
                                    "Security analysis",
                                    "✓",
                                    "✓",
                                ],
                                [
                                    "Code quality analysis",
                                    "✓",
                                    "✓",
                                ],
                                [
                                    "Code health score",
                                    "✓",
                                    "✓",
                                ],
                                [
                                    "Review history",
                                    "Limited",
                                    "Full",
                                ],
                                [
                                    "Priority analysis",
                                    "—",
                                    "✓",
                                ],
                            ].map(
                                (
                                    [feature, free, pro],
                                    index
                                ) => (
                                    <div
                                        key={index}
                                        className="
                                            grid
                                            grid-cols-[1fr_100px_110px]
                                            gap-5
                                            border-b
                                            border-white/[0.055]
                                            py-6
                                            text-[13px]
                                            sm:grid-cols-[1fr_150px_150px]
                                        "
                                    >
                                        <div className="text-white/55">
                                            {feature}
                                        </div>

                                        <div className="text-center text-white/35">
                                            {free}
                                        </div>

                                        <div
                                            className={`
                                                text-center
                                                ${
                                                    pro === "✓"
                                                        ? "text-[#9be86a]/75"
                                                        : "text-white/50"
                                                }
                                            `}
                                        >
                                            {pro}
                                        </div>
                                    </div>
                                )
                            )}

                        </div>
                    </section>

                    {/* ==================================================
                        FAQ
                    ================================================== */}

                    <section
                        className="
                            pricing-reveal
                            border-y
                            border-white/[0.07]
                        "
                    >
                        <div
                            className="
                                mx-auto
                                w-full
                                max-w-[1100px]
                                px-6
                                py-36
                                sm:px-8
                                lg:px-12
                            "
                        >
                            <div className="mb-14">

                                <div
                                    className="
                                        mb-6
                                        text-[10px]
                                        uppercase
                                        tracking-[0.22em]
                                        text-white/25
                                    "
                                >
                                    FAQ
                                </div>

                                <h2
                                    className="
                                        text-[48px]
                                        font-medium
                                        leading-[0.9]
                                        tracking-[-0.06em]
                                        sm:text-[64px]
                                    "
                                >
                                    Questions,
                                    <br />

                                    <span className="text-white/25">
                                        answered.
                                    </span>
                                </h2>

                            </div>

                            <div>

                                <PricingFAQ
                                    question="How many reviews can I run for free?"
                                    answer="The Free plan includes 4 repository reviews. Once you reach the limit, you can upgrade to Pro for unlimited repository reviews."
                                />

                                <PricingFAQ
                                    question="What do the AI agents analyze?"
                                    answer="CodeLens uses specialized AI agents to analyze repositories for bugs, security vulnerabilities and code-quality issues."
                                />

                                <PricingFAQ
                                    question="Do I need to connect my GitHub account?"
                                    answer="No. You can provide a public GitHub repository URL directly to CodeLens for analysis."
                                />

                                <PricingFAQ
                                    question="Is Pro a subscription?"
                                    answer="No. The current CodeLens Pro plan is designed as a one-time $20 purchase for unlimited repository reviews."
                                />

                                <PricingFAQ
                                    question="Can I upgrade later?"
                                    answer="Yes. You can start with the Free plan and upgrade whenever you need unlimited repository reviews."
                                />

                            </div>
                        </div>
                    </section>

                    {/* ==================================================
                        FINAL CTA
                    ================================================== */}

                    <section
                        className="
                            pricing-reveal
                            border-b
                            border-white/[0.07]
                        "
                    >
                        <div
                            className="
                                mx-auto
                                flex
                                max-w-[1500px]
                                flex-col
                                justify-between
                                gap-12
                                px-6
                                py-36
                                sm:px-8
                                lg:flex-row
                                lg:items-end
                                lg:px-12
                                xl:px-16
                            "
                        >
                            <div>

                                <div
                                    className="
                                        mb-6
                                        text-[10px]
                                        uppercase
                                        tracking-[0.22em]
                                        text-white/25
                                    "
                                >
                                    Start with your code
                                </div>

                                <h2
                                    className="
                                        text-[52px]
                                        font-medium
                                        leading-[0.88]
                                        tracking-[-0.065em]
                                        sm:text-[70px]
                                        lg:text-[84px]
                                    "
                                >
                                    Ready to see
                                    <br />

                                    <span className="text-white/25">
                                        what you missed?
                                    </span>
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={handleFreePlan}
                                className="
                                    flex
                                    h-14
                                    shrink-0
                                    items-center
                                    justify-center
                                    gap-3
                                    rounded-xl
                                    bg-[#eeeae1]
                                    px-7
                                    text-[13px]
                                    font-medium
                                    text-[#080b09]
                                    transition
                                    duration-300
                                    hover:bg-white
                                "
                            >
                                Review a repository

                                <svg
                                    width="17"
                                    height="17"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14" />
                                    <path d="m13 6 6 6-6 6" />
                                </svg>
                            </button>

                        </div>
                    </section>
                </main>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div className="relative z-10">
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default Pricing;