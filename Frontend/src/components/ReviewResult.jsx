import React, { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const Lens = ({ size = "0.78em" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="inline-block align-[-0.02em]"
    >
        <circle
            cx="12"
            cy="12"
            r="10.5"
            stroke="currentColor"
            strokeWidth="2.4"
        />
        <circle
            cx="12"
            cy="12"
            r="4"
            stroke="currentColor"
            strokeWidth="2.4"
        />
    </svg>
);

const PlusIcon = ({ open }) => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className={`transition-transform duration-300 ${
            open ? "rotate-45" : "rotate-0"
        }`}
    >
        <path d="M12 5v14" />
        <path d="M5 12h14" />
    </svg>
);

function ReviewResult({ result }) {
    const report = result?.report || {};

    const rootRef = useRef(null);
    const headerRef = useRef(null);
    const scoreCardsRef = useRef(null);
    const issuesRef = useRef(null);
    const summaryRef = useRef(null);
    const recommendationsRef = useRef(null);
    const recommendationContentRef = useRef(null);
    const recommendationCardsRef = useRef(null);

    const [recommendationsOpen, setRecommendationsOpen] =
        useState(true);

    const issues = Array.isArray(report.issues)
        ? report.issues
        : [];

    const recommendations = Array.isArray(
        report.recommendations
    )
        ? report.recommendations
        : [];

    const issueCounts = {
        critical: issues.filter(
            (issue) =>
                String(issue?.severity).toLowerCase() ===
                "critical"
        ).length,

        high: issues.filter(
            (issue) =>
                String(issue?.severity).toLowerCase() ===
                "high"
        ).length,

        medium: issues.filter(
            (issue) =>
                String(issue?.severity).toLowerCase() ===
                "medium"
        ).length,

        low: issues.filter(
            (issue) =>
                String(issue?.severity).toLowerCase() ===
                "low"
        ).length,
    };

    const score = Number(report.score) || 0;

    useLayoutEffect(() => {
        if (!rootRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: {
                    ease: "power3.out",
                },
            });

            gsap.set(
                [
                    headerRef.current,
                    issuesRef.current,
                    summaryRef.current,
                    recommendationsRef.current,
                ],
                {
                    opacity: 0,
                    y: 24,
                }
            );

            gsap.set(
                scoreCardsRef.current?.children || [],
                {
                    opacity: 0,
                    y: 24,
                }
            );

            gsap.set(
                issuesRef.current?.querySelectorAll(
                    ".cl-issue-card"
                ) || [],
                {
                    opacity: 0,
                    y: 18,
                }
            );

            tl.to(headerRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.65,
            })
                .to(
                    scoreCardsRef.current?.children || [],
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.45,
                        stagger: 0.08,
                    },
                    "-=0.25"
                )
                .to(
                    issuesRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.55,
                    },
                    "-=0.15"
                )
                .to(
                    issuesRef.current?.querySelectorAll(
                        ".cl-issue-card"
                    ) || [],
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        stagger: 0.06,
                    },
                    "-=0.25"
                )
                .to(
                    summaryRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.55,
                    },
                    "-=0.15"
                )
                .to(
                    recommendationsRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.55,
                    },
                    "-=0.15"
                );
        }, rootRef);

        return () => ctx.revert();
    }, []);

    useLayoutEffect(() => {
        const content = recommendationContentRef.current;
        const cards =
            recommendationCardsRef.current?.children || [];

        if (!content) return;

        const ctx = gsap.context(() => {
            if (recommendationsOpen) {
                gsap.set(content, {
                    height: "auto",
                    opacity: 1,
                });

                gsap.fromTo(
                    cards,
                    {
                        opacity: 0,
                        y: 15,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        stagger: 0.07,
                        ease: "power3.out",
                    }
                );
            } else {
                gsap.set(content, {
                    height: 0,
                    opacity: 0,
                });

                gsap.set(cards, {
                    opacity: 0,
                    y: 0,
                });
            }
        }, rootRef);

        return () => ctx.revert();
    }, []);

    const toggleRecommendations = () => {
        const content = recommendationContentRef.current;
        const cards =
            recommendationCardsRef.current?.children || [];

        if (!content) return;

        if (recommendationsOpen) {
            gsap.to(cards, {
                opacity: 0,
                y: -10,
                duration: 0.2,
                stagger: 0.03,
                ease: "power2.in",
            });

            gsap.to(content, {
                height: 0,
                opacity: 0,
                duration: 0.45,
                ease: "power3.inOut",
                onComplete: () => {
                    setRecommendationsOpen(false);
                },
            });

            return;
        }

        setRecommendationsOpen(true);

        requestAnimationFrame(() => {
            const content =
                recommendationContentRef.current;

            const cards =
                recommendationCardsRef.current?.children || [];

            if (!content) return;

            gsap.set(content, {
                height: 0,
                opacity: 0,
            });

            gsap.set(cards, {
                opacity: 0,
                y: 15,
            });

            const targetHeight = content.scrollHeight;

            const tl = gsap.timeline({
                defaults: {
                    ease: "power3.out",
                },
            });

            tl.to(content, {
                height: targetHeight,
                opacity: 1,
                duration: 0.55,
                ease: "power3.inOut",
            }).to(
                cards,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.07,
                },
                "-=0.25"
            );
        });
    };

    return (
        <section
            ref={rootRef}
            className="mx-auto w-full max-w-6xl pb-24"
        >
            <div
                ref={headerRef}
                className="mb-10 border-b border-[#eeeae1]/10 pb-8"
            >
                <div className="flex items-end justify-between gap-6">
                    <div>
                        <p className="mb-4 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.25em] text-[#eeeae1]/30">
                            <span className="h-px w-7 bg-[#eeeae1]/20" />
                            Review complete
                        </p>

                        <h3 className="text-3xl font-medium tracking-[-0.035em] text-[#eeeae1] sm:text-4xl">
                            Your code,
                            <span className="text-[#eeeae1]/30">
                                {" "}reviewed.
                            </span>
                        </h3>

                        <p className="mt-3 text-sm text-[#eeeae1]/25">
                            {result?.filesReviewed || 0} files
                            analyzed ·{" "}
                            {result?.chunksReviewed || 0} chunks
                            analyzed
                        </p>
                    </div>

                    <div className="hidden text-right sm:block">
                        <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#eeeae1]/25">
                            Overall health
                        </p>

                        <p className="mt-1 text-2xl font-medium text-[#eeeae1]/80">
                            {score}
                            <span className="ml-1 text-sm text-[#eeeae1]/25">
                                /100
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div
                ref={scoreCardsRef}
                className="grid gap-3 sm:grid-cols-2 md:grid-cols-5"
            >
                <div
                    className="
                        group
                        relative
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#eeeae1]/10
                        bg-[#111110]/60
                        p-6
                        transition-all
                        duration-300
                        hover:border-[#eeeae1]/20
                    "
                >
                    <div className="flex items-start justify-between">
                        <p className="text-[9px] uppercase tracking-[0.18em] text-[#eeeae1]/30">
                            Code Health
                        </p>

                        <span className="text-[10px] text-[#eeeae1]/20">
                            01
                        </span>
                    </div>

                    <p className="mt-7 text-5xl font-medium tracking-[-0.05em] text-[#eeeae1]/90">
                        {score}
                    </p>

                    <p className="mt-1 text-xs text-[#eeeae1]/20">
                        / 100
                    </p>

                    <div className="mt-6 h-px w-full bg-[#eeeae1]/10">
                        <div
                            className="h-px bg-[#eeeae1]/45"
                            style={{
                                width: `${Math.min(
                                    Math.max(score, 0),
                                    100
                                )}%`,
                            }}
                        />
                    </div>
                </div>

                <SeverityCard
                    title="Critical"
                    count={issueCounts.critical}
                    number="02"
                />

                <SeverityCard
                    title="High"
                    count={issueCounts.high}
                    number="03"
                />

                <SeverityCard
                    title="Medium"
                    count={issueCounts.medium}
                    number="04"
                />

                <SeverityCard
                    title="Low"
                    count={issueCounts.low}
                    number="05"
                />
            </div>

            <div
                ref={issuesRef}
                className="mt-16"
            >
                <div className="mb-7 flex items-end justify-between">
                    <div>
                        <p className="mb-3 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[#eeeae1]/25">
                            <span className="h-px w-7 bg-[#eeeae1]/15" />
                            Findings
                        </p>

                        <h3 className="text-3xl font-medium tracking-[-0.04em]">
                            Issues found
                        </h3>

                        <p className="mt-2 text-sm text-[#eeeae1]/25">
                            Problems detected by the AI review
                            agents.
                        </p>
                    </div>

                    <span className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-[#eeeae1]/20 sm:block">
                        {issues.length} findings
                    </span>
                </div>

                <div className="space-y-3">
                    {issues.length === 0 ? (
                        <div
                            className="
                                rounded-xl
                                border
                                border-[#eeeae1]/10
                                bg-[#111110]/40
                                p-10
                                text-center
                            "
                        >
                            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#eeeae1]/15">
                                <span className="text-lg text-[#eeeae1]/60">
                                    ✓
                                </span>
                            </div>

                            <p className="text-lg font-medium text-[#eeeae1]/80">
                                No issues found
                            </p>

                            <p className="mt-2 text-sm text-[#eeeae1]/25">
                                Your selected code looks good.
                            </p>
                        </div>
                    ) : (
                        issues.map((issue, index) => (
                            <IssueCard
                                key={index}
                                issue={issue}
                                index={index}
                            />
                        ))
                    )}
                </div>
            </div>

            <div
                ref={summaryRef}
                className="
                    mt-16
                    border-t
                    border-[#eeeae1]/10
                    pt-10
                "
            >
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <p className="mb-3 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[#eeeae1]/25">
                            <span className="h-px w-7 bg-[#eeeae1]/15" />
                            Summary
                        </p>

                        <h3 className="text-3xl font-medium tracking-[-0.04em]">
                            Executive summary
                        </h3>
                    </div>

                    <Link
                        to="/"
                        className="cl-nav__mark shrink-0"
                        aria-label="CodeLens home"
                    >
                        C<Lens />
                        <span>delens</span>
                    </Link>
                </div>

                <div
                    className="
                        mt-6
                        max-w-4xl
                        rounded-xl
                        border
                        border-[#eeeae1]/10
                        bg-[#111110]/35
                        p-6
                        sm:p-7
                    "
                >
                    <p className="text-[9px] uppercase tracking-[0.18em] text-[#eeeae1]/20">
                        What this means
                    </p>

                    <p className="mt-4 text-sm leading-7 text-[#eeeae1]/50">
                        {report.summary ||
                            "No summary was generated for this review."}
                    </p>
                </div>
            </div>

            <div
                ref={recommendationsRef}
                className="mt-16"
            >
                <button
                    type="button"
                    onClick={toggleRecommendations}
                    aria-expanded={recommendationsOpen}
                    className="
                        group
                        w-full
                        border-t
                        border-b
                        border-[#eeeae1]/10
                        py-7
                        text-left
                        transition-colors
                        duration-300
                        hover:border-[#eeeae1]/20
                    "
                >
                    <div className="flex items-center justify-between gap-6">
                        <div>
                            <p className="mb-3 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[#eeeae1]/25">
                                <span className="h-px w-7 bg-[#eeeae1]/15" />
                                Next steps
                            </p>

                            <h3 className="text-3xl font-medium tracking-[-0.04em]">
                                Recommendations
                            </h3>

                            <p className="mt-2 text-sm text-[#eeeae1]/25">
                                Practical improvements suggested
                                by CodeLens.
                            </p>
                        </div>

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-[#eeeae1]/10
                                text-[#eeeae1]/40
                                transition-all
                                duration-300
                                group-hover:border-[#eeeae1]/20
                                group-hover:text-[#eeeae1]/70
                            "
                        >
                            <PlusIcon
                                open={recommendationsOpen}
                            />
                        </div>
                    </div>
                </button>

                <div
                    ref={recommendationContentRef}
                    className="overflow-hidden"
                >
                    <div
                        ref={recommendationCardsRef}
                        className="space-y-2 pt-5"
                    >
                        {recommendations.length === 0 ? (
                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-[#eeeae1]/10
                                    bg-[#111110]/35
                                    p-6
                                    text-sm
                                    text-[#eeeae1]/35
                                "
                            >
                                No additional recommendations.
                            </div>
                        ) : (
                            recommendations.map(
                                (recommendation, index) => (
                                    <RecommendationCard
                                        key={index}
                                        recommendation={
                                            recommendation
                                        }
                                        index={index}
                                    />
                                )
                            )
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

function SeverityCard({ title, count, number }) {
    return (
        <div
            className="
                group
                relative
                overflow-hidden
                rounded-xl
                border
                border-[#eeeae1]/10
                bg-[#111110]/45
                p-6
                transition-all
                duration-300
                hover:border-[#eeeae1]/20
            "
        >
            <div className="flex items-start justify-between">
                <p className="text-[9px] uppercase tracking-[0.18em] text-[#eeeae1]/30">
                    {title}
                </p>

                <span className="text-[9px] text-[#eeeae1]/15">
                    {number}
                </span>
            </div>

            <p className="mt-7 text-3xl font-medium tracking-[-0.04em] text-[#eeeae1]/80">
                {count}
            </p>

            <div className="mt-7 h-px w-full bg-[#eeeae1]/[0.06]" />
        </div>
    );
}

function IssueCard({ issue, index }) {
    const severityStyle = {
        Critical:
            "border-red-400/20 bg-red-400/[0.04] text-red-300/70",

        High:
            "border-orange-400/20 bg-orange-400/[0.04] text-orange-300/70",

        Medium:
            "border-yellow-400/20 bg-yellow-400/[0.04] text-yellow-300/70",

        Low:
            "border-[#eeeae1]/10 bg-[#eeeae1]/[0.02] text-[#eeeae1]/35",
    };

    const severity =
        issue?.severity?.charAt(0).toUpperCase() +
        issue?.severity?.slice(1).toLowerCase();

    return (
        <div
            className="
                cl-issue-card
                group
                rounded-xl
                border
                border-[#eeeae1]/10
                bg-[#111110]/35
                p-6
                transition-all
                duration-300
                hover:border-[#eeeae1]/20
                sm:p-7
            "
        >
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={`
                            rounded-full
                            border
                            px-3
                            py-1
                            text-[9px]
                            uppercase
                            tracking-[0.12em]
                            ${
                                severityStyle[severity] ||
                                severityStyle.Low
                            }
                        `}
                    >
                        {severity || "Low"}
                    </span>

                    <span
                        className="
                            rounded-full
                            border
                            border-[#eeeae1]/10
                            px-3
                            py-1
                            text-[9px]
                            uppercase
                            tracking-[0.12em]
                            text-[#eeeae1]/25
                        "
                    >
                        {issue.category || "Quality"}
                    </span>
                </div>

                <span
                    className="
                        font-mono
                        text-[9px]
                        tracking-[0.15em]
                        text-[#eeeae1]/15
                    "
                >
                    {String(index + 1).padStart(2, "0")}
                </span>
            </div>

            <h4
                className="
                    mt-5
                    text-xl
                    font-medium
                    tracking-[-0.025em]
                    text-[#eeeae1]/80
                "
            >
                {issue.title || "Untitled issue"}
            </h4>

            <div
                className="
                    mt-3
                    flex
                    flex-wrap
                    items-center
                    gap-2
                    font-mono
                    text-[10px]
                    text-[#eeeae1]/25
                "
            >
                <span>
                    {issue.file || "Unknown file"}
                </span>

                <span className="text-[#eeeae1]/10">
                    /
                </span>

                <span>
                    Line {Number(issue.line) || 0}
                </span>
            </div>

            <p
                className="
                    mt-6
                    max-w-4xl
                    text-sm
                    leading-7
                    text-[#eeeae1]/40
                "
            >
                {issue.description ||
                    "No description was provided."}
            </p>

            <div
                className="
                    mt-6
                    border-l
                    border-[#eeeae1]/15
                    bg-[#eeeae1]/[0.025]
                    px-5
                    py-4
                "
            >
                <p
                    className="
                        mb-2
                        text-[9px]
                        uppercase
                        tracking-[0.18em]
                        text-[#eeeae1]/25
                    "
                >
                    Suggested fix
                </p>

                <p
                    className="
                        text-sm
                        leading-6
                        text-[#eeeae1]/45
                    "
                >
                    {issue.suggestedFix ||
                        "No suggested fix was provided."}
                </p>
            </div>
        </div>
    );
}

function RecommendationCard({
    recommendation,
    index,
}) {
    return (
        <div
            className="
                group
                flex
                items-start
                gap-5
                rounded-xl
                border
                border-[#eeeae1]/10
                bg-[#111110]/35
                p-5
                transition-all
                duration-300
                hover:border-[#eeeae1]/20
                sm:p-6
            "
        >
            <span
                className="
                    shrink-0
                    font-mono
                    text-[9px]
                    tracking-[0.15em]
                    text-[#eeeae1]/20
                "
            >
                {String(index + 1).padStart(2, "0")}
            </span>

            <p
                className="
                    text-sm
                    leading-7
                    text-[#eeeae1]/40
                    transition-colors
                    duration-300
                    group-hover:text-[#eeeae1]/60
                "
            >
                {recommendation}
            </p>
        </div>
    );
}

export default ReviewResult;