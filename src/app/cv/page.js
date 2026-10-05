"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiPrinter, FiArrowLeft, FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiGlobe, FiExternalLink } from "react-icons/fi";
import "./cv.css";

const TEMPLATES = [
  { id: "executive", label: "🏢 Executive Slate" },
  { id: "minimalist", label: "📄 Minimalist Corporate" },
  { id: "techlead", label: "💻 Tech Lead Gradient" },
  { id: "compact", label: "⚡ Compact Two-Column" },
];

export default function PublicCvPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState("executive");

  useEffect(() => {
    fetch("/api/admin/cv-content", { cache: "no-store" })
      .then((res) => res.json())
      .then((d) => {
        if (d && d.personalInfo) {
          setData(d);
          if (d.activeTemplate) setActiveTemplate(d.activeTemplate);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleTemplateChange = (tplId) => {
    setActiveTemplate(tplId);
    if (data) {
      const updated = { ...data, activeTemplate: tplId };
      setData(updated);
      fetch("/api/admin/cv-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      }).catch(() => {});
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
      }
      if (window.getSelection) {
        window.getSelection()?.removeAllRanges();
      }
      setTimeout(() => {
        window.print();
      }, 50);
    }
  };

  if (loading) {
    return (
      <div className="cv-page-root" style={{ justifyContent: "center" }}>
        <p style={{ color: "#12f7ff", fontSize: "1.1rem" }}>Loading Resume / CV Document...</p>
      </div>
    );
  }

  if (!data || !data.personalInfo) {
    return (
      <div className="cv-page-root" style={{ justifyContent: "center" }}>
        <p style={{ color: "#f87171" }}>Failed to load CV data. Please check back later.</p>
        <Link href="/" className="cv-back-btn" style={{ marginTop: "1rem" }}>
          <FiArrowLeft /> Back to Portfolio
        </Link>
      </div>
    );
  }

  const { personalInfo, experience = [], education = [], skills = {}, projects = [] } = data;

  const getPrimaryColor = () => {
    let col = data.primaryColor || "#0284c7";
    if (!col.startsWith("#") && !col.startsWith("var") && !col.startsWith("rgb")) {
      col = "#" + col;
    }
    return col;
  };

  return (
    <div className="cv-page-root" style={{ "--cv-primary": getPrimaryColor() }}>
      {/* Top Action Bar */}
      <div className="cv-top-bar">
        <Link href="/" className="cv-back-btn">
          <FiArrowLeft /> Back to Portfolio
        </Link>

        {/* Live Template Selector */}
        <div className="cv-template-selector">
          <span style={{ fontSize: "0.78rem", color: "#cbd5e1", fontWeight: 600, paddingLeft: "8px" }}>
            Template:
          </span>
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              className={`cv-tpl-btn ${activeTemplate === tpl.id ? "active" : ""}`}
              onClick={() => handleTemplateChange(tpl.id)}
            >
              {tpl.label}
            </button>
          ))}
        </div>

        <button onClick={handlePrint} className="cv-print-btn">
          <FiPrinter /> Save as PDF / Print
        </button>
      </div>

      {/* CV Paper Card */}
      <div className={`cv-document cv-template--${activeTemplate}`}>
        {/* TEMPLATE TYPE 4: COMPACT TWO-COLUMN */}
        {activeTemplate === "compact" ? (
          <div className="cv-template--compact">
            {/* Sidebar */}
            <aside className="cv-sidebar">
              <h1 className="cv-name">{personalInfo.name}</h1>
              <p className="cv-job-title">{personalInfo.title}</p>

              <div className="cv-contacts">
                {personalInfo.email && (
                  <div className="cv-contact-item">
                    <FiMail style={{ color: "var(--cv-primary)" }} />
                    <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="cv-contact-item">
                    <FiPhone style={{ color: "var(--cv-primary)" }} />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="cv-contact-item">
                    <FiMapPin style={{ color: "var(--cv-primary)" }} />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo.website && (
                  <div className="cv-contact-item">
                    <FiGlobe style={{ color: "var(--cv-primary)" }} />
                    <a href={personalInfo.website} target="_blank" rel="noreferrer">
                      Website
                    </a>
                  </div>
                )}
                {personalInfo.github && (
                  <div className="cv-contact-item">
                    <FiGithub style={{ color: "var(--cv-primary)" }} />
                    <a href={personalInfo.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  </div>
                )}
              </div>

              {/* Skills in Sidebar */}
              <section style={{ marginBottom: "2rem" }}>
                <h2 className="cv-section-title">Skills</h2>
                {Object.entries(skills).map(([cat, tags]) => (
                  <div key={cat} className="cv-skills-group">
                    <div className="cv-skills-label" style={{ textTransform: "capitalize" }}>
                      {cat}
                    </div>
                    <div className="cv-skill-tags">
                      {(tags || []).map((t, idx) => (
                        <span key={idx} className="cv-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </section>

              {/* Education in Sidebar */}
              {education.length > 0 && (
                <section>
                  <h2 className="cv-section-title">Education</h2>
                  {education.map((edu, i) => (
                    <div key={i} className="cv-item" style={{ marginBottom: "1rem" }}>
                      <div className="cv-item-role" style={{ fontSize: "0.88rem" }}>
                        {edu.degree}
                      </div>
                      <div className="cv-item-company" style={{ fontSize: "0.8rem" }}>
                        {edu.institution} ({edu.period})
                      </div>
                    </div>
                  ))}
                </section>
              )}
            </aside>

            {/* Main Column */}
            <main className="cv-main">
              {personalInfo.summary && (
                <section style={{ marginBottom: "1.75rem" }}>
                  <h2 className="cv-section-title">Executive Summary</h2>
                  <p style={{ fontSize: "0.9rem", color: "#334155", lineHeight: 1.6, margin: 0 }}>
                    {personalInfo.summary}
                  </p>
                </section>
              )}

              {experience.length > 0 && (
                <section style={{ marginBottom: "1.75rem" }}>
                  <h2 className="cv-section-title">Work Experience</h2>
                  {experience.map((exp, i) => (
                    <div key={i} className="cv-item">
                      <div className="cv-item-header">
                        <span className="cv-item-role">{exp.role}</span>
                        <span className="cv-item-period">{exp.period}</span>
                      </div>
                      <div className="cv-item-company">{exp.company}</div>
                      {Array.isArray(exp.bullets) && (
                        <ul className="cv-bullets">
                          {exp.bullets.map((b, idx) => (
                            <li key={idx}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {projects.length > 0 && (
                <section>
                  <h2 className="cv-section-title">Featured Projects</h2>
                  {projects.map((p, i) => (
                    <div key={i} className="cv-item">
                      <div className="cv-item-header">
                        <span className="cv-item-role" style={{ fontSize: "0.95rem" }}>
                          {p.title}
                        </span>
                        {p.link && (
                          <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: "0.8rem", color: "var(--cv-primary)", fontWeight: 600 }}>
                            Link ↗
                          </a>
                        )}
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "#475569", margin: 0 }}>{p.desc}</p>
                    </div>
                  ))}
                </section>
              )}
            </main>
          </div>
        ) : (
          /* TEMPLATES 1, 2, and 3 */
          <>
            <header className="cv-header">
              <div>
                <h1 className="cv-name">{personalInfo.name}</h1>
                <p className="cv-job-title">{personalInfo.title}</p>
                {personalInfo.summary && <p className="cv-summary">{personalInfo.summary}</p>}
              </div>

              <div className="cv-contacts">
                {personalInfo.email && (
                  <div className="cv-contact-item">
                    <FiMail style={{ color: "var(--cv-primary)" }} />
                    <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="cv-contact-item">
                    <FiPhone style={{ color: "var(--cv-primary)" }} />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="cv-contact-item">
                    <FiMapPin style={{ color: "var(--cv-primary)" }} />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo.website && (
                  <div className="cv-contact-item">
                    <FiGlobe style={{ color: "var(--cv-primary)" }} />
                    <a href={personalInfo.website} target="_blank" rel="noreferrer">
                      akmalcode.vercel.app
                    </a>
                  </div>
                )}
                {personalInfo.github && (
                  <div className="cv-contact-item">
                    <FiGithub style={{ color: "var(--cv-primary)" }} />
                    <a href={personalInfo.github} target="_blank" rel="noreferrer">
                      GitHub Profile
                    </a>
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div className="cv-contact-item">
                    <FiLinkedin style={{ color: "var(--cv-primary)" }} />
                    <a href={personalInfo.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </header>

            <div className={activeTemplate === "techlead" ? "cv-body-wrap" : ""}>
              <div className="cv-grid">
                {/* Left Column */}
                <div>
                  {/* Experience */}
                  {experience.length > 0 && (
                    <section style={{ marginBottom: "2rem" }}>
                      <h2 className="cv-section-title">Work &amp; Project Experience</h2>
                      {experience.map((exp, i) => (
                        <div key={exp.id || i} className="cv-item">
                          <div className="cv-item-header">
                            <span className="cv-item-role">{exp.role}</span>
                            <span className="cv-item-period">{exp.period}</span>
                          </div>
                          <div className="cv-item-company">{exp.company}</div>
                          {exp.description && (
                            <p style={{ fontSize: "0.88rem", color: "#475569", margin: "0 0 6px 0" }}>
                              {exp.description}
                            </p>
                          )}
                          {Array.isArray(exp.bullets) && exp.bullets.length > 0 && (
                            <ul className="cv-bullets">
                              {exp.bullets.map((b, idx) => (
                                <li key={idx}>{b}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </section>
                  )}

                  {/* Projects */}
                  {projects.length > 0 && (
                    <section>
                      <h2 className="cv-section-title">Featured Projects</h2>
                      {projects.map((proj, i) => (
                        <div key={proj.id || i} className="cv-item">
                          <div className="cv-item-header">
                            <span className="cv-item-role" style={{ fontSize: "0.98rem" }}>
                              {proj.title}
                            </span>
                            {proj.link && (
                              <a
                                href={proj.link}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  fontSize: "0.8rem",
                                  color: "var(--cv-primary)",
                                  fontWeight: 600,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "3px",
                                }}
                              >
                                Live Demo <FiExternalLink />
                              </a>
                            )}
                          </div>
                          {proj.tech && (
                            <div style={{ fontSize: "0.82rem", color: "var(--cv-primary)", fontWeight: 600, marginBottom: "4px" }}>
                              {proj.tech}
                            </div>
                          )}
                          <p style={{ fontSize: "0.88rem", color: "#475569", margin: 0 }}>
                            {proj.desc}
                          </p>
                        </div>
                      ))}
                    </section>
                  )}
                </div>

                {/* Right Column */}
                <div>
                  {/* Skills */}
                  <section style={{ marginBottom: "2rem" }}>
                    <h2 className="cv-section-title">Technical Expertise</h2>
                    {skills.frontend && skills.frontend.length > 0 && (
                      <div className="cv-skills-group">
                        <div className="cv-skills-label">Frontend Development</div>
                        <div className="cv-skill-tags">
                          {skills.frontend.map((s, idx) => (
                            <span key={idx} className="cv-tag">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {skills.backend && skills.backend.length > 0 && (
                      <div className="cv-skills-group">
                        <div className="cv-skills-label">Backend &amp; Databases</div>
                        <div className="cv-skill-tags">
                          {skills.backend.map((s, idx) => (
                            <span key={idx} className="cv-tag">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {skills.tools && skills.tools.length > 0 && (
                      <div className="cv-skills-group">
                        <div className="cv-skills-label">Developer Tools</div>
                        <div className="cv-skill-tags">
                          {skills.tools.map((s, idx) => (
                            <span key={idx} className="cv-tag">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Education */}
                  {education.length > 0 && (
                    <section style={{ marginBottom: "2rem" }}>
                      <h2 className="cv-section-title">Education &amp; Credentials</h2>
                      {education.map((edu, i) => (
                        <div key={edu.id || i} className="cv-item" style={{ marginBottom: "1rem" }}>
                          <div className="cv-item-role" style={{ fontSize: "0.95rem" }}>
                            {edu.degree}
                          </div>
                          <div className="cv-item-company" style={{ fontSize: "0.85rem", margin: "2px 0 4px 0" }}>
                            {edu.institution} ({edu.period})
                          </div>
                          {edu.details && (
                            <p style={{ fontSize: "0.84rem", color: "#64748b", margin: 0 }}>
                              {edu.details}
                            </p>
                          )}
                        </div>
                      ))}
                    </section>
                  )}

                  {/* Languages */}
                  {Array.isArray(data.languages) && data.languages.length > 0 && (
                    <section>
                      <h2 className="cv-section-title">Languages</h2>
                      <div className="cv-skill-tags">
                        {data.languages.map((lang, idx) => (
                          <span
                            key={idx}
                            className="cv-tag"
                            style={{
                              background: "rgba(2, 132, 199, 0.08)",
                              color: "var(--cv-primary)",
                              borderColor: "var(--cv-primary)",
                              fontWeight: 600,
                            }}
                          >
                            🗣️ {lang}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
