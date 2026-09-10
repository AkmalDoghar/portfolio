"use client";
import { useState, useEffect } from "react";
import { FiBriefcase, FiCalendar, FiCheck } from "react-icons/fi";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./experience.css";

const defaultExperiences = [
  {
    id: 1,
    period: "2025 – Present",
    title: "Freelance Frontend & Web Development",
    type: "Freelance / Client Work",
    points: [
      "Developed responsive frontend interfaces and product storefronts for web clients (e.g. Libaas e Zauq and DaaS Tech admin panel).",
      "Integrated REST APIs, component logic, and responsive layouts tailored to client specifications.",
      "Handled project deployments on Vercel, DNS configurations, and client review iterations.",
    ],
    tech: ["Next.js", "React", "Node.js", "MongoDB", "TailwindCSS"],
  },
  {
    id: 2,
    period: "2024 – 2025 (1 year)",
    title: "Full-Stack Application Engineering",
    type: "Personal & Production Projects",
    points: [
      "Engineered full-stack applications including SkyPulse PRO (Weather PWA) and CartifyOutlet e-commerce platform.",
      "Implemented secure authentication (JWT + bcrypt), custom state management, and real-time PWA features.",
      "Built dynamic UI dashboards, interactive charting widgets, and RESTful middleware endpoints.",
      "Maintained structured commit history and documented codebases open-sourced on GitHub.",
    ],
    tech: ["Next.js", "React", "Node.js", "Express", "MongoDB", "PWA"],
  },
  {
    id: 3,
    period: "2023 – 2024",
    title: "Web Engineering Foundations & Practice Labs",
    type: "Learning & Open Source",
    points: [
      "Built 10+ practice applications from scratch to master modern full-stack web development.",
      "Contributed UI improvements and responsive styling fixes to company repository codebases.",
      "Practiced RESTful architecture, state management patterns, and git-based workflows.",
    ],
    tech: ["JavaScript (ES6+)", "React", "HTML5", "CSS3", "Git"],
  },
];

export default function Experience() {
  const [experiencesList, setExperiencesList] = useState(defaultExperiences);
  useScrollReveal();

  useEffect(() => {
    fetch("/api/admin/experience")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setExperiencesList(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="experience" className="experience">
      <ParticleMesh particleCount={35} />
      <div className="main-text" data-reveal="fade-up" data-delay="0">
        <span>Career &amp; Engineering Track</span>
        <h2>Work Experience</h2>
      </div>

      <div className="timeline">
        {experiencesList.map((exp, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div
              key={exp.id || index}
              className={`timeline-item timeline-item--${isLeft ? "left" : "right"}`}
              data-reveal={isLeft ? "fade-left" : "fade-right"}
              data-delay={String(0.08 * index)}
            >
              <div className="timeline-dot">
                <FiBriefcase className="dot-icon" />
              </div>
              <div className="timeline-card">
                <div className="timeline-header">
                  <span className="timeline-period">
                    <FiCalendar className="period-icon" /> {exp.period}
                  </span>
                  {exp.type && <span className="timeline-type-pill">{exp.type}</span>}
                </div>

                <h3>{exp.title}</h3>

                <ul className="timeline-points">
                  {Array.isArray(exp.points) &&
                    exp.points.map((point, i) => (
                      <li key={i}>
                        <FiCheck className="point-check" />
                        <span>{point}</span>
                      </li>
                    ))}
                </ul>

                {Array.isArray(exp.tech) && exp.tech.length > 0 && (
                  <div className="timeline-tech">
                    {exp.tech.map((t) => (
                      <span key={t} className="pill">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

