"use client";
import { FiAlertCircle, FiLayers, FiZap, FiCheckCircle, FiTrendingUp } from "react-icons/fi";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./casestudy.css";

const sections = [
  {
    icon: <FiAlertCircle />,
    title: "The Problem",
    content:
      "A small fashion retailer had no online presence and was losing customers to competitors with basic websites. They needed a complete e-commerce solution they could manage on their own — adding products, viewing orders, and updating inventory — without hiring a developer every time they needed a change.",
  },
  {
    icon: <FiLayers />,
    title: "My Approach",
    content:
      "I started by mapping out the key user journeys: browsing products, adding to cart, checking out, and the admin managing those orders. I chose Next.js for SEO and performance, MongoDB for flexible product schemas, and NextAuth for authentication. I built incrementally — storefront first, then cart, then admin panel — so the client could test each piece as I built it.",
  },
  {
    icon: <FiZap />,
    title: "Challenges",
    content:
      "Three main challenges came up: (1) Cart state needed to persist across sessions, even without login. (2) The admin panel needed to be secure but simple enough for a non-technical user. (3) Image uploads for products needed to work without a dedicated media server. Each challenge was a real problem that required a deliberate solution, not a workaround.",
  },
  {
    icon: <FiCheckCircle />,
    title: "Solutions",
    content:
      "For the cart, I used localStorage with a React context layer — items persist on refresh, and sync to the session on login. For the admin panel, I implemented role-based auth so only admin accounts see dashboard routes — the UI is a simple table with inline edit/delete controls. For images, I used Cloudinary's free tier via their Node.js SDK — uploads go server-side, URLs get stored in MongoDB.",
  },
  {
    icon: <FiTrendingUp />,
    title: "Outcome",
    content:
      "The store went live within 3 weeks. The client was able to list products, process orders, and update inventory on their own from day one. The page loads consistently under 1.5 seconds on a mobile connection. This project became the template I use for every e-commerce client — the auth module and admin structure have been reused twice since.",
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
          Elevare Digital Store — E-Commerce Platform
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
    </section>
  );
}
