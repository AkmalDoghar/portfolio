"use client";
import { useState, useEffect } from "react";
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
      <ParticleMesh particleCount={40} />
      <div className="main-text" data-reveal="fade-up" data-delay="0">
        <span>Where I&apos;ve applied my skills</span>
        <h2>Experience</h2>
      </div>

      <div className="timeline">
        {experiencesList.map((exp, index) => (
          <div
            key={index}
            className={`timeline-item timeline-item--${index % 2 === 0 ? "left" : "right"}`}
            data-reveal={index % 2 === 0 ? "fade-left" : "fade-right"}
            data-delay={String(0.1 * index)}
          >
            <div className="timeline-dot"></div>
            <div className="timeline-card">
              <span className="timeline-period">{exp.period}</span>
              <h3>{exp.title}</h3>
              <span className="timeline-type">{exp.type}</span>
              <ul>
                {exp.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              <div className="timeline-tech">
                {exp.tech.map((t) => (
                  <span key={t} className="pill">{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
