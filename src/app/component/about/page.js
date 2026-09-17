"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FiUser, FiCode, FiAward, FiCheckCircle, FiArrowRight, FiX } from "react-icons/fi";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./about.css";

const DEFAULT_SETTINGS = {
  name: "Muhammad Akmal",
  aboutImage: "/Akmal2.png",
  aboutTag: "FULL-STACK WEB ENGINEER",
  aboutTitle: "Crafting Scalable Digital Products with Clean Architecture",
  aboutDescription1:
    "I'm Muhammad Akmal, a full-stack JavaScript engineer who builds web applications from the ground up — database schema design, RESTful APIs, server-side logic, and responsive user interfaces.",
  aboutDescription2:
    "Primary focus on Next.js, React, Node.js, and MongoDB. I emphasize clean code, structured commit histories, clear documentation, and seamless deployments.",
  aboutYearsExp: "1+",
  aboutProjectsBuilt: "8+",
  aboutLiveDeployed: "3+",
};

export default function About() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const closeBtnRef = useRef(null);
  const modalRef = useRef(null);

  useScrollReveal();

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

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
          'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
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
      <ParticleMesh particleCount={40} />
      <div className="main-text" data-reveal="fade-up" data-delay="0">
        <span>Engineering Profile &amp; Mindset</span>
        <h2>About Me</h2>
      </div>

      <div className="about-container">
        {/* Left Side: Profile Image & Glass Stats Grid */}
        <div className="img-about" data-reveal="fade-right" data-delay="0.1">
          <div className="profile-card-glow">
            <div className="avatar-backdrop-aura"></div>
            <div className="image-frame">
              <Image
                src={settings.aboutImage || "/Akmal2.png"}
                alt={`${settings.name || "Muhammad Akmal"} - Full-Stack Developer Profile`}
                width={420}
                height={500}
                priority
                className="profile-img-popping"
              />
            </div>
          </div>

          <div className="about-stats-grid">
            <div className="stat-card">
              <span className="stat-num">{settings.aboutYearsExp}</span>
              <p className="stat-label">Years Exp.</p>
            </div>
            <div className="stat-card">
              <span className="stat-num">{settings.aboutProjectsBuilt}</span>
              <p className="stat-label">Projects Built</p>
            </div>
            <div className="stat-card">
              <span className="stat-num">{settings.aboutLiveDeployed}</span>
              <p className="stat-label">Live Deployed</p>
            </div>
          </div>
        </div>

        {/* Right Side: Text & Core Tech Badges */}
        <div className="about-content" data-reveal="fade-left" data-delay="0.2">
          <span className="about-tag">{settings.aboutTag}</span>
          <h3>{settings.aboutTitle}</h3>
          <p>{settings.aboutDescription1}</p>
          <p>{settings.aboutDescription2}</p>

          <div className="about-tech-pills">
            <span className="pill">Next.js 14</span>
            <span className="pill">React 18</span>
            <span className="pill">Node.js</span>
            <span className="pill">MongoDB</span>
            <span className="pill">REST APIs</span>
            <span className="pill">JWT Security</span>
          </div>

          <div className="btn-box about-btn-box">
            <button
              className="btn about-explore-btn"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
            >
              <span>More About My Workflow</span> <FiArrowRight />
            </button>
          </div>
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
              aria-label="Close Modal"
              ref={closeBtnRef}
            >
              <FiX />
            </button>

            <div className="modal-body">
              <div className="modal-header-icon">
                <FiUser />
              </div>
              <h2 id="modal-title">{settings.name || "Muhammad Akmal"} — Developer Profile</h2>
              <p className="lead">
                Full-stack software developer with expertise in JavaScript ecosystems, cloud deployments, and production UI engineering.
              </p>

              <div className="modal-section">
                <h4>
                  <FiCode className="section-icon" /> What I Build
                </h4>
                <p>
                  Full-stack web applications — from retail e-commerce stores with persistent cart state and administrative inventory management, to real-time weather PWAs and REST API microservices.
                </p>
              </div>

              <div className="modal-section">
                <h4>
                  <FiAward className="section-icon" /> Engineering Mindset
                </h4>
                <p>
                  Structured planning before execution. Breaking complex features into modular components, writing self-documenting code, enforcing role-based access guards, and maintaining clean git histories.
                </p>
              </div>

              <div className="modal-section">
                <h4>
                  <FiCheckCircle className="section-icon" /> Technical Stack Matrix
                </h4>
                <ul className="skill-list">
                  <li>
                    <strong>Next.js 14:</strong> Server-Side Rendering (SSR), App Router, dynamic API routes
                  </li>
                  <li>
                    <strong>React 18:</strong> Reusable component design, custom hooks, context state sync
                  </li>
                  <li>
                    <strong>Node.js &amp; Express:</strong> RESTful APIs, JWT authentication, role guards
                  </li>
                  <li>
                    <strong>MongoDB &amp; Mongoose:</strong> Document modeling, indexing, schema validations
                  </li>
                  <li>
                    <strong>Styling &amp; UX:</strong> Glassmorphic UI design, CSS keyframe animations, mobile-first responsiveness
                  </li>
                </ul>
              </div>

              <div className="modal-actions">
                <button className="model-btn" onClick={() => setOpen(false)}>
                  Close Overview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
