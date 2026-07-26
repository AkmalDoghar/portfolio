"use client";

import { useState, useEffect } from "react";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./portfolio.css";

const projects = [
  {
    id: 1,
    category: "product",
    img: "/images/image2.jpeg",
    title: "Elevare Digital Store",
    role: "Full-Stack Developer",
    description:
      "A full-featured e-commerce platform with product catalog, shopping cart, secure checkout, and a complete admin panel for inventory and order management.",
    tech: ["Next.js", "MongoDB", "Node.js", "NextAuth"],
    problem:
      "The client needed an online store they could manage themselves without relying on a developer for every update.",
    features: [
      "Product catalog with filters",
      "Cart with localStorage sync",
      "Admin CRUD panel",
      "JWT-based auth",
      "Responsive on all devices",
    ],
    result: "Live store managing 50+ SKUs with daily orders.",
    link: "#",
    github: "#",
  },
  {
    id: 2,
    category: "web",
    img: "/images/image3.jpeg",
    title: "CartifyOutlet E-commerce Platform",
    role: "Full-Stack Developer",
    description:
      "A full-stack e-commerce platform built to manage product listings, user authentication, and order workflows with a seamless shopping experience.",
    tech: ["Next.js", "Node.js", "MongoDB", "NextAuth", "JWT"],
    problem:
      "The business needed a complete online store to handle product management, user accounts, and secure checkout without relying on third-party limitations.",
    features: [
      "User authentication with Google OAuth and JWT",
      "Product listing & category management",
      "Cart and checkout system",
      "Order tracking and user dashboard",
      "Admin panel for product and order control",
    ],
    result:
      "Delivered a complete e-commerce workflow enabling users to browse, purchase, and manage orders efficiently.",
    link: "https://www.cartifyoutlet.com/",
    github: "#",
  },
  {
    id: 3,
    category: "inter",
    img: "/images/image1.jpeg",
    title: "DaaSForge Admin Dashboard",
    role: "Frontend Developer (Contributor)",
    description:
      "Contributed frontend modules to a company platform — data tables, chart views, and responsive layout improvements for the admin interface.",
    tech: ["Next.js", "React", "REST API", "Chart.js"],
    problem:
      "The team needed a unified data management interface that non-technical users could navigate comfortably.",
    features: [
      "Role-based access views",
      "Interactive charts",
      "Filterable data tables",
      "CSV export",
      "Fully responsive",
    ],
    result: "Platform deployed and used daily by the DaaSForge team.",
    link: "https://daas-forge.vercel.app/",
    github: "#",
  },
  {
    id: 4,
    category: "product",
    img: "/images/image5.jpeg",
    title: "LaanCer — Freelancer Platform",
    role: "Frontend Developer",
    description:
      "Landing page and project showcase UI for a Next.js freelancer marketplace platform.",
    tech: ["Next.js", "React"],
    problem:
      "The startup needed a polished landing page that communicated their value proposition clearly to both clients and freelancers.",
    features: [
      "Hero with CTA",
      "Feature highlights section",
      "Freelancer profile cards",
      "Fully responsive",
    ],
    result: "Live at laancer.vercel.app with positive stakeholder feedback.",
    link: "https://laancer.vercel.app/",
    github: "#",
  },
  {
    id: 5,
    category: "inter",
    img: "/images/image6.jpeg",
    title: "Libaas e Zauq — Fashion Store",
    role: "Frontend Developer",
    description:
      "Complete UI for a Pakistani fashion e-commerce brand — product pages, collections grid, and responsive mobile layout built from scratch.",
    tech: ["Next.js", "CSS3", "React"],
    problem:
      "The brand had no online presence; they needed a store that reflected their aesthetic and worked well on mobile.",
    features: [
      "Product collection grid",
      "Category filtering",
      "Mobile-first layout",
      "Fast page loads",
    ],
    result: "Live at libaasezauq.shop; drives consistent organic traffic.",
    link: "https://www.libaasezauq.shop",
    github: "#",
  },
  {
    id: 6,
    category: "web",
    img: "/images/image4.jpeg",
    title: "DaaS Tech Admin Dashboard",
    role: "Full Stack Developer",
    description:
      "A scalable admin dashboard developed for DaaS Tech to manage clients, services, and digital projects efficiently through a centralized system.",
    tech: ["Next.js", "Node.js", "MongoDB", "Express", "Redux"],
    problem:
      "The company lacked a centralized admin system to manage client projects, service orders, and internal workflows, causing delays and manual handling issues.",
    features: [
      "Admin dashboard with role-based access",
      "Client & project management system",
      "Service order tracking & status updates",
      "Secure authentication with JWT",
      "Real-time notifications for admin actions",
    ],
    result:
      "Improved internal workflow efficiency and reduced manual management effort by over 60%.",
    link: "https://www.daastech.info/",
    github: "#",
  },
  // {
  //   id: 7,
  //   category: "product",
  //   img: "/images/image7.jpeg",
  //   title: "Libaas Admin Console",
  //   role: "Full-Stack Developer",
  //   description:
  //     "A dedicated back-office management system for the Libaas e Zauq brand to manage orders, inventory, and customer inquiries.",
  //   tech: ["Next.js", "React", "Chart.js", "Mongoose"],
  //   problem:
  //     "The client was manually tracking orders in spreadsheets, leading to inventory discrepancies and delayed shipments.",
  //   features: [
  //     "Sales analytics dashboard",
  //     "Bulk inventory updates",
  //     "Order status tracking",
  //     "Customer message center",
  //   ],
  //   result:
  //     "Streamlined order processing time from 48 hours to less than 6 hours.",
  //   link: "#",
  //   github: "#",
  // },
  // {
  //   id: 8,
  //   category: "web",
  //   img: "/images/image8.jpeg",
  //   title: "Personal Finance Tracker",
  //   role: "Full-Stack Developer",
  //   description:
  //     "A personal finance management app that allows users to track expenses, set budgets, and visualize their spending habits via interactive charts.",
  //   tech: ["React", "Firebase", "Chart.js", "Tailwind (Legacy)"],
  //   problem:
  //     "Existing tools were too complex or didn't allow for simple, custom category tracking for a student's budget.",
  //   features: [
  //     "Expense categorization",
  //     "Monthly budget goals",
  //     "Spending visualizations",
  //     "Firebase real-time DB",
  //   ],
  //   result: "Helped 20+ beta testers save an average of 15% more each month.",
  //   link: "#",
  //   github: "#",
  // },
];

const filters = [
  { key: "all", label: "All" },
  { key: "product", label: "Products" },
  { key: "inter", label: "Interfaces" },
  { key: "web", label: "Web Apps" },
];

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useScrollReveal();

  useEffect(() => {
    const results =
      activeFilter === "all"
        ? projects
        : projects.filter((p) => p.category === activeFilter);

    setFilteredProjects([]);
    setTimeout(() => setFilteredProjects(results), 80);
  }, [activeFilter]);

  return (
    <section id="portfolio" className="portfolio">
      <ParticleMesh particleCount={50} />
      <div className="main-text" data-reveal="fade-up" data-delay="0">
        <span>Things I&apos;ve shipped</span>
        <h2>Projects</h2>
      </div>

      <div className="container">
        {/* Filter Buttons */}
        <div className="fillter-buttons" data-reveal="fade-up" data-delay="0.1">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`button ${activeFilter === f.key ? "active" : ""}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Portfolio Gallery */}
        <div className="portfolio-gallery">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`port-box show ${expanded === project.id ? "port-box--expanded" : ""}`}
              data-reveal="fade-up"
              data-delay={String(0.07 * index)}
            >
              <div className="port-image">
                <img src={project.img} alt={project.title} />
                <span className="port-role">{project.role}</span>
              </div>

              <div className="port-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                {/* Tech pills */}
                <div className="tech-pills">
                  {project.tech.map((t) => (
                    <span key={t} className="pill">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Expandable details */}
                {expanded === project.id && (
                  <div className="port-details">
                    <div className="port-detail-block">
                      <strong>Problem:</strong> {project.problem}
                    </div>
                    <div className="port-detail-block">
                      <strong>Key Features:</strong>
                      <ul>
                        {project.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="port-detail-block">
                      <strong>Result:</strong> {project.result}
                    </div>
                  </div>
                )}

                <div className="port-actions">
                  <button
                    className="port-toggle"
                    onClick={() =>
                      setExpanded(expanded === project.id ? null : project.id)
                    }
                  >
                    {expanded === project.id ? "Less Info" : "More Info"}
                  </button>

                  <div className="port-links">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Live Demo"
                    >
                      <FiExternalLink />
                    </a>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="GitHub"
                    >
                      <FiGithub />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
