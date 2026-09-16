import React, { useRef } from "react";
import gsap from "gsap";

// ============================================================
// CHECK ICON
// ============================================================

const CheckIcon = ({ size = 15 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m5 12 4 4L19 6" />
        </svg>
    );
};

// ============================================================
// ARROW ICON
// ============================================================

const ArrowIcon = ({ size = 16 }) => {
    return (
        <svg
            width={size}
            height={size}
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
    );
};

// ============================================================
// PRICING CARD
// ============================================================

const PricingCard = ({
    type,
    price,
    priceSuffix,
    description,
    features = [],
    popular = false,
    buttonText,
    onClick,
}) => {
    const cardRef = useRef(null);
    const glowRef = useRef(null);

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
            y: -8,
            duration: 0.4,
            ease: "power3.out",
        });

        gsap.to(glowRef.current, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            y: 0,
            duration: 0.4,
            ease: "power3.out",
        });

        gsap.to(glowRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: "power2.out",
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`
                relative
                overflow-hidden
                rounded-[28px]
                border
                p-8
                sm:p-10
                lg:p-11
                ${
                    popular
                        ? "border-[#9be86a]/25 bg-[#9be86a]/[0.025]"
                        : "border-white/[0.08] bg-white/[0.018]"
                }
            `}
        >
            {/* Glow */}

            <div
                ref={glowRef}
                className="
                    pointer-events-none
                    absolute
                    -right-32
                    -top-32
                    h-80
                    w-80
                    rounded-full
                    bg-[#9be86a]/[0.07]
                    opacity-0
                    blur-[110px]
                "
            />

            {/* Recommended */}

            {popular && (
                <div
                    className="
                        absolute
                        right-8
                        top-8
                        rounded-full
                        border
                        border-[#9be86a]/20
                        bg-[#9be86a]/[0.06]
                        px-3
                        py-1.5
                        text-[9px]
                        uppercase
                        tracking-[0.16em]
                        text-[#9be86a]/80
                    "
                >
                    Recommended
                </div>
            )}

            {/* Plan */}

            <div
                className="
                    relative
                    text-[10px]
                    uppercase
                    tracking-[0.24em]
                    text-white/30
                "
            >
                {type}
            </div>

            {/* Price */}

            <div className="relative mt-8 flex items-end gap-3">
                <span
                    className="
                        text-[58px]
                        font-medium
                        leading-none
                        tracking-[-0.065em]
                        text-[#eeeae1]
                        sm:text-[68px]
                    "
                >
                    {price}
                </span>

                {priceSuffix && (
                    <span
                        className="
                            mb-2
                            text-[10px]
                            uppercase
                            tracking-[0.1em]
                            text-white/25
                        "
                    >
                        {priceSuffix}
                    </span>
                )}
            </div>

            {/* Description */}

            <p
                className="
                    relative
                    mt-7
                    min-h-[64px]
                    max-w-[440px]
                    text-[14px]
                    leading-7
                    text-white/35
                "
            >
                {description}
            </p>

            {/* Divider */}

            <div className="my-8 h-px bg-white/[0.07]" />

            {/* Features */}

            <div className="relative space-y-4">
                {features.map((feature, index) => (
                    <div
                        key={`${feature}-${index}`}
                        className="
                            flex
                            items-center
                            gap-3
                            text-[13px]
                            text-white/55
                        "
                    >
                        <span
                            className={`
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                border
                                ${
                                    popular
                                        ? "border-[#9be86a]/15 bg-[#9be86a]/[0.035] text-[#9be86a]/75"
                                        : "border-white/[0.07] bg-white/[0.02] text-white/45"
                                }
                            `}
                        >
                            <CheckIcon />
                        </span>

                        <span>{feature}</span>
                    </div>
                ))}
            </div>

            {/* Button */}

            <button
                type="button"
                onClick={onClick}
                className={`
                    relative
                    mt-10
                    flex
                    h-14
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-xl
                    text-[13px]
                    font-medium
                    transition-all
                    duration-300
                    ${
                        popular
                            ? "bg-[#eeeae1] text-[#080b09] hover:bg-white"
                            : "border border-white/[0.09] bg-white/[0.025] text-white/60 hover:bg-white/[0.06] hover:text-white"
                    }
                `}
            >
                {buttonText}

                <ArrowIcon size={16} />
            </button>

            {/* Footnote */}

            <div
                className="
                    relative
                    mt-4
                    text-center
                    text-[9px]
                    uppercase
                    tracking-[0.12em]
                    text-white/15
                "
            >
                {popular
                    ? "Unlimited repository reviews"
                    : "No credit card required"}
            </div>
        </div>
    );
};

export default PricingCard;