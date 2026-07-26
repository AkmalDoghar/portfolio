"use client";
import { useEffect, useRef, useState } from "react";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./skills.css";

const technicalSkills = [
  { name: "HTML5", percent: 95, class: "html", level: "Advanced" },
  { name: "CSS3", percent: 90, class: "css", level: "Advanced" },
  {
    name: "JavaScript (ES6+)",
    percent: 80,
    class: "javascript",
    level: "Intermediate",
  },
  { name: "React.js", percent: 78, class: "reactjs", level: "Intermediate" },
  { name: "Next.js", percent: 82, class: "nextjs", level: "Intermediate" },
  {
    name: "Node.js / Express",
    percent: 65,
    class: "nodejs",
    level: "Intermediate",
  },
  { name: "MongoDB", percent: 65, class: "mongodb", level: "Intermediate" },
  { name: "Git & GitHub", percent: 80, class: "git", level: "Intermediate" },
];

const professionalSkills = [
  { name: "Team Work", percent: 90 },
  { name: "Problem Solving", percent: 80 },
  { name: "Project Management", percent: 70 },
  { name: "Communication", percent: 75 },
];

const tools = [
  "VS Code",
  "Antigravity",
  "Android Studio",
  "GitHub",
  "Vercel",
  "MongoDB Atlas",
  "npm",
];

export default function Skills() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useScrollReveal();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="skills" ref={sectionRef}>
      <ParticleMesh particleCount={40} />
      <div className="main-text" data-reveal="fade-up" data-delay="0">
        <span>What I work with</span>
        <h2>My Skills</h2>
      </div>

      <div className="skill-main">
        {/* Left Side - Technical */}
        <div className="skill-left" data-reveal="fade-left" data-delay="0.1">
          <h3>Technical Skills</h3>
          <div className="bar-box">
            {technicalSkills.map((skill, index) => (
              <div className="skill-bar" key={skill.name}>
                <div className="info">
                  <p>
                    {skill.name}{" "}
                    <span className="skill-level">{skill.level}</span>
                  </p>
                  <p>{skill.percent}%</p>
                </div>
                <div className="bar">
                  <span
                    className={skill.class}
                    style={{
                      width: isVisible ? `${skill.percent}%` : "0%",
                      transitionDelay: isVisible ? `${index * 0.4}s` : "0s",
                    }}
                  ></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Professional */}
        <div className="skill-right" data-reveal="fade-right" data-delay="0.1">
          <h3>Professional Skills</h3>
          <div className="professional">
            {professionalSkills.map((skill, index) => (
              <SkillCircle
                key={skill.name}
                skill={skill}
                isVisible={isVisible}
                index={index}
              />
            ))}
          </div>

          {/* Tools Section */}
          <div
            className="tools-section"
            data-reveal="fade-up"
            data-delay="0.25"
          >
            <h3>Tools &amp; Platforms</h3>
            <div className="tools-chips">
              {tools.map((tool) => (
                <span key={tool} className="tool-chip">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillCircle({ skill, isVisible, index }) {
  const dots = 80;
  const rotate = 360 / dots;
  const percent = Math.floor((dots * skill.percent) / 100);

  return (
    <div className="box">
      <div className="circle">
        {[...Array(dots)].map((_, i) => (
          <div
            key={i}
            className={`points ${isVisible && i < percent ? "marked" : ""}`}
            style={{
              "--i": i,
              "--rot": `${rotate}deg`,
              "--delay-offset": `${index * 1}s`,
            }}
          ></div>
        ))}
      </div>
      <div className="text">
        <big>{isVisible ? skill.percent : 0}%</big>
        <small>{skill.name}</small>
      </div>
    </div>
  );
}
