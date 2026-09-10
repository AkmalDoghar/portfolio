"use client";
import {
  FiAlertCircle,
  FiLayers,
  FiZap,
  FiCheckCircle,
  FiTrendingUp,
  FiShield,
  FiCpu,
  FiDatabase,
  FiGithub,
} from "react-icons/fi";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./casestudy.css";

const sections = [
  {
    badge: "CHALLENGE",
    colorClass: "case-card--problem",
    icon: <FiAlertCircle />,
    title: "The Problem",
    content:
      "Small retail businesses need a modern e-commerce storefront paired with an intuitive administrative portal, enabling staff to handle product listings, view incoming orders, and update inventory independently.",
  },
  {
    badge: "ARCHITECTURE",
    colorClass: "case-card--approach",
    icon: <FiLayers />,
    title: "My Approach",
    content:
      "Mapped out core user journeys: product catalog browsing, client-side cart interaction, checkout workflows, and administrative management. Selected Next.js server-side rendering and MongoDB with JWT for route security.",
  },
  {
    badge: "BOTTLENECKS",
    colorClass: "case-card--challenges",
    icon: <FiZap />,
    title: "Key Hurdles",
    content:
      "Persisting cart state seamlessly across browser sessions, restricting administrative portal access strictly to authorized roles, and managing lightweight image asset uploads without server performance degradation.",
  },
  {
    badge: "SOLUTION",
    colorClass: "case-card--solutions",
    icon: <FiCheckCircle />,
    title: "Engineered Solutions",
    content:
      "Implemented a React Context sync provider with localStorage for persistent carts, Next.js route middleware guards for admin role authorization, and integrated Cloudinary CDN API for optimized media handling.",
  },
  {
    badge: "SECURITY & SHIELD",
    colorClass: "case-card--security",
    icon: <FiShield />,
    title: "Auth & Access Guards",
    content:
      "Secured administrative API endpoints using JSON Web Tokens (JWT), password hashing with bcrypt, input sanitization, and strict middleware guards to block unauthorized requests.",
  },
  {
    badge: "PERFORMANCE",
    colorClass: "case-card--performance",
    icon: <FiCpu />,
    title: "Speed Optimization",
    content:
      "Achieved sub-100ms API response times by leveraging Next.js server components, automatic WebP image compression, dynamic route caching, and lightweight client JS bundles.",
  },
  {
    badge: "DATA MODEL",
    colorClass: "case-card--database",
    icon: <FiDatabase />,
    title: "Flexible Schema Design",
    content:
      "Structured indexed MongoDB document collections for products, inventory stock, customer orders, and admin credentials to ensure fast read-heavy query execution.",
  },
  {
    badge: "OUTCOME & IMPACT",
    colorClass: "case-card--outcome",
    icon: <FiTrendingUp />,
    title: "Production Impact",
    content:
      "Engineered a production-ready e-commerce pattern with fast initial page loads, 100% responsive administrative workflows, and a scalable modular foundation for web client deployments.",
  },
];

export default function CaseStudy() {
  useScrollReveal();

  return (
    <section id="casestudy" className="casestudy">
      <ParticleMesh particleCount={35} />
      <div className="main-text" data-reveal="fade-up" data-delay="0">
        <span>Deep Dive &amp; System Architecture</span>
        <h2>Featured Case Study</h2>
        <p className="casestudy-project-name">
          Elevare Digital Store — Full-Stack E-Commerce Portal
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
          </div>
        ))}
      </div>

      <div className="casestudy-proof-actions" data-reveal="fade-up" data-delay="0.3">
        <a
          href="https://github.com/Timigill/elevaredigital"
          target="_blank"
          rel="noopener noreferrer"
          className="casestudy-proof-btn"
        >
          <FiGithub /> <span>Inspect Repository Source Code</span>
        </a>
      </div>
    </section>
  );
}


