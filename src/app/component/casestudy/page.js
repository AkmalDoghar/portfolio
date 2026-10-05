"use client";
import { useState, useEffect } from "react";
import {
  FiAlertCircle,
  FiUserCheck,
  FiCheckCircle,
  FiList,
  FiCode,
  FiZap,
  FiTrendingUp,
  FiExternalLink,
  FiGithub,
  FiMessageSquare,
} from "react-icons/fi";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./casestudy.css";

const DEFAULT_SECTIONS = [
  {
    id: "cs-1",
    badge: "PROBLEM STATEMENT",
    colorClass: "case-card--problem",
    icon: <FiAlertCircle />,
    title: "01 — The Problem",
    content:
      "Standard weather apps are cluttered with ads, slow to load, lack offline support, and provide no real-time geolocation precision. Users needed a premium, installable PWA experience.",
    bullets: ["No offline-capable weather apps", "Poor mobile performance & ads", "No AI-assisted weather insights"],
  },
  {
    id: "cs-2",
    badge: "ENGINEERING ROLE",
    colorClass: "case-card--approach",
    icon: <FiUserCheck />,
    title: "02 — My Role",
    content:
      "Lead Full-Stack Developer & UI/UX Designer — Managed PWA architecture, OpenWeather API integration, Chart.js data visualization, AI summary generation, and Framer Motion animations.",
    bullets: ["PWA Architect & Service Worker", "API Integration & Data Pipeline", "UI/UX & Animation Engineer"],
  },
  {
    id: "cs-3",
    badge: "SYSTEM ARCHITECTURE",
    colorClass: "case-card--solutions",
    icon: <FiCheckCircle />,
    title: "03 — The Solution",
    content:
      "Built SkyPulse PRO as a Next.js PWA with OpenWeather API, real-time geolocation, 24-hour Chart.js forecasts, adaptive glassmorphism themes, and an integrated AI weather assistant.",
    bullets: ["PWA with offline & install support", "Real-time Geolocation API", "Adaptive Dark/Light Glassmorphism"],
  },
  {
    id: "cs-4",
    badge: "KEY DELIVERABLES",
    colorClass: "case-card--features",
    icon: <FiList />,
    title: "04 — Key Features",
    content:
      "Real-time weather tracking, 7-day forecasts, AQI metrics, PWA installability, AI-powered daily summaries, and interactive Chart.js weather visualization.",
    bullets: ["PWA Install + Offline Mode", "AI Weather Summary Assistant", "Interactive AQI & Radar Charts"],
  },
  {
    id: "cs-5",
    badge: "TECH STACK",
    colorClass: "case-card--performance",
    icon: <FiCode />,
    title: "05 — Tech Stack",
    content:
      "Modern frontend-focused stack chosen for PWA performance, smooth animations, and zero-backend real-time data delivery.",
    bullets: ["Next.js 14 • React • TailwindCSS", "OpenWeather API • Chart.js", "Framer Motion • PWA Manifest"],
  },
  {
    id: "cs-6",
    badge: "CHALLENGES SOLVED",
    colorClass: "case-card--challenges",
    icon: <FiZap />,
    title: "06 — Technical Hurdles",
    content:
      "Managed geolocation permission fallbacks, implemented service worker caching for offline mode, and optimized Chart.js renders to prevent layout reflow on mobile.",
    bullets: ["Geolocation permission fallback", "Service Worker offline caching", "Chart.js mobile re-render fix"],
  },
  {
    id: "cs-7",
    badge: "MEASURABLE OUTCOME",
    colorClass: "case-card--outcome",
    icon: <FiTrendingUp />,
    title: "07 — Measurable Result",
    content:
      "Achieved 98+ Lighthouse performance score, sub-second page loads, native PWA installation on iOS and Android, and 100% mobile-responsive layout.",
    bullets: ["98+ Lighthouse Score", "PWA install on iOS & Android", "Sub-second API response time"],
  },
  {
    id: "cs-8",
    badge: "PROOF & LINKS",
    colorClass: "case-card--solutions",
    icon: <FiCheckCircle />,
    title: "08 — Live Applications",
    content:
      "Explore the open-source GitHub repository, inspect technical architecture, or test live production web applications.",
    bullets: ["Open Source GitHub Repositories", "Live Production Deployments", "Clean Architecture Codebase"],
  },
];

export default function CaseStudy() {
  const [cards, setCards] = useState(DEFAULT_SECTIONS);
  useScrollReveal();

  useEffect(() => {
    fetch("/api/admin/casestudy", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item, idx) => ({
            id: item.id || `cs-${idx}`,
            badge: item.badge || "CASE STUDY",
            colorClass: item.colorClass || (item.accent === "rose" ? "case-card--problem" : item.accent === "cyan" ? "case-card--approach" : item.accent === "amber" ? "case-card--features" : "case-card--solutions"),
            icon: typeof item.icon === "string" ? item.icon : <FiCheckCircle />,
            title: item.title,
            content: item.desc || item.content || "",
            bullets: Array.isArray(item.points) ? item.points : item.bullets || [],
          }));
          setCards(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="casestudy" className="casestudy">
      <ParticleMesh particleCount={35} />
      <div className="main-text" data-reveal="fade-up" data-delay="0">
        <span>System Architecture &amp; Execution</span>
        <h2>Featured Case Study</h2>
        <p className="casestudy-project-name">
          SkyPulse PRO — Real-Time Weather PWA with AI Insights
        </p>
      </div>

      <div className="casestudy-grid">
        {cards.map((sec, index) => (
          <div
            key={sec.id || sec.title}
            className={`casestudy-card ${sec.colorClass || "case-card--solutions"}`}
            data-reveal="zoom-in"
            data-delay={String(0.05 * index)}
          >
            <div className="case-header">
              <span className="case-badge">{sec.badge}</span>
              <div className="casestudy-icon">{sec.icon}</div>
            </div>
            <h3 className="font-accent">{sec.title}</h3>
            <p>{sec.content}</p>
            {sec.bullets && sec.bullets.length > 0 && (
              <div className="casestudy-bullets">
                {sec.bullets.map((b, i) => (
                  <span key={i} className="casestudy-bullet-tag">
                    ✓ {b}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Proof & CTA Buttons */}
      <div className="casestudy-proof-container" data-reveal="fade-up" data-delay="0.2">
        <div className="casestudy-proof-header">
          <span className="proof-step-badge">08 — PROOF &amp; LINKS</span>
          <h3>Explore Live Proof &amp; Source Code</h3>
          <p>Inspect the complete codebase repository or test the live e-commerce platform demo.</p>
        </div>

        <div className="casestudy-proof-btn-group">
          <a
            href="https://github.com/AkmalDoghar/weather-app"
            target="_blank"
            rel="noopener noreferrer"
            className="casestudy-btn casestudy-btn--primary"
          >
            <FiGithub /> <span>Source Code (GitHub)</span>
          </a>

          <a
            href="https://skyplusweather.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="casestudy-btn casestudy-btn--demo"
          >
            <FiExternalLink /> <span>Live Application Demo</span>
          </a>

          <a href="#contact" className="casestudy-btn casestudy-btn--contact">
            <FiMessageSquare /> <span>Build Similar Project</span>
          </a>
        </div>
      </div>
    </section>
  );
}


