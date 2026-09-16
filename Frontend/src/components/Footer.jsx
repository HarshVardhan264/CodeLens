import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Lens } from "./Navbar";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".cl-foot",
          start: "top 80%",
          once: true,
        },
      });

      // Navigation
      tl.from(".cl-foot nav", {
        x: -60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      // Navigation links one by one
      tl.from(
        ".cl-foot__link",
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
        },
        "-=0.45"
      );

      // Right side content
      tl.from(
        ".cl-foot__aside > div",
        {
          x: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.18,
          ease: "power3.out",
        },
        "-=0.5"
      );

      // Footer bottom
      tl.from(
        ".cl-foot__base",
        {
          y: 35,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.35"
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="cl-foot">
      <div className="cl-shell cl-foot__grid">
        <nav>
          <p className="cl-mono">(navigation)</p>

          <div style={{ marginTop: "1.25rem" }}>
            <Link to="/review" className="cl-foot__link cl-rule">
              Review a repo
            </Link>

            <Link to="/about" className="cl-foot__link cl-rule">
              About
            </Link>

            <Link to="/contact" className="cl-foot__link cl-rule">
              Contact
            </Link>

            <Link to="/pricing" className="cl-foot__link cl-rule">
              Price
            </Link>
          </div>
        </nav>

        <div className="cl-foot__aside">
          <div>
            <p className="cl-mono">(get in touch)</p>

            <p style={{ marginTop: "1rem", fontWeight: 600 }}>
              <a
                href="mailto:hello@codelens.dev"
                className="cl-foot__mail"
              >
                hello@codelens.dev
              </a>
            </p>

            <p
              className="cl-prose"
              style={{ marginTop: "0.75rem" }}
            >
              Works with GitHub and GitLab repositories, public or private.
            </p>
          </div>

          <div>
            <p className="cl-mono">(status)</p>

            <p
              style={{
                marginTop: "1rem",
                color: "var(--ash)",
              }}
            >
              Reviewing normally. No queue.
            </p>
          </div>
        </div>
      </div>

      <div className="cl-shell cl-foot__base">
        <span
          className="cl-nav__mark"
          style={{ opacity: 0.7 }}
        >
          C<Lens />
          <span>delens</span>
        </span>

        <span className="cl-mono">
          © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
};

export default Footer;