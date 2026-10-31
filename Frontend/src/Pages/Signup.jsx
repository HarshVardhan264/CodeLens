import React, {
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";

// ==========================================
// ICONS
// ==========================================

const UserIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2"
    />

    <path d="m3 7 9 6 9-6" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="20"
    height="20"
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

const EyeIcon = ({ hidden }) => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {hidden ? (
      <>
        <path d="M3 3l18 18" />

        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />

        <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.5 4 9.5 6-.4.8-1.3 2.2-2.8 3.5" />

        <path d="M6.6 6.6C4.7 7.9 3.5 9.5 2.5 10c1 2 4.5 6 9.5 6 1 0 1.9-.1 2.7-.4" />
      </>
    ) : (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />

        <circle
          cx="12"
          cy="12"
          r="2.5"
        />
      </>
    )}
  </svg>
);

const ArrowRight = () => (
  <svg
    width="20"
    height="20"
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

const TargetIcon = () => (
  <svg
    width="42"
    height="42"
    viewBox="0 0 42 42"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle
      cx="21"
      cy="21"
      r="14.5"
    />

    <circle
      cx="21"
      cy="21"
      r="7"
    />

    <circle
      cx="21"
      cy="21"
      r="2.5"
      fill="currentColor"
    />
  </svg>
);

// ==========================================
// SIGNUP
// ==========================================

export default function Signup() {
  const navigate = useNavigate();

  // ==========================================
  // FORM STATE
  // ==========================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // REFS
  // ==========================================

  const pageRef = useRef(null);

  const logoRef = useRef(null);
  const backRef = useRef(null);

  const targetRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);

  const formRef = useRef(null);
  const footerRef = useRef(null);

  const gridRef = useRef(null);

  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const line4Ref = useRef(null);

  // ==========================================
  // GSAP
  // ==========================================

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // --------------------------------------
      // INITIAL STATES
      // --------------------------------------

      gsap.set(
        [
          logoRef.current,
          backRef.current,
          targetRef.current,
          headingRef.current,
          descriptionRef.current,
          footerRef.current,
        ],
        {
          opacity: 0,
        }
      );

      gsap.set(targetRef.current, {
        y: -25,
        scale: 0.7,
        rotation: -25,
      });

      gsap.set(headingRef.current, {
        y: 35,
      });

      gsap.set(descriptionRef.current, {
        y: 20,
      });

      if (formRef.current) {
        gsap.set(
          formRef.current.children,
          {
            opacity: 0,
            y: 25,
          }
        );
      }

      gsap.set(footerRef.current, {
        y: 15,
      });

      gsap.set(
        [
          line1Ref.current,
          line2Ref.current,
          line3Ref.current,
          line4Ref.current,
        ],
        {
          opacity: 0,
          scaleX: 0,
        }
      );

      // --------------------------------------
      // ENTRANCE TIMELINE
      // --------------------------------------

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // Logo
      tl.to(logoRef.current, {
        opacity: 1,
        duration: 0.7,
      })

        // Back button
        .to(
          backRef.current,
          {
            opacity: 1,
            duration: 0.6,
          },
          "-=0.5"
        )

        // Background lines
        .to(
          [
            line1Ref.current,
            line2Ref.current,
            line3Ref.current,
            line4Ref.current,
          ],
          {
            opacity: 0.2,
            scaleX: 1,
            duration: 1.5,
            stagger: 0.15,
            ease: "power2.out",
          },
          "-=0.5"
        )

        // Target
        .to(
          targetRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.9,
            ease: "back.out(1.7)",
          },
          "-=1.1"
        )

        // Heading
        .to(
          headingRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.55"
        )

        // Description
        .to(
          descriptionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.4"
        )

        // Form
        .to(
          formRef.current.children,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.1,
          },
          "-=0.25"
        )

        // Footer
        .to(
          footerRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.25"
        );

      // --------------------------------------
      // TARGET FLOAT
      // --------------------------------------

      gsap.to(targetRef.current, {
        y: -4,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // --------------------------------------
      // GRID MOVEMENT
      // --------------------------------------

      gsap.to(gridRef.current, {
        backgroundPosition: "52px 52px",
        duration: 12,
        repeat: -1,
        ease: "none",
      });

      // --------------------------------------
      // BACKGROUND LINES
      // --------------------------------------

      gsap.to(line1Ref.current, {
        x: 25,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(line2Ref.current, {
        x: -30,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(line3Ref.current, {
        x: 20,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(line4Ref.current, {
        x: -25,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    // Button animation
    gsap.to(".signup-button", {
      scale: 0.97,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/signup`,
        {
          name: name.trim(),
          email: email.trim(),
          password,
        }
      );

      const {
        token,
        user,
      } = response.data;

      // ==========================================
      // SAVE AUTH DATA
      // ==========================================

      if (!token || !user) {
        throw new Error(
          "Invalid response from server."
        );
      }

      /*
       * JWT TOKEN
       *
       * This is the actual authentication
       * credential used by the frontend when
       * calling protected backend routes.
       */
      localStorage.setItem(
        "codelens_token",
        token
      );

      /*
       * USER DATA
       *
       * This is only cached information used
       * by the UI.
       *
       * The backend remains the source of truth
       * for plan, reviewsUsed, etc.
       */
      localStorage.setItem(
        "codelens_user",
        JSON.stringify(user)
      );

      /*
       * IMPORTANT:
       *
       * We intentionally DO NOT store:
       *
       * localStorage.setItem("isLoggedIn", "true");
       *
       * The presence of the JWT is enough for
       * the frontend to know that authentication
       * data exists.
       */

      // ==========================================
      // SUCCESS ANIMATION
      // ==========================================

      gsap.to(pageRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.35,
        ease: "power2.in",

        onComplete: () => {
          navigate("/");
        },
      });
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to create your account. Please try again.";

      setError(message);

      // ==========================================
      // ERROR SHAKE
      // ==========================================

      gsap.fromTo(
        formRef.current,
        {
          x: -5,
        },
        {
          x: 5,
          duration: 0.08,
          repeat: 5,
          yoyo: true,
          ease: "power1.inOut",
          clearProps: "x",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGIN NAVIGATION
  // ==========================================

  const goToLogin = () => {
    gsap.to(pageRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.35,
      ease: "power2.in",

      onComplete: () => {
        navigate("/login");
      },
    });
  };

  // ==========================================
  // BACK HOME
  // ==========================================

  const goHome = () => {
    gsap.to(pageRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.35,
      ease: "power2.in",

      onComplete: () => {
        navigate("/");
      },
    });
  };

  // ==========================================
  // JSX
  // ==========================================

  return (
    <div
      ref={pageRef}
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#080909]
        text-white
      "
    >
      {/* ======================================
          GRID
      ======================================= */}

      <div
        ref={gridRef}
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.16]
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,0.055) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.055) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "52px 52px",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
        }}
      />

      {/* ======================================
          TECHNICAL LINES
      ======================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div
          ref={line1Ref}
          className="
            absolute
            left-[-10%]
            top-[20%]
            h-px
            w-[55%]
            rotate-[27deg]
            bg-gradient-to-r
            from-transparent
            via-[#36506c]
            to-transparent
          "
        />

        <div
          ref={line2Ref}
          className="
            absolute
            right-[-8%]
            top-[58%]
            h-px
            w-[48%]
            rotate-[34deg]
            bg-gradient-to-r
            from-transparent
            via-[#304b62]
            to-transparent
          "
        />

        <div
          ref={line3Ref}
          className="
            absolute
            bottom-[13%]
            left-[8%]
            h-px
            w-[40%]
            rotate-[31deg]
            bg-gradient-to-r
            from-transparent
            via-[#49345c]
            to-transparent
          "
        />

        <div
          ref={line4Ref}
          className="
            absolute
            bottom-[4%]
            right-[-4%]
            h-px
            w-[43%]
            rotate-[29deg]
            bg-gradient-to-r
            from-transparent
            via-[#2e5266]
            to-transparent
          "
        />
      </div>

      {/* ======================================
          GLOW
      ======================================= */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[42%]
          h-[500px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-[#3b4550]/[0.06]
          blur-[130px]
        "
      />

      {/* ======================================
          NAVBAR
      ======================================= */}

      <header
        className="
          relative
          z-10
          flex
          items-center
          justify-between
          px-[3.2vw]
          pt-[31px]
        "
      >
        {/* Logo */}

        <div
          ref={logoRef}
          className="flex items-center gap-[2px]"
        >
          <div
            className="
              relative
              flex
              h-[23px]
              w-[23px]
              items-center
              justify-center
            "
          >
            <div
              className="
                absolute
                h-[18px]
                w-[18px]
                rounded-full
                border-[2px]
                border-[#eeeeeb]
              "
            />

            <div
              className="
                absolute
                h-[9px]
                w-[9px]
                rounded-full
                border-[2px]
                border-[#eeeeeb]
              "
            />

            <div
              className="
                absolute
                h-[3px]
                w-[3px]
                rounded-full
                bg-[#eeeeeb]
              "
            />
          </div>

          <span
            className="
              ml-[1px]
              text-[18px]
              font-semibold
              tracking-[-0.7px]
              text-[#eeeeeb]
            "
          >
            CODELENS
          </span>
        </div>

        {/* Back home */}

        <button
          ref={backRef}
          type="button"
          onClick={goHome}
          className="
            group
            flex
            items-center
            gap-5
            text-[12px]
            font-medium
            text-[#e6e6e2]
            transition-opacity
            hover:opacity-70
          "
        >
          <span>Back to home</span>

          <span
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          >
            <ArrowRight />
          </span>
        </button>
      </header>

      {/* ======================================
          MAIN
      ======================================= */}

      <main
        className="
          relative
          z-10
          flex
          min-h-[calc(100vh-92px)]
          justify-center
          px-5
        "
      >
        <div className="mt-[58px] w-full max-w-[418px]">
          {/* Target */}

          <div
            ref={targetRef}
            className="
              mb-[22px]
              flex
              justify-center
              text-[#d7d7d3]
            "
          >
            <TargetIcon />
          </div>

          {/* Heading */}

          <div className="text-center">
            <h1
              ref={headingRef}
              className="
                text-[39px]
                font-medium
                leading-[1.05]
                tracking-[-1.9px]
                text-[#f1f1ed]
              "
            >
              Create your account
            </h1>

            <p
              ref={descriptionRef}
              className="
                mx-auto
                mt-[17px]
                max-w-[350px]
                text-[15px]
                leading-[1.45]
                text-[#929391]
              "
            >
              Get started with CodeLens and make your
              <br />
              code reviews more insightful.
            </p>
          </div>

          {/* ==================================
              FORM
          =================================== */}

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-[31px]"
          >
            {/* Full Name */}

            <div className="relative">
              <div
                className="
                  pointer-events-none
                  absolute
                  left-[17px]
                  top-1/2
                  z-10
                  -translate-y-1/2
                  text-[#9b9b98]
                "
              >
                <UserIcon />
              </div>

              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                autoComplete="name"
                required
                className="
                  h-[47px]
                  w-full
                  rounded-[8px]
                  border
                  border-[#343534]
                  bg-[#111212]
                  pl-[51px]
                  pr-[18px]
                  text-[14px]
                  text-[#ededeb]
                  outline-none
                  placeholder:text-[#777875]
                  transition-all
                  duration-200
                  hover:border-[#454644]
                  focus:border-[#696a67]
                  focus:bg-[#131414]
                  focus:ring-1
                  focus:ring-[#6b6c69]/20
                "
              />
            </div>

            {/* Email */}

            <div className="relative mt-[10px]">
              <div
                className="
                  pointer-events-none
                  absolute
                  left-[17px]
                  top-1/2
                  z-10
                  -translate-y-1/2
                  text-[#9b9b98]
                "
              >
                <MailIcon />
              </div>

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
                required
                className="
                  h-[47px]
                  w-full
                  rounded-[8px]
                  border
                  border-[#343534]
                  bg-[#111212]
                  pl-[51px]
                  pr-[18px]
                  text-[14px]
                  text-[#ededeb]
                  outline-none
                  placeholder:text-[#777875]
                  transition-all
                  duration-200
                  hover:border-[#454644]
                  focus:border-[#696a67]
                  focus:bg-[#131414]
                  focus:ring-1
                  focus:ring-[#6b6c69]/20
                "
              />
            </div>

            {/* Password */}

            <div className="relative mt-[10px]">
              <div
                className="
                  pointer-events-none
                  absolute
                  left-[17px]
                  top-1/2
                  z-10
                  -translate-y-1/2
                  text-[#9b9b98]
                "
              >
                <LockIcon />
              </div>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete="new-password"
                required
                minLength={6}
                className="
                  h-[47px]
                  w-full
                  rounded-[8px]
                  border
                  border-[#343534]
                  bg-[#111212]
                  pl-[51px]
                  pr-[52px]
                  text-[14px]
                  text-[#ededeb]
                  outline-none
                  placeholder:text-[#777875]
                  transition-all
                  duration-200
                  hover:border-[#454644]
                  focus:border-[#696a67]
                  focus:bg-[#131414]
                  focus:ring-1
                  focus:ring-[#6b6c69]/20
                "
              />

              <button
                type="button"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="
                  absolute
                  right-[16px]
                  top-1/2
                  -translate-y-1/2
                  text-[#999a97]
                  transition-colors
                  hover:text-[#d9d9d5]
                "
              >
                <EyeIcon
                  hidden={!showPassword}
                />
              </button>
            </div>

            {/* Error */}

            {error && (
              <div
                className="
                  mt-[12px]
                  rounded-[7px]
                  border
                  border-red-400/20
                  bg-red-400/[0.06]
                  px-4
                  py-3
                  text-[12px]
                  leading-[1.4]
                  text-red-300
                "
              >
                {error}
              </div>
            )}

            {/* Create account */}

            <button
              type="submit"
              disabled={loading}
              className="
                signup-button
                group
                relative
                mt-[13px]
                flex
                h-[46px]
                w-full
                items-center
                justify-center
                rounded-[7px]
                bg-[#f0eee7]
                text-[14px]
                font-semibold
                text-[#171817]
                transition-all
                duration-200
                hover:bg-white
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <span>
                {loading
                  ? "Creating account..."
                  : "Create account"}
              </span>

              {!loading && (
                <span
                  className="
                    absolute
                    right-[17px]
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  <ArrowRight />
                </span>
              )}
            </button>
          </form>

          {/* ==================================
              LOGIN
          =================================== */}

          <p
            className="
              mt-[20px]
              text-center
              text-[13px]
              text-[#777875]
            "
          >
            Already have an account?

            <button
              type="button"
              onClick={goToLogin}
              className="
                ml-[8px]
                font-medium
                text-[#e3e3df]
                transition-colors
                hover:text-white
              "
            >
              Log in
            </button>
          </p>
        </div>
      </main>

      {/* ======================================
          FOOTER
      ======================================= */}

      <div
        ref={footerRef}
        className="
          absolute
          bottom-[29px]
          left-[3.2vw]
          z-10
          flex
          items-center
          gap-[10px]
          text-[11px]
          text-[#646562]
        "
      >
        <span>Secure</span>

        <span className="text-[#444542]">
          •
        </span>

        <span>Fast</span>

        <span className="text-[#444542]">
          •
        </span>

        <span>Private</span>
      </div>
    </div>
  );
}