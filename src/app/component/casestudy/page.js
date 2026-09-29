"use client";
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

const sections = [
  {
    step: "01",
    badge: "PROBLEM STATEMENT",
    colorClass: "case-card--problem",
    icon: <FiAlertCircle />,
    title: "01 — The Problem",
    content:
      "Retail client needed an independent e-commerce storefront paired with an admin panel. Legacy manual inventory handling led to stock errors, untracked orders, and slow client updates.",
    bullets: ["Untracked manual inventory", "Lack of role-based admin panel", "Slow mobile page speed"],
  },
  {
    step: "02",
    badge: "ENGINEERING ROLE",
    colorClass: "case-card--approach",
    icon: <FiUserCheck />,
    title: "02 — My Role",
    content:
      "Lead Full-Stack Developer — Managed architecture design, Next.js 14 App Router frontend, Node/Express API routes, JWT security, and MongoDB schema optimization.",
    bullets: ["Database Schema Architect", "REST API & Auth Engineer", "UI/UX & State Manager"],
  },
  {
    step: "03",
    badge: "SYSTEM ARCHITECTURE",
    colorClass: "case-card--solutions",
    icon: <FiCheckCircle />,
    title: "03 — The Solution",
    content:
      "Built a full-stack Next.js application with MongoDB Atlas. Features persistent localStorage cart state, dynamic SSR product routes, and secure admin CRUD interface.",
    bullets: ["Next.js SSR & Server Actions", "Persistent Client Shopping Cart", "Admin Portal CRUD Operations"],
  },
  {
    step: "04",
    badge: "KEY DELIVERABLES",
    colorClass: "case-card--features",
    icon: <FiList />,
    title: "04 — Key Features",
    content:
      "Product Catalog Filters, Cart Persistence, JWT & NextAuth Security, Admin Product & Order CRUD Management, and Glassmorphic Mobile Layout.",
    bullets: ["Instant Filterable Catalog", "Protected Admin Routes", "Real-Time Order Tracking"],
  },
  {
    step: "05",
    badge: "TECH STACK",
    colorClass: "case-card--performance",
    icon: <FiCode />,
    title: "05 — Tech Stack",
    content:
      "Leveraged modern full-stack web technologies to ensure sub-second response times and maintainability across deployment environments.",
    bullets: ["Next.js 14 • React • Node.js", "MongoDB • Mongoose • JWT", "TailwindCSS • Vercel"],
  },
  {
    step: "06",
    badge: "CHALLENGES SOLVED",
    colorClass: "case-card--challenges",
    icon: <FiZap />,
    title: "06 — Technical Hurdles",
    content:
      "Prevented cart state loss across reloads, enforced HTTP-Only cookie auth middleware for admin routes, and optimized image handling using CDN compression.",
    bullets: ["React Context state hydration", "Next.js Route Middleware guards", "Cloudinary CDN image optimization"],
  },
  {
    step: "07",
    badge: "MEASURABLE OUTCOME",
    colorClass: "case-card--outcome",
    icon: <FiTrendingUp />,
    title: "07 — Measurable Result",
    content:
      "Delivered a production-ready application achieving fast page rendering, 100% responsive admin workflows, and robust error handling.",
    bullets: ["Sub-second API response", "100% Mobile & Desktop Sync", "Zero-downtime Vercel Deploy"],
  },
];

export default function CaseStudy() {
  useScrollReveal();

  return (
    <section id="casestudy" className="casestudy">
      <ParticleMesh particleCount={35} />
      <div className="main-text" data-reveal="fade-up" data-delay="0">
        <span>System Architecture &amp; Execution</span>
        <h2>Featured Case Study</h2>
        <p className="casestudy-project-name">
          Elevare Digital Store — Full-Stack E-Commerce &amp; Admin Portal
        </p>
      </div>

      <div className="casestudy-grid">
        {sections.map((sec, index) => (
          <div
            key={sec.title}
            className={`casestudy-card ${sec.colorClass}`}
            data-reveal="zoom-in"
            data-delay={String(0.05 * index)}
          >
            <div className="case-header">
              <span className="case-badge">{sec.badge}</span>
              <div className="casestudy-icon">{sec.icon}</div>
            </div>
            <h3 className="font-accent">{sec.title}</h3>
            <p>{sec.content}</p>
            {sec.bullets && (
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


