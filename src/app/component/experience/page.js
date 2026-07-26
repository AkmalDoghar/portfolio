"use client";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./experience.css";

const experiences = [
  {
    period: "2024 – Present",
    title: "Freelance Full-Stack Developer",
    type: "Freelance / Self-Employed",
    points: [
      "Built and deployed e-commerce stores for small businesses using Next.js, MongoDB, and Node.js.",
      "Developed custom admin dashboards with data tables, charts, and role-based access control.",
      "Implemented secure auth systems (JWT + bcrypt) reused across multiple client projects.",
      "Handled complete project lifecycle: requirements gathering, development, deployment, and handoff.",
    ],
    tech: ["Next.js", "React", "Node.js", "MongoDB"],
  },
  {
    period: "2023 – 2024",
    title: "Self-Directed Learning & Open Projects",
    type: "Personal Projects",
    points: [
      "Built 10+ projects from scratch to learn full-stack development in a real-world context.",
      "Contributed UI improvements to company websites (DaaSTech, DaaSForge) as a junior contributor.",
      "Explored REST API design, state management with Redux, and component-driven UI architecture.",
      "Documented and open-sourced personal projects to build GitHub presence.",
    ],
    tech: ["HTML", "CSS", "JavaScript", "React", "REST APIs", "Git"],
  },
];

export default function Experience() {
  useScrollReveal();

  return (
    <section id="experience" className="experience">
      <ParticleMesh particleCount={40} />
      <div className="main-text" data-reveal="fade-up" data-delay="0">
        <span>Where I&apos;ve applied my skills</span>
        <h2>Experience</h2>
      </div>

      <div className="timeline">
        {experiences.map((exp, index) => (
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
