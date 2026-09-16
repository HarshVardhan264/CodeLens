import React, { useRef, useState } from "react";
import gsap from "gsap";

const PlusIcon = ({ open }) => (
    <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className={`transition-transform duration-300 ${
            open ? "rotate-45" : ""
        }`}
    >
        <path d="M12 5v14" />
        <path d="M5 12h14" />
    </svg>
);

const PricingFAQ = ({ question, answer }) => {
    const [open, setOpen] = useState(false);
    const contentRef = useRef(null);

    const toggle = () => {
        setOpen((prev) => !prev);

        if (!open) {
            gsap.fromTo(
                contentRef.current,
                {
                    height: 0,
                    opacity: 0,
                },
                {
                    height: "auto",
                    opacity: 1,
                    duration: 0.35,
                    ease: "power3.out",
                }
            );
        }
    };

    return (
        <div className="border-b border-white/[0.07]">
            <button
                type="button"
                onClick={toggle}
                className="
                    flex
                    w-full
                    items-center
                    justify-between
                    py-6
                    text-left
                "
            >
                <span className="pr-6 text-[14px] text-white/75">
                    {question}
                </span>

                <span className="shrink-0 text-white/30">
                    <PlusIcon open={open} />
                </span>
            </button>

            <div
                ref={contentRef}
                className="overflow-hidden"
                style={{
                    height: 0,
                    opacity: 0,
                }}
            >
                <p className="max-w-[700px] pb-6 text-[13px] leading-7 text-white/32">
                    {answer}
                </p>
            </div>
        </div>
    );
};

export default PricingFAQ;