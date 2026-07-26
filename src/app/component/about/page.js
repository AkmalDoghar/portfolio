"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./about.css";

export default function About() {
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef(null);
  const modalRef = useRef(null);

  useScrollReveal();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => closeBtnRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && open) {
        const focusables = modalRef.current?.querySelectorAll(
          'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  return (
    <section id="about" className="about">
      <ParticleMesh particleCount={50} />
      <div className="main-text" data-reveal="fade-up" data-delay="0">
        <span>Let me introduce myself</span>
        <h2>About Me</h2>
      </div>
      <div className="img-about" data-reveal="fade-left" data-delay="0">
        <div className="liquid-shape">
          <svg
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
          >
            <path fill="#12f7ff">
              <animate
                attributeName="d"
                dur="20000ms"
                repeatCount="indefinite"
                values="
                M425.5,302Q430,354,398,402.5Q366,451,308,446Q250,441,204.5,424.5Q159,408,110,383.5Q61,359,54,304.5Q47,250,79.5,210Q112,170,140,139Q168,108,209,78.5Q250,49,288.5,83Q327,117,381.5,130Q436,143,428.5,196.5Q421,250,425.5,302Z;
                M425.5,299.5Q421,349,379.5,375.5Q338,402,294,425.5Q250,449,210,419Q170,389,123,369.5Q76,350,46,300Q16,250,53.5,204Q91,158,120.5,117.5Q150,77,200,40Q250,3,304.5,31.5Q359,60,394.5,103Q430,146,430,198Q430,250,425.5,299.5Z;
                M445.5,302Q430,354,386.5,382Q343,410,296.5,451.5Q250,493,194.5,467.5Q139,442,115.5,391.5Q92,341,72.5,295.5Q53,250,80,209Q107,168,134.5,132.5Q162,97,206,69Q250,41,303,53.5Q356,66,380.5,113Q405,160,433,205Q461,250,445.5,302Z;
                M407.5,295.5Q408,341,386,394Q364,447,307,440.5Q250,434,205,420Q160,406,124,374.5Q88,343,90,296.5Q92,250,67,190Q42,130,94.5,100.5Q147,71,198.5,76.5Q250,82,309,64Q368,46,408.5,90.5Q449,135,428,192.5Q407,250,407.5,295.5Z;
                M460,301Q426,352,393.5,397Q361,442,305.5,453Q250,464,204,436.5Q158,409,108,385Q58,361,38.5,305.5Q19,250,64,209.5Q109,169,140,141.5Q171,114,210.5,82Q250,50,290,80.5Q330,111,389.5,123Q449,135,471.5,192.5Q494,250,460,301Z;
                M441,298Q416,346,390.5,397.5Q365,449,307.5,468.5Q250,488,206.5,444.5Q163,401,99,387.5Q35,374,50.5,312Q66,250,88.5,210Q111,170,123.5,111Q136,52,193,46Q250,40,312,37Q374,34,384,100.5Q394,167,430,208.5Q466,250,441,298Z;
                M425.5,302Q430,354,398,402.5Q366,451,308,446Q250,441,204.5,424.5Q159,408,110,383.5Q61,359,54,304.5Q47,250,79.5,210Q112,170,140,139Q168,108,209,78.5Q250,49,288.5,83Q327,117,381.5,130Q436,143,428.5,196.5Q421,250,425.5,302Z;"
              ></animate>
            </path>
          </svg>
        </div>
        <Image
          src="/Akmal2.png"
          alt="About Me"
          width={450}
          height={350}
          priority
        />
        <div className="info-about-1">
          <span>1+</span>
          <p>Years Experience</p>
        </div>
        <div className="info-about2">
          <span>8+</span>
          <p>Projects Delivered</p>
        </div>
        <div className="info-about3">
          <span>3+</span>
          <p>Happy Clients</p>
        </div>
      </div>

      <div className="about-content" data-reveal="fade-right" data-delay="0.1">
        <h3>A developer who ships, not just codes</h3>
        <p>
          I&apos;m Muhammad Akmal, a full-stack developer who builds web
          applications from the ground up — database design, REST APIs,
          server-side logic, and pixel-accurate frontends. I work primarily with
          Next.js, React, Node.js, and MongoDB. Every project I take on gets
          thorough testing, clean commits, and documentation so handoff is never
          painful. I&apos;m actively improving through real client work and
          open-source contributions.
        </p>

        <div className="btn-box about-btn-box">
          <button
            className="btn"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            Read More
          </button>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="modal-backdrop"
          onMouseDown={handleBackdropClick}
          role="presentation"
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            ref={modalRef}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
              ref={closeBtnRef}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="modal-body">
              <h2 id="modal-title">More About Muhammad Akmal</h2>
              <p className="lead">
                Here&apos;s a deeper look at how I work, what I build, and what
                I bring to every project.
              </p>

              <div className="modal-section">
                <h4>What I Build</h4>
                <p>
                  Full-stack web applications — from e-commerce stores with cart
                  and admin panels, to internal dashboards for data management,
                  to secure authentication systems. I handle both the UI and
                  what runs behind it.
                </p>
              </div>

              <div className="modal-section">
                <h4>How I Work</h4>
                <p>
                  I plan before I code. I define the feature scope, break it
                  into small tasks, and push working increments regularly. I
                  write readable code, use meaningful commit messages, and hand
                  off with documentation.
                </p>
              </div>

              <div className="modal-section">
                <h4>Tech I Use</h4>
                <ul className="skill-list">
                  <li>Next.js / React — UI and server-side rendering</li>
                  <li>Node.js / Express — REST APIs and middleware</li>
                  <li>MongoDB / Mongoose — database design</li>
                  <li>CSS3 / Bootstrap — styling</li>
                  <li>Git & GitHub — version control</li>
                  <li>Vercel / Railway — deployment</li>
                </ul>
              </div>

              <div className="modal-actions">
                <button className="model-btn" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
