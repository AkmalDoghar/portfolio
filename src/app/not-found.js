"use client";

import Link from "next/link";
import { useState } from "react";
import { FiHome, FiFolder, FiMail, FiArrowLeft, FiCompass, FiCpu } from "react-icons/fi";
import ParticleMesh from "./component/ParticleMesh/ParticleMesh";
import "./not-found.css";

export default function NotFound() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const cx = card.left + card.width / 2;
    const cy = card.top + card.height / 2;
    const dx = (e.clientX - cx) / (card.width / 2);
    const dy = (e.clientY - cy) / (card.height / 2);
    setTilt({ x: dy * -10, y: dx * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="not-found-container">
      <ParticleMesh particleCount={50} />

      {/* 3D Grid & Background Ambient Lights */}
      <div className="nf-3d-bg-grid" />
      <div className="nf-glow-orb orb-1" />
      <div className="nf-glow-orb orb-2" />

      {/* Main 3D Card Container */}
      <div
        className="not-found-card-wrapper"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <div className="not-found-card">
          {/* Top Status Header */}
          <div className="not-found-badge">
            <span className="badge-pulse"></span>
            <span>SYSTEM ALERT — 404 ROUTE NOT FOUND</span>
          </div>

          {/* 3D Holographic Cube & Orbit Scene */}
          <div className="nf-3d-scene">
            <div className="nf-3d-cube">
              <div className="cube-face front"><FiCpu /></div>
              <div className="cube-face back">404</div>
              <div className="cube-face right"><FiCompass /></div>
              <div className="cube-face left">AK</div>
              <div className="cube-face top"></div>
              <div className="cube-face bottom"></div>
            </div>

            <div className="nf-orbit-ring ring-1" />
            <div className="nf-orbit-ring ring-2" />

            {/* Glowing 3D Code Text */}
            <h1 className="not-found-code font-accent">
              <span className="code-digit">4</span>
              <span className="code-digit digit-glow">0</span>
              <span className="code-digit">4</span>
            </h1>
          </div>

          {/* Title & Description */}
          <h2 className="not-found-title">Lost in Digital Space</h2>
          <p className="not-found-desc">
            The route or resource you requested is unmapped or has been migrated. Let&apos;s navigate back to safety.
          </p>

          {/* Interactive Navigation Actions */}
          <div className="not-found-actions">
            <Link href="/" className="nf-btn nf-btn-primary">
              <FiHome /> <span>Return to Base (Home)</span>
            </Link>

            <Link href="/#portfolio" className="nf-btn nf-btn-secondary">
              <FiFolder /> <span>Explore Projects</span>
            </Link>

            <Link href="/#contact" className="nf-btn nf-btn-outline">
              <FiMail /> <span>Contact Architect</span>
            </Link>
          </div>

          {/* Quick Back Action */}
          <div className="not-found-back">
            <button onClick={() => window.history.back()} className="nf-back-btn">
              <FiArrowLeft /> Go Back to Previous Route
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
