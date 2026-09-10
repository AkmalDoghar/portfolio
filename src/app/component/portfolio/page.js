"use client";

import { useState, useEffect } from "react";
import { FiExternalLink, FiGithub, FiLayers, FiInfo, FiChevronUp } from "react-icons/fi";
import { FaCircleCheck, FaRocket, FaCode } from "react-icons/fa6";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./portfolio.css";

import defaultProjects from "../../../data/projects.json";

const filters = [
  { key: "all", label: "All Works" },
  { key: "web", label: "Web Apps" },
  { key: "product", label: "Products" },
  { key: "inter", label: "Interfaces" },
];

const INITIAL_LIMIT = 6;

const DEFAULT_IMAGES = [
  "/images/image1.jpeg",
  "/images/image2.jpeg",
  "/images/image3.jpeg",
];

const getProjectImage = (img, index) => {
  if (img && typeof img === "string" && img.trim().length > 0) {
    return img;
  }
  return DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
};

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [allProjects, setAllProjects] = useState(defaultProjects);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);
  const [expanded, setExpanded] = useState(null);

  useScrollReveal();

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const sorted = [...data].sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
          setAllProjects(sorted);
        }
      })
      .catch(() => {});
  }, []);

  const handleFilterClick = (filterKey) => {
    setActiveFilter(filterKey);
    setVisibleCount(INITIAL_LIMIT);
  };

  const filteredProjects = allProjects.filter((p) => {
    if (activeFilter === "all") return true;
    return p.category === activeFilter;
  });

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = filteredProjects.length > visibleCount;

  const handleToggleShowMore = () => {
    if (hasMore) {
      setVisibleCount((prev) => prev + 6);
    } else {
      setVisibleCount(INITIAL_LIMIT);
      document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Calculate counts per filter
  const counts = {
    all: allProjects.length,
    web: allProjects.filter((p) => p.category === "web").length,
    product: allProjects.filter((p) => p.category === "product").length,
    inter: allProjects.filter((p) => p.category === "inter").length,
  };

  return (
    <section id="portfolio" className="portfolio">
      <ParticleMesh particleCount={40} />

      <div className="main-text" data-reveal="fade-up" data-delay="0">
        <span>Shipped Products &amp; Applications</span>
        <h2>Projects Showcase</h2>
      </div>

      <div className="container">
        {/* Filter Buttons with Count Badges */}
        <div className="fillter-buttons" data-reveal="fade-up" data-delay="0.1">
          {filters.map((f) => {
            const countVal = counts[f.key] || 0;
            return (
              <button
                key={f.key}
                className={`button ${activeFilter === f.key ? "active" : ""}`}
                onClick={() => handleFilterClick(f.key)}
              >
                {f.key === "all" && <FiLayers className="filter-tab-icon" />}
                {f.label}
                <span className="port-tab-count">{countVal}</span>
              </button>
            );
          })}
        </div>

        {/* Portfolio Gallery Grid */}
        <div key={`port-gallery-${activeFilter}`} className="portfolio-gallery port-animate-in">
          {displayedProjects.map((project, index) => {
            const isExpanded = expanded === project.id;
            return (
              <div
                key={project.id || project.title}
                className={`port-box ${isExpanded ? "port-box--expanded" : ""}`}
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <div className="port-card-glow"></div>

                {/* Card Media Area with Hover Overlay */}
                <div className="port-image">
                  <img src={getProjectImage(project.img, index)} alt={project.title} loading="lazy" />
                  <div className="port-image-overlay">
                    <div className="overlay-links">
                      {project.link && project.link !== "#" && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="overlay-btn overlay-btn-demo"
                          title="Live Demo"
                        >
                          <FiExternalLink /> Live Demo
                        </a>
                      )}
                      {project.github && project.github !== "#" && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="overlay-btn overlay-btn-code"
                          title="GitHub Source Code"
                        >
                          <FiGithub /> Source Code
                        </a>
                      )}
                    </div>
                  </div>

                  {project.role && <span className="port-role-badge">{project.role}</span>}
                </div>

                {/* Card Content Area */}
                <div className="port-content">
                  <div className="port-header-row">
                    <h3>{project.title}</h3>
                  </div>

                  <p className="port-desc">{project.description}</p>

                  {/* Tech Stack Pills */}
                  {Array.isArray(project.tech) && project.tech.length > 0 && (
                    <div className="tech-pills">
                      {project.tech.map((t) => (
                        <span key={t} className="pill">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Features Bullet Preview */}
                  {Array.isArray(project.features) && project.features.length > 0 && (
                    <div className="port-features-preview">
                      <ul>
                        {project.features.slice(0, 2).map((f, i) => (
                          <li key={i}>
                            <FaCircleCheck className="feat-check-icon" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Expandable Case Study Details */}
                  {isExpanded && (
                    <div className="port-details port-details-animated">
                      {project.problem && (
                        <div className="port-detail-block">
                          <strong>Problem &amp; Challenge:</strong>
                          <p>{project.problem}</p>
                        </div>
                      )}
                      {Array.isArray(project.features) && project.features.length > 2 && (
                        <div className="port-detail-block">
                          <strong>Full Feature List:</strong>
                          <ul>
                            {project.features.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {project.result && (
                        <div className="port-detail-block port-result-block">
                          <strong>Outcome &amp; Impact:</strong>
                          <p>{project.result}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Footer Actions */}
                  <div className="port-actions">
                    <button
                      className="port-toggle"
                      onClick={() => setExpanded(isExpanded ? null : project.id)}
                    >
                      <FiInfo />
                      <span>{isExpanded ? "Collapse" : "Case Details"}</span>
                    </button>

                    <div className="port-links">
                      {project.link && project.link !== "#" && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="port-link-btn"
                          title="Live Demo"
                        >
                          <FiExternalLink /> <span>Demo</span>
                        </a>
                      )}
                      {project.github && project.github !== "#" && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="port-link-btn port-link-btn--code"
                          title="Code"
                        >
                          <FiGithub /> <span>Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More / Show Less Action */}
        {filteredProjects.length > INITIAL_LIMIT && (
          <div className="portfolio-load-more">
            <button className="btn-show-more" onClick={handleToggleShowMore}>
              <span>{hasMore ? "Explore More Works" : "Show Less"}</span>
              {hasMore ? (
                <span className="load-more-badge">+{filteredProjects.length - visibleCount}</span>
              ) : (
                <span className="load-more-arrow"><FiChevronUp /></span>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

