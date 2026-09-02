"use client";

import { useState, useEffect } from "react";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./portfolio.css";

import defaultProjects from "../../../data/projects.json";

const filters = [
  { key: "all", label: "All" },
  { key: "product", label: "Products" },
  { key: "inter", label: "Interfaces" },
  { key: "web", label: "Web Apps" },
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
  const [filteredProjects, setFilteredProjects] = useState(defaultProjects);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);
  const [expanded, setExpanded] = useState(null);

  useScrollReveal();

  useEffect(() => {
    fetch("/api/admin/projects")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const sorted = [...data].sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
          setAllProjects(sorted);
          setFilteredProjects(
            activeFilter === "all"
              ? sorted
              : sorted.filter((p) => p.category === activeFilter)
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleFilterClick = (filterKey) => {
    setActiveFilter(filterKey);
    setVisibleCount(INITIAL_LIMIT);
    if (filterKey === "all") {
      setFilteredProjects(allProjects);
    } else {
      setFilteredProjects(allProjects.filter((p) => p.category === filterKey));
    }
  };

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = filteredProjects.length > visibleCount;

  const handleToggleShowMore = () => {
    if (hasMore) {
      setVisibleCount(prev => prev + 5);
    } else {
      setVisibleCount(INITIAL_LIMIT);
      document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
    }
  };

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
              onClick={() => handleFilterClick(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Portfolio Gallery */}
        <div className="portfolio-gallery">
          {displayedProjects.map((project, index) => (
            <div
              key={project.id}
              className={`port-box show ${expanded === project.id ? "port-box--expanded" : ""}`}
              data-reveal="fade-up"
              data-delay={String(0.07 * index)}
            >
              <div className="port-image">
                <img src={getProjectImage(project.img, index)} alt={project.title} />
                <span className="port-role">{project.role}</span>
              </div>

              <div className="port-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                {/* Tech pills */}
                <div className="tech-pills">
                  {(Array.isArray(project.tech) ? project.tech : []).map((t) => (
                    <span key={t} className="pill">{t}</span>
                  ))}
                </div>

                {/* Key features preview directly on card */}
                {Array.isArray(project.features) && project.features.length > 0 && (
                  <div className="port-features-preview">
                    <ul>
                      {project.features.slice(0, 3).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Expandable details */}
                {expanded === project.id && (
                  <div className="port-details">
                    {project.problem && (
                      <div className="port-detail-block">
                        <strong>Problem:</strong> {project.problem}
                      </div>
                    )}
                    {Array.isArray(project.features) && project.features.length > 0 && (
                      <div className="port-detail-block">
                        <strong>Key Features:</strong>
                        <ul>
                          {project.features.map((f) => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {project.result && (
                      <div className="port-detail-block">
                        <strong>Result:</strong> {project.result}
                      </div>
                    )}
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
                        title="GitHub Repository"
                      >
                        <FiGithub /> <span>Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More / Show Less Button */}
        {filteredProjects.length > INITIAL_LIMIT && (
          <div className="portfolio-load-more">
            <button className="btn-show-more" onClick={handleToggleShowMore}>
              <span>{hasMore ? "Explore More Projects" : "Show Less"}</span>
              {hasMore ? (
                <span className="load-more-badge">+{filteredProjects.length - visibleCount}</span>
              ) : (
                <span className="load-more-arrow">↑</span>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
