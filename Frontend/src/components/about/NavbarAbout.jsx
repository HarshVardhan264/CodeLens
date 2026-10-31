import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import { Link } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";

/* =========================================================
   LENS ICON
========================================================= */

export const Lens = ({ size = "0.78em" }) => (
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

/* =========================================================
   ARROW ICON
========================================================= */

export const ArrowTile = () => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M2 10L10 2M10 2H3.5M10 2V8.5"
            stroke="currentColor"
            strokeWidth="1.6"
        />
    </svg>
);

/* =========================================================
   PROFILE ICON
========================================================= */

const ProfileIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <circle
            cx="12"
            cy="8"
            r="3.5"
            stroke="currentColor"
            strokeWidth="1.7"
        />

        <path
            d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
        />
    </svg>
);

/* =========================================================
   PLUS ICON
========================================================= */

const PlusIcon = ({ size = 16 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
    >
        <path d="M12 5v14" />
        <path d="M5 12h14" />
    </svg>
);

/* =========================================================
   LOGOUT ICON
========================================================= */

const LogoutIcon = ({ size = 16 }) => (
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
        <path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
        <path d="M15 16l4-4-4-4" />
        <path d="M19 12H9" />
    </svg>
);

/* =========================================================
   ARROW UP ICON
========================================================= */

const ArrowUpIcon = ({ size = 15 }) => (
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
        <path d="M12 19V5" />
        <path d="m6 11 6-6 6 6" />
    </svg>
);

/* =========================================================
   NAVBAR
========================================================= */

const Navbar = () => {
    const [solid, setSolid] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    /* =======================================================
       AUTH STATE
    ======================================================= */

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    /* =======================================================
       PROFILE DROPDOWN
    ======================================================= */

    const [profileOpen, setProfileOpen] = useState(false);

    /* =======================================================
       REVIEW USAGE
    ======================================================= */

    const FREE_REVIEW_LIMIT = 4;

    const reviewCount = Number(
        user?.reviewsUsed || 0
    );

    const remaining = Math.max(
        0,
        FREE_REVIEW_LIMIT - reviewCount
    );

    /* =======================================================
       GSAP REFS
    ======================================================= */

    const menuRef = useRef(null);
    const overlayRef = useRef(null);
    const menuHeaderRef = useRef(null);
    const menuFooterRef = useRef(null);

    const menuItemsRef = useRef([]);

    /* =======================================================
       CHECK AUTHENTICATION
    ======================================================= */

    useEffect(() => {
        let mounted = true;

        const checkAuthentication = async () => {
            const token =
                localStorage.getItem("codelens_token");

            if (!token) {
                if (mounted) {
                    setIsLoggedIn(false);
                    setUser(null);
                }

                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/me`,
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

                    if (!mounted) return;

                    setIsLoggedIn(true);
                    setUser(currentUser);

                    /*
                      Keep the latest backend user
                      information locally.
                    */

                    localStorage.setItem(
                        "codelens_user",
                        JSON.stringify(currentUser)
                    );
                }
            } catch (error) {
                console.error(
                    "Authentication check failed:",
                    error.response?.data ||
                    error.message
                );

                /*
                  JWT is invalid/expired.
                  Remove the local session.
                */

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    localStorage.removeItem(
                        "codelens_token"
                    );

                    localStorage.removeItem(
                        "codelens_user"
                    );

                    if (mounted) {
                        setIsLoggedIn(false);
                        setUser(null);
                    }
                }
            }
        };

        checkAuthentication();

        return () => {
            mounted = false;
        };
    }, []);

    /* =======================================================
       SCROLL DETECTION
    ======================================================= */

    useEffect(() => {
        const onScroll = () => {
            setSolid(
                window.scrollY >
                window.innerHeight * 0.7
            );
        };

        onScroll();

        window.addEventListener(
            "scroll",
            onScroll,
            {
                passive: true,
            }
        );

        return () => {
            window.removeEventListener(
                "scroll",
                onScroll
            );
        };
    }, []);

    /* =======================================================
       LOCK BODY WHEN MENU OPEN
    ======================================================= */

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow =
                "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    /* =======================================================
       INITIAL GSAP STATE
    ======================================================= */

    useLayoutEffect(() => {
        const menu = menuRef.current;
        const overlay = overlayRef.current;

        if (!menu || !overlay) return;

        gsap.set(menu, {
            xPercent: 100,
        });

        gsap.set(overlay, {
            opacity: 0,
            pointerEvents: "none",
        });

        gsap.set(menuHeaderRef.current, {
            opacity: 0,
            x: 30,
        });

        gsap.set(menuFooterRef.current, {
            opacity: 0,
            y: 10,
        });

        gsap.set(menuItemsRef.current, {
            opacity: 0,
            x: 40,
        });
    }, []);

    /* =======================================================
       MENU ANIMATION
    ======================================================= */

    useLayoutEffect(() => {
        const menu = menuRef.current;
        const overlay = overlayRef.current;

        if (!menu || !overlay) return;

        const items =
            menuItemsRef.current.filter(Boolean);

        gsap.killTweensOf([
            menu,
            overlay,
            menuHeaderRef.current,
            menuFooterRef.current,
            ...items,
        ]);

        /* =====================================================
           OPEN
        ===================================================== */

        if (menuOpen) {
            const tl = gsap.timeline();

            tl.to(
                overlay,
                {
                    opacity: 1,
                    duration: 0.45,
                    ease: "power2.out",
                    onStart: () => {
                        overlay.style.pointerEvents =
                            "auto";
                    },
                },
                0
            );

            tl.to(
                menu,
                {
                    xPercent: 0,
                    duration: 0.85,
                    ease: "power4.out",
                },
                0
            );

            tl.to(
                menuHeaderRef.current,
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    ease: "power3.out",
                },
                0.35
            );

            tl.to(
                items,
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.55,
                    stagger: 0.075,
                    ease: "power3.out",
                },
                0.4
            );

            tl.to(
                menuFooterRef.current,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out",
                },
                0.8
            );
        }

        /* =====================================================
           CLOSE
        ===================================================== */

        else {
            const tl = gsap.timeline();

            tl.to(
                items,
                {
                    opacity: 0,
                    x: 25,
                    duration: 0.22,
                    stagger: 0.025,
                    ease: "power2.in",
                },
                0
            );

            tl.to(
                menuHeaderRef.current,
                {
                    opacity: 0,
                    x: 20,
                    duration: 0.25,
                    ease: "power2.in",
                },
                0
            );

            tl.to(
                menuFooterRef.current,
                {
                    opacity: 0,
                    y: 8,
                    duration: 0.2,
                    ease: "power2.in",
                },
                0
            );

            tl.to(
                menu,
                {
                    xPercent: 100,
                    duration: 0.7,
                    ease: "power4.inOut",
                },
                0.08
            );

            tl.to(
                overlay,
                {
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.inOut",
                    onComplete: () => {
                        overlay.style.pointerEvents =
                            "none";
                    },
                },
                0.15
            );
        }
    }, [menuOpen]);

    /* =======================================================
       PROFILE ACTIONS
    ======================================================= */

    const handleTryForFree = () => {
        setProfileOpen(false);

        /*
          Pro users should always be allowed
          to continue reviewing.
        */

        if (
            user?.plan === "free" &&
            reviewCount >= FREE_REVIEW_LIMIT
        ) {
            window.dispatchEvent(
                new CustomEvent(
                    "codelens:upgrade"
                )
            );

            return;
        }

        /*
          User still has free reviews.
        */

        window.location.href = "/review";
    };

    /* =======================================================
       LOGOUT
    ======================================================= */

    const handleLogout = () => {
        setProfileOpen(false);

        /*
          Current backend uses stateless JWT.
          There is no /logout endpoint yet,
          so simply remove the local JWT.
        */

        localStorage.removeItem(
            "codelens_token"
        );

        localStorage.removeItem(
            "codelens_user"
        );

        /*
          No isLoggedIn localStorage flag anymore.
        */

        setIsLoggedIn(false);
        setUser(null);

        window.location.href = "/login";
    };

    /* =======================================================
       TOP NAV VISIBILITY
    ======================================================= */

    const topVisibility = solid
        ? "pointer-events-none translate-y-[-10px] opacity-0"
        : "translate-y-0 opacity-100";

    return (
        <>
            {/* =====================================================
          NAVBAR
      ===================================================== */}

            <header className="fixed left-0 top-0 z-[1000] w-full">
                <div
                    className="
            grid
            h-[90px]
            w-full
            grid-cols-[1fr_auto_1fr]
            items-center
            px-[5.25vw]
          "
                >
                    {/* =================================================
              LOGO
          ================================================= */}

                    <Link
                        to="/"
                        className="cl-nav__mark !text-white"
                        aria-label="CodeLens home"
                    >
                        C<Lens />
                        <span>delens</span>
                    </Link>

                    {/* =================================================
              CENTER NAVIGATION
          ================================================= */}

                    <nav
                        className={`
              flex
              items-center
              gap-[34px]
              max-md:hidden
              transition-all
              duration-500
              ${topVisibility}
            `}
                    >

                       

                        <Link
                            to="/about"
                            className="
                text-[14px]
                font-medium
                tracking-[-0.02em]
                !text-[#eeeae1]
                no-underline
                transition-opacity
                duration-300
                hover:opacity-60
              "
                        >
                            About
                        </Link>

                         <Link
                            to="/contact"
                            className="
                text-[14px]
                font-medium
                tracking-[-0.02em]
                !text-[#eeeae1]
                no-underline
                transition-opacity
                duration-300
                hover:opacity-60
              "
                        >
                            Contact
                        </Link>

                        <Link
                            to="/pricing"
                            className="
                text-[14px]
                font-medium
                tracking-[-0.02em]
                !text-[#eeeae1]
                no-underline
                transition-opacity
                duration-300
                hover:opacity-60
              "
                        >
                            Price
                        </Link>
                    </nav>

                    {/* =================================================
              RIGHT SIDE
          ================================================= */}

                    <div className="flex items-center justify-end gap-3">

                        {/* =================================================
                LOGIN / SIGNUP
            ================================================= */}

                        {!isLoggedIn ? (
                            <>
                                {/* LOGIN */}

                                <Link
                                    to="/login"
                                    className={`
                    flex
                    h-[46px]
                    items-center
                    justify-center
                    whitespace-nowrap
                    px-[16px]
                    text-[14px]
                    font-medium
                    !text-[#eeeae1]
                    no-underline
                    transition-all
                    duration-500
                    hover:opacity-60
                    ${topVisibility}
                  `}
                                >
                                    <span className="!text-[#eeeae1]">
                                        Log in
                                    </span>
                                </Link>

                                {/* SIGN UP */}

                                <Link
                                    to="/signup"
                                    className={`
                    relative
                    z-[2]
                    flex
                    h-[46px]
                    min-w-[88px]
                    items-center
                    justify-center
                    whitespace-nowrap
                    bg-[#eeeae1]
                    px-[17px]
                    text-[14px]
                    font-medium
                    !text-[#0b0b0a]
                    no-underline
                    transition-all
                    duration-500
                    hover:opacity-80
                    ${topVisibility}
                  `}
                                >
                                    <span className="!text-[#0b0b0a]">
                                        Sign up
                                    </span>
                                </Link>
                            </>
                        ) : (
                            /* =================================================
                               PROFILE
                            ================================================= */

                            <div
                                className={`
                  relative
                  transition-all
                  duration-500
                  ${topVisibility}
                `}
                            >
                                {/* PROFILE BUTTON */}

                                <button
                                    type="button"
                                    aria-label="Open profile"
                                    aria-expanded={
                                        profileOpen
                                    }
                                    onClick={() =>
                                        setProfileOpen(
                                            (prev) => !prev
                                        )
                                    }
                                    className="
                    flex
                    h-[46px]
                    items-center
                    gap-2
                    border
                    border-[#eeeae1]/30
                    px-[15px]
                    text-[14px]
                    font-medium
                    !text-[#eeeae1]
                    transition-all
                    duration-300
                    hover:bg-[#eeeae1]
                    hover:!text-[#0b0b0a]
                  "
                                >
                                    <ProfileIcon />

                                    <span className="!text-inherit">
                                        Profile
                                    </span>
                                </button>

                                {/* =================================================
                    PROFILE DROPDOWN
                ================================================= */}

                                {profileOpen && (
                                    <div
                                        className="
                      absolute
                      right-0
                      top-[54px]
                      z-[1200]
                      w-[245px]
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/[0.09]
                      bg-[#151314]
                      shadow-2xl
                    "
                                    >
                                        {/* USER INFO */}

                                        <div
                                            className="
                        border-b
                        border-white/[0.07]
                        px-4
                        py-3
                      "
                                        >
                                            <div className="truncate text-[12px] text-white/80">
                                                {user?.name ||
                                                    "CodeLens User"}
                                            </div>

                                            <div className="mt-1 truncate text-[10px] text-white/30">
                                                {user?.email || ""}
                                            </div>
                                        </div>

                                        {/* TRY FOR FREE */}

                                        <button
                                            type="button"
                                            onClick={
                                                handleTryForFree
                                            }
                                            className="
                        flex
                        w-full
                        items-center
                        gap-3
                        px-4
                        py-3
                        text-left
                        transition-all
                        hover:bg-white/[0.045]
                      "
                                        >
                                            <div
                                                className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-white/[0.08]
                          bg-white/[0.025]
                          text-white/65
                        "
                                            >
                                                <PlusIcon size={16} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="text-[12px] text-white/75">
                                                    Try for Free
                                                </div>

                                                <div className="mt-1 text-[10px] text-white/30">
                                                    {remaining > 0
                                                        ? `${remaining} free review${remaining ===
                                                            1
                                                            ? ""
                                                            : "s"
                                                        } remaining`
                                                        : "Free limit reached"}
                                                </div>
                                            </div>
                                        </button>

                                        {/* UPGRADE */}

                                        {user?.plan ===
                                            "free" &&
                                            remaining === 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProfileOpen(
                                                            false
                                                        );

                                                        window.dispatchEvent(
                                                            new CustomEvent(
                                                                "codelens:upgrade"
                                                            )
                                                        );
                                                    }}
                                                    className="
                            flex
                            w-full
                            items-center
                            gap-3
                            border-t
                            border-white/[0.06]
                            px-4
                            py-3
                            text-left
                            transition-all
                            hover:bg-white/[0.045]
                          "
                                                >
                                                    <div
                                                        className="
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-lg
                              bg-white
                              text-[#080b09]
                            "
                                                    >
                                                        <ArrowUpIcon
                                                            size={15}
                                                        />
                                                    </div>

                                                    <div>
                                                        <div className="text-[12px] text-white/80">
                                                            Upgrade to Pro
                                                        </div>

                                                        <div className="mt-1 text-[10px] text-white/30">
                                                            Continue reviewing for
                                                            $20
                                                        </div>
                                                    </div>
                                                </button>
                                            )}

                                        {/* LOG OUT */}

                                        <button
                                            type="button"
                                            onClick={
                                                handleLogout
                                            }
                                            className="
                        flex
                        w-full
                        items-center
                        gap-3
                        border-t
                        border-white/[0.06]
                        px-4
                        py-3
                        text-left
                        text-red-400/70
                        transition-all
                        hover:bg-red-400/[0.05]
                        hover:text-red-400
                      "
                                        >
                                            <div
                                                className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-red-400/[0.10]
                        "
                                            >
                                                <LogoutIcon
                                                    size={15}
                                                />
                                            </div>

                                            <span className="text-[12px]">
                                                Log out
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* =================================================
                REVIEW A REPO
            ================================================= */}

                        <Link
                            to="/review"
                            className={`
                flex
                items-center
                gap-0
                transition-all
                duration-500
                ${topVisibility}
              `}
                        >
                            <span
                                className="
                  flex
                  h-[46px]
                  items-center
                  bg-[#eeeae1]
                  px-[17px]
                  text-[14px]
                  font-medium
                  !text-[#0b0b0a]
                "
                            >
                                Review a repo
                            </span>

                            <span
                                className="
                  flex
                  h-[46px]
                  w-[46px]
                  items-center
                  justify-center
                  bg-[#eeeae1]
                  !text-[#0b0b0a]
                "
                            >
                                <ArrowTile />
                            </span>
                        </Link>

                        {/* =================================================
                MENU BUTTON
            ================================================= */}

                        <button
                            type="button"
                            aria-label="Open menu"
                            aria-expanded={menuOpen}
                            onClick={() =>
                                setMenuOpen(true)
                            }
                            className={`
                flex
                h-[58px]
                w-[58px]
                flex-col
                items-center
                justify-center
                gap-[5px]
                rounded-full
                bg-[#eeeae1]
                !text-[#0b0b0a]
                transition-all
                duration-500
                ${solid
                                    ? "pointer-events-auto scale-100 opacity-100"
                                    : "pointer-events-none scale-90 opacity-0"
                                }
              `}
                        >
                            <span className="block h-[1.5px] w-[22px] bg-[#0b0b0a]" />
                            <span className="block h-[1.5px] w-[22px] bg-[#0b0b0a]" />
                            <span className="block h-[1.5px] w-[22px] bg-[#0b0b0a]" />
                        </button>
                    </div>
                </div>
            </header>

            {/* =====================================================
          OVERLAY
      ===================================================== */}

            <div
                ref={overlayRef}
                onClick={() => {
                    setMenuOpen(false);
                    setProfileOpen(false);
                }}
                className="
          fixed
          inset-0
          z-[1050]
          bg-[#121213]/60
          opacity-0
          pointer-events-none
        "
            />

            {/* =====================================================
          SIDE PANEL
      ===================================================== */}

            <aside
                ref={menuRef}
                className="
          fixed
          right-0
          top-0
          z-[1100]
          flex
          h-screen
          w-[420px]
          max-w-[88vw]
          flex-col
          bg-[#151314]
          px-8
          py-8
          text-[#eeeae1]
          shadow-2xl
        "
            >
                {/* =================================================
            MENU HEADER
        ================================================= */}

                <div
                    ref={menuHeaderRef}
                    className="
            flex
            items-center
            justify-between
            text-white
          "
                >
                    {/* LOGO */}

                    <Link
                        to="/"
                        className="cl-nav__mark "
                        aria-label="CodeLens home"
                    >
                        C<Lens />
                        <span>delens</span>
                    </Link>

                    {/* CLOSE */}

                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() =>
                            setMenuOpen(false)
                        }
                        className="
              relative
              z-[1200]
              flex
              h-[52px]
              w-[52px]
              cursor-pointer
              items-center
              justify-center
              rounded-full
              border
              border-[#eeeae1]/30
              bg-transparent
              !text-[#eeeae1]
              transition-all
              duration-300
              hover:bg-[#eeeae1]
              hover:!text-[#0b0b0a]
            "
                    >
                        <span
                            className="
                absolute
                h-[1.5px]
                w-[21px]
                rotate-45
                bg-current
              "
                        />

                        <span
                            className="
                absolute
                h-[1.5px]
                w-[21px]
                -rotate-45
                bg-current
              "
                        />
                    </button>
                </div>

                {/* =================================================
            MENU ITEMS
        ================================================= */}

                <nav className="mt-auto flex flex-col pb-12">

                    

                   
                    {/* ABOUT */}

                    <Link
                        ref={(el) => {
                            menuItemsRef.current[2] = el;
                        }}
                        to="/about"
                        onClick={() =>
                            setMenuOpen(false)
                        }
                        className="
              border-b
              border-[#eeeae1]/20
              py-5
              text-[32px]
              font-medium
              tracking-[-0.05em]
              !text-[#eeeae1]
              no-underline
              transition-all
              duration-300
              hover:pl-2
            "
                    >
                        About
                    </Link>

                     {/* CONTACT */}

                    <Link 
                    to="/contact"
                        ref={(el) => {
                            menuItemsRef.current[1] = el;
                        }}
                        href="#process"
                        onClick={() =>
                            setMenuOpen(false)
                        }
                        className="
              border-b
              border-[#eeeae1]/20
              py-5
              text-[32px]
              font-medium
              tracking-[-0.05em]
              !text-[#eeeae1]
              no-underline
              transition-all
              duration-300
              hover:pl-2
            "
                    >
                        Contact
                    </Link>

                    {/* WHAT IT READS */}

                    <Link
                        ref={(el) => {
                            menuItemsRef.current[0] = el;
                        }}
                        to="/pricing"
                        onClick={() =>
                            setMenuOpen(false)
                        }
                        className="
              border-b
              border-[#eeeae1]/20
              py-5
              text-[32px]
              font-medium
              tracking-[-0.05em]
              !text-[#eeeae1]
              no-underline
              transition-all
              duration-300
              hover:pl-2
            "
                    >
                        What it reads
                    </Link>


                    {/* REVIEW A REPO */}

                    <Link
                        ref={(el) => {
                            menuItemsRef.current[3] = el;
                        }}
                        to="/review"
                        onClick={() =>
                            setMenuOpen(false)
                        }
                        className="
              flex
              items-center
              justify-between
              border-b
              border-[#eeeae1]/20
              py-5
              text-[32px]
              font-medium
              tracking-[-0.05em]
              !text-[#eeeae1]
              no-underline
              transition-all
              duration-300
              hover:pl-2
            "
                    >
                        <span className="!text-[#eeeae1]">
                            Review a repo
                        </span>

                        <ArrowTile />
                    </Link>

                    {/* =================================================
              AUTH OPTIONS
          ================================================= */}

                    {!isLoggedIn ? (
                        <>
                            {/* LOGIN */}

                            <Link
                                ref={(el) => {
                                    menuItemsRef.current[4] = el;
                                }}
                                to="/login"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                                className="
                  border-b
                  border-[#eeeae1]/20
                  py-5
                  text-[32px]
                  font-medium
                  tracking-[-0.05em]
                  !text-[#eeeae1]
                  no-underline
                  transition-all
                  duration-300
                  hover:pl-2
                "
                            >
                                <span className="!text-[#eeeae1]">
                                    Log in
                                </span>
                            </Link>

                            {/* SIGN UP */}

                            <Link
                                ref={(el) => {
                                    menuItemsRef.current[5] = el;
                                }}
                                to="/signup"
                                onClick={() =>
                                    setMenuOpen(false)
                                }
                                className="
                  border-b
                  border-[#eeeae1]/20
                  py-5
                  text-[32px]
                  font-medium
                  tracking-[-0.05em]
                  !text-[#eeeae1]
                  no-underline
                  transition-all
                  duration-300
                  hover:pl-2
                "
                            >
                                <span className="!text-[#eeeae1]">
                                    Sign up
                                </span>
                            </Link>
                        </>
                    ) : (
                        /* PROFILE */

                        <button
                            ref={(el) => {
                                menuItemsRef.current[4] = el;
                            }}
                            type="button"
                            onClick={() =>
                                setProfileOpen(
                                    (prev) => !prev
                                )
                            }
                            className="
                w-full
                border-b
                border-[#eeeae1]/20
                py-5
                text-left
                text-[32px]
                font-medium
                tracking-[-0.05em]
                !text-[#eeeae1]
                transition-all
                duration-300
                hover:pl-2
              "
                        >
                            Profile
                        </button>
                    )}

                    {/* =================================================
              PROFILE OPTIONS INSIDE MENU
          ================================================= */}

                    {isLoggedIn &&
                        profileOpen && (
                            <div
                                className="
                  mt-3
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/[0.09]
                  bg-white/[0.025]
                "
                            >
                                {/* USER */}

                                <div
                                    className="
                    border-b
                    border-white/[0.07]
                    px-4
                    py-4
                  "
                                >
                                    <div className="text-[13px] text-white/80">
                                        {user?.name ||
                                            "CodeLens User"}
                                    </div>

                                    <div className="mt-1 text-[11px] text-white/30">
                                        {user?.email || ""}
                                    </div>
                                </div>

                                {/* TRY FOR FREE */}

                                <button
                                    type="button"
                                    onClick={
                                        handleTryForFree
                                    }
                                    className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-4
                    text-left
                    transition-all
                    hover:bg-white/[0.045]
                  "
                                >
                                    <PlusIcon size={18} />

                                    <div>
                                        <div className="text-[14px] text-white/80">
                                            Try for Free
                                        </div>

                                        <div className="mt-1 text-[10px] text-white/30">
                                            {remaining > 0
                                                ? `${remaining} free review${remaining ===
                                                    1
                                                    ? ""
                                                    : "s"
                                                } remaining`
                                                : "Free limit reached"}
                                        </div>
                                    </div>
                                </button>

                                {/* UPGRADE */}

                                {user?.plan ===
                                    "free" &&
                                    remaining === 0 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfileOpen(
                                                    false
                                                );

                                                window.dispatchEvent(
                                                    new CustomEvent(
                                                        "codelens:upgrade"
                                                    )
                                                );
                                            }}
                                            className="
                        flex
                        w-full
                        items-center
                        gap-3
                        border-t
                        border-white/[0.06]
                        px-4
                        py-4
                        text-left
                        transition-all
                        hover:bg-white/[0.045]
                      "
                                        >
                                            <ArrowUpIcon size={17} />

                                            <div>
                                                <div className="text-[14px] text-white/80">
                                                    Upgrade to Pro
                                                </div>

                                                <div className="mt-1 text-[10px] text-white/30">
                                                    Continue reviewing for $20
                                                </div>
                                            </div>
                                        </button>
                                    )}

                                {/* LOGOUT */}

                                <button
                                    type="button"
                                    onClick={
                                        handleLogout
                                    }
                                    className="
                    flex
                    w-full
                    items-center
                    gap-3
                    border-t
                    border-white/[0.06]
                    px-4
                    py-4
                    text-left
                    text-red-400/70
                    transition-all
                    hover:bg-red-400/[0.05]
                    hover:text-red-400
                  "
                                >
                                    <LogoutIcon size={17} />

                                    <span className="text-[14px]">
                                        Log out
                                    </span>
                                </button>
                            </div>
                        )}
                </nav>

                {/* =================================================
            FOOTER
        ================================================= */}

                <div
                    ref={menuFooterRef}
                    className="
            text-[10px]
            uppercase
            tracking-[0.2em]
            !text-[#eeeae1]/40
          "
                >
                    CodeLens
                </div>
            </aside>
        </>
    );
};

export default Navbar;