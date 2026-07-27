"use client";
import { useEffect, useState } from "react";
import "./LogoIntro.css";

export default function LogoIntro() {
  const [phase, setPhase] = useState("entering"); // entering -> holding -> exiting -> done

  useEffect(() => {
    // Lock scroll during intro so page always starts at home
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    // Phase 1: 3D spin-in animation (1.2s)
    // Phase 2: Hold with pulse — loading bar completes at 2.5s
    // Phase 3: Exit animation (0.3s)
    // Phase 4: Remove from DOM

    const t1 = setTimeout(() => setPhase("holding"), 1200);
    const t2 = setTimeout(() => setPhase("exiting"), 2500);
    const t3 = setTimeout(() => {
      window.scrollTo(0, 0);          // ensure home section
      document.body.style.overflow = ""; // unlock scroll
      setPhase("done");
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`logo-intro-overlay ${phase}`}>
      {/* Scanline effect */}
      <div className="scanlines" />

      {/* Particle grid background */}
      <div className="intro-grid" />

      {/* Corner brackets */}
      <span className="corner corner-tl" />
      <span className="corner corner-tr" />
      <span className="corner corner-bl" />
      <span className="corner corner-br" />

      {/* Main 3D Logo Scene */}
      <div className="logo-scene">
        <div className="logo-3d-wrapper">
          {/* Ring 1 — forward rotation */}
          <div className="logo-ring ring-fw" />
          {/* Ring 2 — reverse rotation */}
          <div className="logo-ring ring-rv" />

          {/* Circular logo container */}
          <div className="logo-circle">
            <img
              src="/images/AK.png"
              alt="AK Logo"
              className="logo-ak-img"
            />
          </div>
        </div>

        {/* Tagline below circle */}
        <div className="logo-tagline">Mern Stack Developer</div>

        {/* Bottom glow line */}
        <div className="bottom-glow" />
      </div>

      {/* Loading bar */}
      <div className="intro-loader">
        <div className="loader-bar" />
        <span className="loader-text">Initializing…</span>
      </div>
    </div>
  );
}
