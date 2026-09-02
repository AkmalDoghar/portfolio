"use client";
import { useEffect, useRef, useState } from "react";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./skills.css";

const defaultSkillsData = {
  technical: [
    { id: 1, name: "Next.js", percent: 85, class: "nextjs", level: "Advanced", capabilities: "SSR/SSG, App Router, API routes & authentication" },
    { id: 2, name: "React.js", percent: 85, class: "reactjs", level: "Advanced", capabilities: "Component architecture, state management & hooks" },
    { id: 3, name: "Node.js & Express", percent: 80, class: "nodejs", level: "Intermediate", capabilities: "REST APIs, server middleware & JWT auth" },
    { id: 4, name: "MongoDB & Mongoose", percent: 80, class: "mongodb", level: "Intermediate", capabilities: "Database design, schema modeling & CRUD" },
    { id: 5, name: "JavaScript (ES6+)", percent: 88, class: "javascript", level: "Advanced", capabilities: "Async/await, ES modules, DOM & Fetch API" },
    { id: 6, name: "CSS3 & HTML5", percent: 90, class: "css", level: "Advanced", capabilities: "Responsive layouts, glassmorphic UI & animations" },
    { id: 7, name: "Git & GitHub", percent: 85, class: "git", level: "Intermediate", capabilities: "Version control, branching & pull requests" },
  ],
  professional: [
    { id: 1, name: "Problem Solving", percent: 85 },
    { id: 2, name: "Clean Architecture", percent: 85 },
    { id: 3, name: "Team Communication", percent: 80 },
    { id: 4, name: "Project Delivery", percent: 75 },
  ],
  tools: ["VS Code", "GitHub", "Vercel", "MongoDB Atlas", "Postman", "npm / npx", "Cloudinary"],
};

export default function Skills() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [skillsData, setSkillsData] = useState(defaultSkillsData);

  useScrollReveal();

  useEffect(() => {
    fetch("/api/admin/skills")
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === "object" && !Array.isArray(data) && data.technical?.length) {
          setSkillsData({
            technical: data.technical || [],
            professional: data.professional || [],
            tools: data.tools || [],
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setIsVisible(entry.isIntersecting); },
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
            {skillsData.technical.map((skill, index) => (
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
                {skill.capabilities && (
                  <p className="skill-capabilities">{skill.capabilities}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Professional */}
        <div className="skill-right" data-reveal="fade-right" data-delay="0.1">
          <h3>Professional Skills</h3>
          <div className="professional">
            {skillsData.professional.map((skill, index) => (
              <SkillCircle
                key={skill.name}
                skill={skill}
                isVisible={isVisible}
                index={index}
              />
            ))}
          </div>

          {/* Tools Section */}
          <div className="tools-section" data-reveal="fade-up" data-delay="0.25">
            <h3>Tools &amp; Platforms</h3>
            <div className="tools-chips">
              {skillsData.tools.map((tool) => (
                <span key={tool} className="tool-chip">{tool}</span>
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
