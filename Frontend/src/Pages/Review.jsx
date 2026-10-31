import React, {
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import axios from "axios";
import gsap from "gsap";

import Sidebar from "../components/Sidebar";
import RepoInput from "../components/RepoInput";
import Loading from "../components/Loading";
import ReviewResult from "../components/ReviewResult";
import { Link } from "react-router-dom";

// ============================================================
// CONFIG
// ============================================================

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const FREE_REVIEW_LIMIT = 4;


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

// ============================================================
// ARROW ICON
// ============================================================

const ArrowLeftIcon = ({ size = 17 }) => (
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
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
    </svg>
);

// ============================================================
// LOCK ICON
// ============================================================

const LockIcon = ({ size = 20 }) => (
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
        <rect
            x="4"
            y="10"
            width="16"
            height="11"
            rx="2"
        />

        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
);

// ============================================================
// SPARK ICON
// ============================================================

const SparkIcon = ({ size = 19 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z" />
        <path d="M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16z" />
    </svg>
);

// ============================================================
// CLOSE ICON
// ============================================================

const CloseIcon = ({ size = 18 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
    >
        <path d="M6 6l12 12" />
        <path d="M18 6L6 18" />
    </svg>
);

// ============================================================
// REVIEW PAGE
// ============================================================

const Review = () => {
    // ==========================================================
    // REFS
    // ==========================================================

    const pageRef = useRef(null);
    const heroRef = useRef(null);
    const resultRef = useRef(null);

    const authPopupRef = useRef(null);
    const upgradePopupRef = useRef(null);

    // ==========================================================
    // STATE
    // ==========================================================

    const [repoUrl, setRepoUrl] = useState("");

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

    const [error, setError] = useState("");

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [user, setUser] = useState(null);

    const [reviewCount, setReviewCount] = useState(0);

    const [history, setHistory] = useState([]);

    const [sidebarWidth, setSidebarWidth] = useState(280);

    const [authPopup, setAuthPopup] = useState(false);

    const [upgradePopup, setUpgradePopup] = useState(false);

    // ==========================================================
    // GITHUB ISSUES POPUP
    // ==========================================================

    const [reviewId, setReviewId] = useState(null);
    const [githubPopup, setGithubPopup] = useState(false);
    const [githubCreating, setGithubCreating] = useState(false);
    const [githubIssuesCreated, setGithubIssuesCreated] = useState(false);
    const [githubCreatedIssues, setGithubCreatedIssues] = useState([]);
    const githubIssuesRef = useRef(null);

    // ==========================================================
    // GET TOKEN
    // ==========================================================

    const getToken = () => {
        return localStorage.getItem("codelens_token");
    };

    // ==========================================================
    // CLEAR AUTH DATA
    // ==========================================================

    const clearAuthData = () => {
        localStorage.removeItem("codelens_token");
        localStorage.removeItem("codelens_user");

        setIsLoggedIn(false);
        setUser(null);
        setReviewCount(0);
        setHistory([]);
    };

    // ==========================================================
    // CHECK AUTH
    // ==========================================================

    const checkAuthentication = useCallback(async () => {
        const token = getToken();

        if (!token) {
            setIsLoggedIn(false);
            setUser(null);
            setReviewCount(0);
            return null;
        }

        try {
            const response = await axios.get(
                `${API_URL}/api/auth/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (
                response.data?.success &&
                response.data?.user
            ) {
                const currentUser =
                    response.data.user;

                setIsLoggedIn(true);
                setUser(currentUser);

                setReviewCount(
                    currentUser.reviewsUsed || 0
                );

                localStorage.setItem(
                    "codelens_user",
                    JSON.stringify(currentUser)
                );

                return currentUser;
            }

            return null;
        } catch (err) {
            console.error(
                "Authentication check failed:",
                err
            );

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {
                clearAuthData();
            }

            return null;
        }
    }, []);

    // ==========================================================
    // FETCH HISTORY
    // ==========================================================

    const fetchHistory = useCallback(async () => {
        const token = getToken();

        if (!token) {
            return;
        }

        try {
            const response = await axios.get(
                `${API_URL}/api/review/history`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data?.success) {
                setHistory(
                    response.data.reviews || []
                );
            }
        } catch (err) {
            console.error(
                "Unable to fetch review history:",
                err
            );

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {
                clearAuthData();
            }
        }
    }, []);

    // ==========================================================
    // INITIAL LOAD
    // ==========================================================

    useLayoutEffect(() => {
        let mounted = true;

        const initialize = async () => {
            if (!mounted) return;

            const currentUser =
                await checkAuthentication();

            if (
                currentUser &&
                mounted
            ) {
                await fetchHistory();
            }
        };

        initialize();

        return () => {
            mounted = false;
        };
    }, [
        checkAuthentication,
        fetchHistory,
    ]);

    // ==========================================================
    // PAGE INTRO ANIMATION
    // ==========================================================

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                heroRef.current,
                {
                    opacity: 0,
                    y: 25,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "power3.out",
                }
            );
        }, pageRef);

        return () => ctx.revert();
    }, []);

    // ==========================================================
    // RESULT ANIMATION
    // ==========================================================

    useLayoutEffect(() => {
        if (!result) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                resultRef.current,
                {
                    opacity: 0,
                    y: 25,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power3.out",
                }
            );
        }, pageRef);

        return () => ctx.revert();
    }, [result]);

    // ==========================================================
    // AUTH POPUP ANIMATION
    // ==========================================================

    useLayoutEffect(() => {
        if (!authPopup) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                authPopupRef.current,
                {
                    opacity: 0,
                    scale: 0.94,
                    y: 15,
                },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.35,
                    ease: "power3.out",
                }
            );
        });

        return () => ctx.revert();
    }, [authPopup]);

    // ==========================================================
    // UPGRADE POPUP ANIMATION
    // ==========================================================

    useLayoutEffect(() => {
        if (!upgradePopup) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                upgradePopupRef.current,
                {
                    opacity: 0,
                    scale: 0.94,
                    y: 15,
                },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.35,
                    ease: "power3.out",
                }
            );
        });

        return () => ctx.revert();
    }, [upgradePopup]);

    // ==========================================================
    // AUTH REDIRECT
    // ==========================================================

    const goToLogin = () => {
        window.location.href = "/login";
    };

    const goToSignup = () => {
        window.location.href = "/signup";
    };

    // ==========================================================
    // CAN REVIEW?
    // ==========================================================

    const canReview = () => {
        // User is not logged in
        if (!isLoggedIn) {
            setAuthPopup(true);
            return false;
        }

        // Free limit reached
        if (
            user?.plan === "free" &&
            reviewCount >= FREE_REVIEW_LIMIT
        ) {
            setUpgradePopup(true);
            return false;
        }

        return true;
    };

    // ==========================================================
    // REVIEW REPOSITORY
    // ==========================================================

    const handleReview = async () => {
        setError("");

        // Empty URL
        if (!repoUrl.trim()) {
            setError(
                "Please enter a GitHub repository URL."
            );
            return;
        }

        // Authentication / limit
        if (!canReview()) {
            return;
        }

        const token = getToken();

        if (!token) {
            setIsLoggedIn(false);
            setAuthPopup(true);
            return;
        }

        try {
            setLoading(true);
            setResult(null);

            const response = await axios.post(
                `${API_URL}/api/review`,
                {
                    repoUrl: repoUrl.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                }
            );

            if (response.data?.success) {
                // ======================================================
                // SAVE RESULT
                // ======================================================

                const reviewResult = response.data.result;
                const currentReviewId = response.data.reviewId;

                setReviewId(currentReviewId);
                setGithubIssuesCreated(false);
                setGithubCreatedIssues([]);

                console.log("========== REVIEW RESPONSE ==========");
                console.log("Full response:", response.data);
                console.log("Review result:", reviewResult);
                console.log(
                    "GitHub candidates:",
                    reviewResult?.githubCandidates
                );
                console.log("====================================");

                setResult(reviewResult);

                // Show GitHub Issues popup when critical candidates exist
                const githubCandidates =
                    response.data?.githubCandidates ||
                    response.data?.github_candidates ||
                    reviewResult?.githubCandidates ||
                    reviewResult?.github_candidates ||
                    [];

                if (githubCandidates.length > 0) {
                    setGithubPopup(true);
                }

                // ======================================================
                // UPDATE USAGE
                // ======================================================

                if (response.data.usage) {
                    setReviewCount(
                        response.data.usage.used || 0
                    );
                } else {
                    setReviewCount(
                        (prev) => prev + 1
                    );
                }

                // ======================================================
                // UPDATE LOCAL USER
                // ======================================================

                setUser((prev) => {
                    if (!prev) return prev;

                    const updatedUser = {
                        ...prev,
                        reviewsUsed:
                            response.data.usage
                                ?.used ??
                            (prev.reviewsUsed || 0) + 1,
                    };

                    localStorage.setItem(
                        "codelens_user",
                        JSON.stringify(
                            updatedUser
                        )
                    );

                    return updatedUser;
                });

                // ======================================================
                // REFRESH HISTORY
                // ======================================================

                fetchHistory().catch((err) => {
                    console.error(
                        "Unable to refresh review history:",
                        err
                    );
                });

                // ======================================================
                // SCROLL TO RESULT
                // ======================================================

                setTimeout(() => {
                    resultRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }, 100);
            }
        } catch (err) {
            console.error(
                "Repository review failed:",
                err
            );

            // ======================================================
            // UNAUTHORIZED
            // ======================================================

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {
                clearAuthData();
                setAuthPopup(true);
                return;
            }

            // ======================================================
            // REVIEW LIMIT
            // ======================================================

            if (
                err.response?.status === 402 ||
                err.response?.data?.code ===
                "REVIEW_LIMIT_REACHED"
            ) {
                setUpgradePopup(true);
                return;
            }

            // ======================================================
            // SERVER ERROR
            // ======================================================

            if (
                err.response?.data?.message
            ) {
                setError(
                    err.response.data.message
                );
            } else if (
                err.request
            ) {
                setError(
                    "Unable to connect to CodeLens server."
                );
            } else {
                setError(
                    "Something went wrong while reviewing the repository."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // ==========================================================
    // OPEN HISTORY ITEM
    // ==========================================================

    const handleOpenHistory = async (
        item
    ) => {
        if (!item?._id) return;

        const token = getToken();

        if (!token) {
            setAuthPopup(true);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/api/review/${item._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (
                response.data?.success &&
                response.data?.review
            ) {
                const review =
                    response.data.review;

                setRepoUrl(
                    review.repoUrl || ""
                );

                setResult(
                    review.result
                );

                setTimeout(() => {
                    resultRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }, 100);
            }
        } catch (err) {
            console.error(
                "Unable to open review:",
                err
            );

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {
                clearAuthData();
                setAuthPopup(true);
                return;
            }

            setError(
                err.response?.data?.message ||
                "Unable to load this review."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================================
    // GITHUB ISSUES POPUP
    // ==========================================================

    const handleReviewGithubIssues = () => {
        setGithubPopup(false);

        setTimeout(() => {
            githubIssuesRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 150);
    };

    // ==========================================================
    // CREATE GITHUB ISSUES
    // ==========================================================

    const handleAddIssuesToGithub = async () => {
        if (!reviewId) {
            setError("Review ID is missing.");
            return;
        }

        if (githubCreating || githubIssuesCreated) {
            return;
        }

        const token = getToken();

        if (!token) {
            setIsLoggedIn(false);
            setAuthPopup(true);
            return;
        }

        try {
            setGithubCreating(true);
            setError("");

            const response = await axios.post(
                `${API_URL}/api/review/${reviewId}/github-issues`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data?.success) {
                console.log(
                    "GitHub issues created:",
                    response.data.issues
                );

                setGithubCreatedIssues(
                    response.data.issues || []
                );

                setGithubIssuesCreated(true);
            }
        } catch (err) {
            console.error(
                "Failed to create GitHub issues:",
                err.response?.data || err.message
            );

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {
                clearAuthData();
                setAuthPopup(true);
                return;
            }

            setError(
                err.response?.data?.message ||
                "Unable to create GitHub issues."
            );
        } finally {
            setGithubCreating(false);
        }
    };

    // ==========================================================
    // NEW REVIEW
    // ==========================================================

    const handleNewReview = () => {
        setResult(null);
        setError("");
        setRepoUrl("");
        setReviewId(null);
        setGithubPopup(false);
        setGithubCreating(false);
        setGithubIssuesCreated(false);
        setGithubCreatedIssues([]);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ==========================================================
    // UPGRADE
    // ==========================================================

    const handleUpgrade = () => {
        setUpgradePopup(true);
    };

    // ==========================================================
    // CLOSE POPUPS
    // ==========================================================

    const closeAuthPopup = () => {
        setAuthPopup(false);
    };

    const closeUpgradePopup = () => {
        setUpgradePopup(false);
    };

    // ==========================================================
    // HANDLE ENTER
    // ==========================================================

    const handleKeyDown = (event) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !loading
        ) {
            event.preventDefault();
            handleReview();
        }
    };

    // ==========================================================
    // RENDER
    // ==========================================================

    return (
        <div
            ref={pageRef}
            className="
        min-h-screen
        bg-[#131310]
        text-[#eeeae1]
        overflow-x-hidden
      "
        >
            {/* ======================================================
          BACKGROUND GRID
      ======================================================= */}

            <div
                className="
          pointer-events-none
          fixed
          inset-0
          opacity-[0.035]
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

            {/* ======================================================
          TOP GLOW
      ======================================================= */}

            <div
                className="
          pointer-events-none
          fixed
          top-0
          left-1/2
          -translate-x-1/2
          w-[700px]
          h-[350px]
          rounded-full
          bg-white/[0.025]
          blur-[120px]
        "
            />

            {/* ======================================================
          SIDEBAR
      ======================================================= */}

            {isLoggedIn && (
                <Sidebar
                    user={user}
                    reviewCount={reviewCount}
                    history={history}
                    freeReviewLimit={
                        FREE_REVIEW_LIMIT
                    }
                    onOpenHistory={
                        handleOpenHistory
                    }
                    onUpgrade={handleUpgrade}
                    onWidthChange={
                        setSidebarWidth
                    }
                />
            )}

            {/* ======================================================
          MOBILE TOP BAR
      ======================================================= */}

            <div
                className="
          lg:hidden
          fixed
          top-0
          left-0
          right-0
          z-40
          h-[64px]
          px-5
          flex
          items-center
          justify-between
          bg-[#080b09]/90
          backdrop-blur-xl
          border-b
          border-white/[0.06]
        "
            >
                <Link
                    to="/"
                    className="
            text-[19px]
            font-medium
            tracking-[-0.05em]
            text-[#eeeae1]
            no-underline
          "
                >
                    C<Lens />
                    <span>delens</span>
                </Link>

                {!isLoggedIn ? (
                    <button
                        onClick={goToLogin}
                        className="
              text-[12px]
              text-white/55
              hover:text-white
              transition
            "
                    >
                        Login
                    </button>
                ) : (
                    <button
                        onClick={handleNewReview}
                        className="
              w-9
              h-9
              rounded-lg
              border
              border-white/[0.08]
              flex
              items-center
              justify-center
              text-white/60
            "
                    >
                        +
                    </button>
                )}
            </div>

            {/* ======================================================
    MAIN
======================================================= */}

            <main
                className="
        relative
        min-h-screen
        transition-[margin]
        duration-300
        ease-out
        pt-[64px]
        lg:pt-0
    "
                style={{
                    marginLeft:
                        isLoggedIn
                            ? `${sidebarWidth}px`
                            : "0px",
                }}
            >

                {/* ====================================================
        NORMAL REVIEW SCREEN
    ===================================================== */}

                {!loading && !result && (
                    <section
                        ref={heroRef}
                        className="
                min-h-screen
                flex
                items-center
                justify-center
                px-5
                sm:px-8
                lg:px-12
                py-20
            "
                    >
                        <div
                            className="
                    w-full
                    max-w-[900px]
                    mx-auto
                "
                        >

                            {/* Small label */}

                            <div
                                className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        mb-7
                        text-[10px]
                        uppercase
                        tracking-[0.22em]
                        text-white/30
                    "
                            >
                                <span
                                    className="
                            w-1.5
                            h-1.5
                            rounded-full
                            bg-white/45
                        "
                                />

                                AI CODE REVIEW
                            </div>


                            {/* Heading */}

                            <h1
                                className="
                        text-center
                        font-medium
                        tracking-[-0.055em]
                        leading-[0.95]
                        text-[48px]
                        sm:text-[64px]
                        lg:text-[82px]
                        text-[#eeeae1]
                    "
                            >
                                Review your code.
                                <br />

                                <span className="text-white/25">
                                    Find what you missed.
                                </span>
                            </h1>


                            {/* Description */}

                            <p
                                className="
                        max-w-[590px]
                        mx-auto
                        mt-7
                        text-center
                        text-[14px]
                        sm:text-[15px]
                        leading-7
                        text-white/38
                    "
                            >
                                Give CodeLens a repository and
                                let three specialized AI agents
                                inspect it for bugs, security
                                vulnerabilities, and code quality
                                issues.
                            </p>


                            {/* Repo Input */}

                            <div className="mt-12">

                                <RepoInput
                                    repoUrl={repoUrl}
                                    setRepoUrl={setRepoUrl}
                                    handleReview={handleReview}
                                    loading={loading}
                                />

                            </div>


                            {/* Error */}

                            {error && (
                                <div
                                    className="
                            mt-4
                            mx-auto
                            max-w-[700px]
                            rounded-xl
                            border
                            border-red-400/10
                            bg-red-400/[0.035]
                            px-4
                            py-3
                            text-center
                            text-[12px]
                            text-red-300/75
                        "
                                >
                                    {error}
                                </div>
                            )}


                            {/* Info */}

                            <div
                                className="
                        mt-6
                        flex
                        flex-wrap
                        items-center
                        justify-center
                        gap-x-6
                        gap-y-2
                        text-[10px]
                        uppercase
                        tracking-[0.12em]
                        text-white/22
                    "
                            >

                                <span>
                                    No installation
                                </span>

                                <span className="text-white/10">
                                    •
                                </span>

                                <span>
                                    AI powered
                                </span>

                                <span className="text-white/10">
                                    •
                                </span>

                                <span>
                                    {isLoggedIn
                                        ? `${reviewCount}/${FREE_REVIEW_LIMIT} free reviews`
                                        : "Login required"}
                                </span>

                            </div>

                        </div>
                    </section>
                )}


                {/* ====================================================
        FULL SCREEN LOADING
    ===================================================== */}

                {loading && (
                    <section
                        className="
                min-h-screen
                flex
                items-center
                justify-center
                px-5
                sm:px-8
                lg:px-12
            "
                    >

                        <div
                            className="
                    w-full
                    max-w-[700px]
                    mx-auto
                "
                        >

                            <Loading />

                        </div>

                    </section>
                )}


                {/* ====================================================
        FULL SCREEN RESULT
    ===================================================== */}

                {result && !loading && (
                    <section
                        ref={resultRef}
                        className="
                min-h-screen
                px-5
                sm:px-8
                lg:px-12
                py-12
                lg:py-16
            "
                    >

                        <div
                            className="
                    max-w-[1100px]
                    mx-auto
                "
                        >

                            {/* Result header */}

                            <div
                                className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-end
                        justify-between
                        gap-5
                        mb-8
                    "
                            >

                                <div>

                                    <div
                                        className="
                                flex
                                items-center
                                gap-2
                                mb-3
                                text-[10px]
                                uppercase
                                tracking-[0.18em]
                                text-white/25
                            "
                                    >

                                        <SparkIcon size={14} />

                                        REVIEW COMPLETE

                                    </div>


                                    <h2
                                        className="
                                text-[30px]
                                sm:text-[38px]
                                tracking-[-0.04em]
                                font-medium
                            "
                                    >
                                        CodeLens report
                                    </h2>


                                    <p
                                        className="
                                mt-2
                                max-w-[650px]
                                truncate
                                text-[12px]
                                text-white/30
                            "
                                    >
                                        {repoUrl}
                                    </p>

                                </div>


                                {/* New review */}

                                <button
                                    type="button"
                                    onClick={handleNewReview}
                                    className="
                            shrink-0
                            h-10
                            px-4
                            rounded-xl
                            border
                            border-white/[0.09]
                            bg-white/[0.025]
                            flex
                            items-center
                            justify-center
                            gap-2
                            text-[12px]
                            text-white/55
                            hover:text-white
                            hover:bg-white/[0.055]
                            transition-all
                        "
                                >

                                    <ArrowLeftIcon size={15} />

                                    New review

                                </button>

                            </div>


                            {/* Actual ReviewResult */}

                            <ReviewResult
                                result={result}
                            />

                            {/* ======================================================
                                GITHUB ISSUES SECTION
                            ======================================================= */}

                            {(
                                result?.githubCandidates?.length > 0 ||
                                result?.github_candidates?.length > 0
                            ) && (
                                    <div
                                        ref={githubIssuesRef}
                                        className="
                                        mt-12
                                        rounded-2xl
                                        border
                                        border-white/[0.08]
                                        bg-white/[0.02]
                                        p-6
                                        sm:p-7
                                    "
                                    >
                                        <div>
                                            <div
                                                className="
                                                text-[10px]
                                                uppercase
                                                tracking-[0.18em]
                                                text-white/25
                                            "
                                            >
                                                GitHub Issues
                                            </div>

                                            <h3
                                                className="
                                                mt-2
                                                text-[22px]
                                                font-medium
                                                tracking-[-0.03em]
                                            "
                                            >
                                                Critical issues found
                                            </h3>

                                            <p
                                                className="
                                                mt-2
                                                text-[13px]
                                                leading-6
                                                text-white/35
                                            "
                                            >
                                                CodeLens found critical findings
                                                that can be added to your GitHub
                                                repository as issues.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            disabled={
                                                githubCreating ||
                                                githubIssuesCreated
                                            }
                                            className={`
                                            mt-6
                                            w-full
                                            h-11
                                            rounded-xl
                                            text-[12px]
                                            font-medium
                                            transition
                                            ${
                                                githubIssuesCreated
                                                    ? "bg-white/10 text-white/40 cursor-not-allowed"
                                                    : githubCreating
                                                    ? "bg-white/10 text-white/40 cursor-wait"
                                                    : "bg-[#eeeae1] text-[#080b09] hover:bg-white"
                                            }
                                        `}
                                            onClick={handleAddIssuesToGithub}
                                        >
                                            {githubCreating
                                                ? "Creating GitHub Issues..."
                                                : githubIssuesCreated
                                                ? "Issues Added to GitHub"
                                                : "Add Issues to GitHub"}
                                        </button>

                                        {githubIssuesCreated &&
                                            githubCreatedIssues.length > 0 && (
                                                <div className="mt-5 space-y-2">
                                                    <div className="text-[10px] uppercase tracking-[0.15em] text-white/25">
                                                        Created Issues
                                                    </div>

                                                    {githubCreatedIssues.map((issue) => (
                                                        <a
                                                            key={issue.number}
                                                            href={issue.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="
                                                                block
                                                                rounded-xl
                                                                border
                                                                border-white/[0.07]
                                                                bg-white/[0.025]
                                                                px-4
                                                                py-3
                                                                text-[12px]
                                                                text-white/60
                                                                hover:text-white
                                                                hover:bg-white/[0.05]
                                                                transition
                                                            "
                                                        >
                                                            #{issue.number} · {issue.title}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                    </div>
                                )}

                        </div>

                    </section>
                )}


                {/* ====================================================
        FOOTER
    ===================================================== */}

                {!result && !loading && (
                    <div
                        className="
                pb-8
                text-center
                text-[10px]
                uppercase
                tracking-[0.15em]
                text-white/15
            "
                    >
                        CodeLens · AI-powered code review
                    </div>
                )}

            </main>
            {/* ======================================================
          GITHUB ISSUES POPUP
      ======================================================= */}

            {githubPopup && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[110]
                        flex
                        items-center
                        justify-center
                        p-5
                    "
                >
                    {/* Overlay */}
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={() => setGithubPopup(false)}
                        className="
                            absolute
                            inset-0
                            bg-[#121213]/65
                            backdrop-blur-sm
                            cursor-default
                        "
                    />

                    {/* Modal */}
                    <div
                        className="
                            relative
                            w-full
                            max-w-[460px]
                            rounded-[26px]
                            border
                            border-white/[0.09]
                            bg-[#0c100e]
                            shadow-2xl
                            p-7
                            sm:p-8
                        "
                    >
                        {/* Close */}
                        <button
                            type="button"
                            onClick={() => setGithubPopup(false)}
                            className="
                                absolute
                                top-4
                                right-4
                                w-8
                                h-8
                                rounded-lg
                                flex
                                items-center
                                justify-center
                                text-white/30
                                hover:text-white
                                hover:bg-white/[0.05]
                                transition
                            "
                        >
                            <CloseIcon size={16} />
                        </button>

                        {/* Icon */}
                        <div
                            className="
                                w-12
                                h-12
                                rounded-2xl
                                border
                                border-white/[0.08]
                                bg-white/[0.035]
                                flex
                                items-center
                                justify-center
                                text-white/75
                                mb-5
                            "
                        >
                            <SparkIcon size={21} />
                        </div>

                        <div
                            className="
                                text-[10px]
                                uppercase
                                tracking-[0.18em]
                                text-white/25
                            "
                        >
                            CodeLens found critical issues
                        </div>

                        <h3
                            className="
                                mt-2
                                text-[27px]
                                font-medium
                                tracking-[-0.04em]
                            "
                        >
                            Create GitHub Issues?
                        </h3>

                        <p
                            className="
                                mt-3
                                text-[13px]
                                leading-6
                                text-white/35
                            "
                        >
                            CodeLens found critical issues that can be
                            added to your GitHub repository as issues.
                        </p>

                        {/* Buttons */}
                        <div className="mt-7 space-y-2.5">
                            <button
                                type="button"
                                onClick={handleReviewGithubIssues}
                                className="
                                    w-full
                                    h-11
                                    rounded-xl
                                    bg-[#eeeae1]
                                    text-[#080b09]
                                    text-[12px]
                                    font-medium
                                    hover:bg-white
                                    transition
                                "
                            >
                                Review GitHub Issues
                            </button>

                            <button
                                type="button"
                                onClick={() => setGithubPopup(false)}
                                className="
                                    w-full
                                    h-11
                                    rounded-xl
                                    border
                                    border-white/[0.09]
                                    bg-white/[0.025]
                                    text-white/60
                                    text-[12px]
                                    hover:text-white
                                    hover:bg-white/[0.05]
                                    transition
                                "
                            >
                                Maybe later
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================
          AUTH POPUP
      ======================================================= */}

            {authPopup && (
                <div
                    className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            p-5
          "
                >
                    {/* Overlay */}

                    <button
                        type="button"
                        aria-label="Close"
                        onClick={closeAuthPopup}
                        className="
              absolute
              inset-0
              bg-[#121213]/65
              backdrop-blur-sm
              cursor-default
            "
                    />

                    {/* Modal */}

                    <div
                        ref={authPopupRef}
                        className="
              relative
              w-full
              max-w-[430px]
              rounded-[24px]
              border
              border-white/[0.09]
              bg-[#0c100e]
              shadow-2xl
              p-7
              sm:p-8
            "
                    >
                        {/* Close */}

                        <button
                            type="button"
                            onClick={closeAuthPopup}
                            className="
                absolute
                top-4
                right-4
                w-8
                h-8
                rounded-lg
                flex
                items-center
                justify-center
                text-white/30
                hover:text-white
                hover:bg-white/[0.05]
                transition
              "
                        >
                            <CloseIcon size={16} />
                        </button>

                        {/* Icon */}

                        <div
                            className="
                w-12
                h-12
                rounded-2xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                flex
                items-center
                justify-center
                text-white/70
                mb-5
              "
                        >
                            <LockIcon size={20} />
                        </div>

                        <h3
                            className="
                text-[25px]
                font-medium
                tracking-[-0.035em]
              "
                        >
                            Login to review
                        </h3>

                        <p
                            className="
                mt-3
                text-[13px]
                leading-6
                text-white/35
              "
                        >
                            Create a CodeLens account or
                            login to start analyzing your
                            repositories.
                        </p>

                        {/* Buttons */}

                        <div className="mt-7 space-y-2.5">
                            <button
                                type="button"
                                onClick={goToLogin}
                                className="
                  w-full
                  h-11
                  rounded-xl
                  bg-[#eeeae1]
                  text-[#080b09]
                  text-[12px]
                  font-medium
                  hover:bg-white
                  transition
                "
                            >
                                Login
                            </button>

                            <button
                                type="button"
                                onClick={goToSignup}
                                className="
                  w-full
                  h-11
                  rounded-xl
                  border
                  border-white/[0.09]
                  bg-white/[0.025]
                  text-white/65
                  text-[12px]
                  hover:text-white
                  hover:bg-white/[0.05]
                  transition
                "
                            >
                                Create account
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================
          UPGRADE POPUP
      ======================================================= */}

            {upgradePopup && (
                <div
                    className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            p-5
          "
                >
                    {/* Overlay */}

                    <button
                        type="button"
                        aria-label="Close"
                        onClick={closeUpgradePopup}
                        className="
              absolute
              inset-0
              bg-[#121213]/65
              backdrop-blur-sm
              cursor-default
            "
                    />

                    {/* Modal */}

                    <div
                        ref={upgradePopupRef}
                        className="
              relative
              w-full
              max-w-[470px]
              rounded-[26px]
              border
              border-white/[0.09]
              bg-[#0c100e]
              shadow-2xl
              p-7
              sm:p-8
            "
                    >
                        {/* Close */}

                        <button
                            type="button"
                            onClick={closeUpgradePopup}
                            className="
                absolute
                top-4
                right-4
                w-8
                h-8
                rounded-lg
                flex
                items-center
                justify-center
                text-white/30
                hover:text-white
                hover:bg-white/[0.05]
                transition
              "
                        >
                            <CloseIcon size={16} />
                        </button>

                        {/* Icon */}

                        <div
                            className="
                w-12
                h-12
                rounded-2xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                flex
                items-center
                justify-center
                text-white/75
                mb-5
              "
                        >
                            <SparkIcon size={21} />
                        </div>

                        <div
                            className="
                text-[10px]
                uppercase
                tracking-[0.18em]
                text-white/25
              "
                        >
                            Free plan
                        </div>

                        <h3
                            className="
                mt-2
                text-[27px]
                font-medium
                tracking-[-0.04em]
              "
                        >
                            You've used all 4 reviews.
                        </h3>

                        <p
                            className="
                mt-3
                text-[13px]
                leading-6
                text-white/35
              "
                        >
                            Upgrade to CodeLens Pro to
                            continue reviewing repositories
                            without the free-plan limit.
                        </p>

                        {/* Pricing */}

                        <div
                            className="
                mt-6
                rounded-2xl
                border
                border-white/[0.07]
                bg-white/[0.025]
                p-5
              "
                        >
                            <div
                                className="
                  flex
                  items-end
                  justify-between
                "
                            >
                                <div>
                                    <div
                                        className="
                      text-[11px]
                      uppercase
                      tracking-[0.15em]
                      text-white/30
                    "
                                    >
                                        CodeLens Pro
                                    </div>

                                    <div
                                        className="
                      mt-2
                      text-[31px]
                      font-medium
                      tracking-[-0.04em]
                    "
                                    >
                                        $20
                                    </div>
                                </div>

                                <div
                                    className="
                    text-[11px]
                    text-white/25
                  "
                                >
                                    one-time
                                </div>
                            </div>
                        </div>

                        {/* Upgrade */}

                        <button
                            type="button"
                            onClick={() => {
                                /*
                                  PAYMENT WILL BE CONNECTED HERE.
                
                                  Production flow:
                
                                  1. Frontend calls Node backend.
                                  2. Node creates Stripe/Razorpay order.
                                  3. User completes payment.
                                  4. Payment provider webhook reaches backend.
                                  5. Backend verifies payment.
                                  6. Backend changes:
                                       user.plan = "pro"
                                  7. User can review again.
                                */

                                alert(
                                    "Payment integration coming next."
                                );
                            }}
                            className="
                mt-5
                w-full
                h-12
                rounded-xl
                bg-[#eeeae1]
                text-[#080b09]
                text-[12px]
                font-medium
                hover:bg-white
                transition
              "
                        >
                            Upgrade for $20
                        </button>

                        <div
                            className="
                mt-3
                text-center
                text-[10px]
                text-white/20
              "
                        >
                            Secure payment · Unlimited
                            repository reviews
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Review;