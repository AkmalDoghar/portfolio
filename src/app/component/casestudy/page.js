"use client";
import { FiAlertCircle, FiLayers, FiZap, FiCheckCircle, FiTrendingUp, FiGithub } from "react-icons/fi";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./casestudy.css";

const sections = [
  {
    icon: <FiAlertCircle />,
    title: "The Problem",
    content:
      "Small retail businesses need a modern e-commerce storefront paired with an intuitive administrative portal, enabling staff to handle product listings, view incoming orders, and update inventory independently.",
  },
  {
    icon: <FiLayers />,
    title: "My Approach",
    content:
      "I mapped out core user journeys: product catalog browsing, client-side cart interaction, checkout workflows, and administrative management. I selected Next.js for server-side rendering and fast initial page loads, coupled with MongoDB for flexible product schemas and JWT authentication for route security.",
  },
  {
    icon: <FiZap />,
    title: "Challenges",
    content:
      "Three primary technical hurdles included: (1) Persisting cart state seamlessly across browser sessions prior to user login, (2) Building a secure admin panel accessible only to authorized roles, and (3) Managing scalable image asset uploads without heavy server overhead.",
  },
  {
    icon: <FiCheckCircle />,
    title: "Solutions",
    content:
      "For cart state, I implemented a React context provider synced with localStorage to preserve items on refresh. For administrative security, I created route middleware and role-based guards restricting admin tools to verified accounts. For media assets, I integrated Cloudinary API uploading with image URLs stored directly in MongoDB.",
  },
  {
    icon: <FiTrendingUp />,
    title: "Outcome",
    content:
      "Engineered a production-ready e-commerce architectural pattern featuring fast server-side rendering, lightweight bundle sizes, and a streamlined administrative workflow. This modular system serves as a scalable foundation for custom full-stack web applications.",
  },
];

export default function CaseStudy() {
  useScrollReveal();

  return (
    <section id="casestudy" className="casestudy">
      <ParticleMesh particleCount={40} />
      <div className="main-text" data-reveal="fade-up" data-delay="0">
        <span>Deep dive into one project</span>
        <h2>Case Study</h2>
        <p className="casestudy-project-name">
          Elevare Digital Store — E-Commerce Architecture
        </p>
      </div>

      <div className="casestudy-grid">
        {sections.map((sec, index) => (
          <div
            key={sec.title}
            className="casestudy-card"
            data-reveal="zoom-in"
            data-delay={String(0.08 * index)}
          >
            <div className="casestudy-icon">{sec.icon}</div>
            <h3 className="font-accent">{sec.title}</h3>
            <p>{sec.content}</p>
          </div>
        ))}
      </div>

      <div className="casestudy-proof-actions" data-reveal="fade-up" data-delay="0.4">
        <a
          href="https://github.com/Timigill/elevaredigital"
          target="_blank"
          rel="noopener noreferrer"
          className="casestudy-proof-btn"
        >
          <FiGithub /> Inspect Case Study Repository &amp; Code
        </a>
      </div>
    </section>
  );
}
