"use client";
import { useEffect, useRef, useState } from "react";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./skills.css";

// Import Official Tech Icons from react-icons
import {
  SiNextdotjs,
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiJavascript,
  SiCss3,
  SiHtml5,
  SiGit,
  SiGithub,
  SiVercel,
  SiNpm,
  SiTailwindcss,
  SiTypescript,
  SiPostman,
  SiFigma,
} from "react-icons/si";

import { VscVscode } from "react-icons/vsc";

import {
  FaBrain,
  FaCode,
  FaComments,
  FaRocket,
  FaLaptopCode,
  FaSitemap,
  FaWrench,
  FaCircleCheck,
  FaLayerGroup,
  FaWandMagicSparkles,
} from "react-icons/fa6";

const defaultSkillsData = {
  technical: [
    {
      id: 1,
      name: "Next.js",
      percent: 85,
      level: "Advanced",
      category: "frontend",
      featured: true,
      tag: "CORE STACK",
      capabilities: "SSR/SSG, App Router, API Routes & Auth",
      color: "#ffffff",
    },
    {
      id: 2,
      name: "React.js",
      percent: 85,
      level: "Advanced",
      category: "frontend",
      featured: true,
      tag: "CORE STACK",
      capabilities: "Hooks, Redux / Context, Reusable Components",
      color: "#61dafb",
    },
    {
      id: 3,
      name: "JavaScript (ES6+)",
      percent: 88,
      level: "Advanced",
      category: "frontend",
      featured: false,
      tag: "LANGUAGE",
      capabilities: "Async/Await, Modern Syntax, DOM & Fetch API",
      color: "#f7df1e",
    },
    {
      id: 4,
      name: "CSS3 & HTML5",
      percent: 90,
      level: "Advanced",
      category: "frontend",
      featured: false,
      tag: "UI / STYLING",
      capabilities: "Responsive Layouts, Glassmorphism, CSS Animations",
      color: "#2965f1",
    },
    {
      id: 5,
      name: "Node.js & Express",
      percent: 80,
      level: "Intermediate",
      category: "backend",
      featured: true,
      tag: "SERVER SIDE",
      capabilities: "REST APIs, Middleware, JWT Auth",
      color: "#68a063",
    },
    {
      id: 6,
      name: "MongoDB & Mongoose",
      percent: 80,
      level: "Intermediate",
      category: "backend",
      featured: true,
      tag: "DATABASE",
      capabilities: "Database Design, Aggregation Pipelines, Schema Modeling",
      color: "#47a248",
    },
    {
      id: 7,
      name: "Git & GitHub",
      percent: 85,
      level: "Intermediate",
      category: "tools",
      featured: false,
      tag: "DEVOPS",
      capabilities: "Version Control, Branching Strategy, CI/CD Workflows",
      color: "#f05032",
    },
  ],
  professional: [
    { id: 1, name: "Problem Solving", percent: 90, icon: "brain", desc: "Algorithmic thinking & debugging complex architecture" },
    { id: 2, name: "Clean Architecture", percent: 88, icon: "sitemap", desc: "Modular, scalable & maintainable code structure" },
    { id: 3, name: "Team Communication", percent: 85, icon: "comments", desc: "Technical documentation & cross-functional collaboration" },
    { id: 4, name: "Project Delivery", percent: 80, icon: "rocket", desc: "On-time execution, sprint planning & performance optimization" },
  ],
  tools: [
    { name: "Antigravity", icon: "antigravity", badge: "AI PAIR PROGRAMMER" },
    { name: "VS Code", icon: "vscode", badge: "IDE" },
    { name: "GitHub", icon: "github", badge: "VCS" },
    { name: "Vercel", icon: "vercel", badge: "DEPLOYMENT" },
    { name: "MongoDB Atlas", icon: "mongodb", badge: "CLOUD DB" },
    { name: "npm / npx", icon: "npm", badge: "PACKAGE MGR" },
    { name: "Postman", icon: "postman", badge: "API TESTING" },
  ],
};

// Helper to determine skill category dynamically
function getSkillCategory(skill) {
  if (skill.category) return skill.category;
  const n = (skill.name || "").toLowerCase();
  if (n.includes("next") || n.includes("react") || n.includes("js") || n.includes("css") || n.includes("html") || n.includes("tailwind")) {
    return "frontend";
  }
  if (n.includes("node") || n.includes("express") || n.includes("mongo") || n.includes("sql") || n.includes("backend")) {
    return "backend";
  }
  return "tools";
}

// Render exact tech icon based on name
function getTechIcon(name) {
  const n = (name || "").toLowerCase();
  if (n.includes("next")) return <SiNextdotjs style={{ color: "#ffffff" }} />;
  if (n.includes("react")) return <SiReact style={{ color: "#61dafb" }} />;
  if (n.includes("node") || n.includes("express")) return <SiNodedotjs style={{ color: "#68a063" }} />;
  if (n.includes("mongo")) return <SiMongodb style={{ color: "#47a248" }} />;
  if (n.includes("js") || n.includes("javascript")) return <SiJavascript style={{ color: "#f7df1e" }} />;
  if (n.includes("css") || n.includes("html")) return <SiCss3 style={{ color: "#2965f1" }} />;
  if (n.includes("git") && !n.includes("hub")) return <SiGit style={{ color: "#f05032" }} />;
  if (n.includes("github")) return <SiGithub style={{ color: "#ffffff" }} />;
  if (n.includes("vercel")) return <SiVercel style={{ color: "#ffffff" }} />;
  if (n.includes("vscode") || n.includes("vs code")) return <VscVscode style={{ color: "#007acc" }} />;
  if (n.includes("npm")) return <SiNpm style={{ color: "#cb3837" }} />;
  if (n.includes("postman")) return <SiPostman style={{ color: "#ff6c37" }} />;
  if (n.includes("tailwind")) return <SiTailwindcss style={{ color: "#06b6d4" }} />;
  if (n.includes("type")) return <SiTypescript style={{ color: "#3178c6" }} />;
  if (n.includes("figma")) return <SiFigma style={{ color: "#f24e1e" }} />;
  if (n.includes("antigravity")) return <FaWandMagicSparkles className="ai-sparkle-icon" />;
  
  return <FaLaptopCode style={{ color: "#12f7ff" }} />;
}

// Render tool icon
function getToolIcon(tool) {
  const t = typeof tool === "string" ? tool.toLowerCase() : (tool.name || "").toLowerCase();
  if (t.includes("antigravity")) return <FaWandMagicSparkles className="ai-sparkle-icon" />;
  if (t.includes("vscode") || t.includes("vs code")) return <VscVscode style={{ color: "#007acc" }} />;
  if (t.includes("github")) return <SiGithub style={{ color: "#ffffff" }} />;
  if (t.includes("vercel")) return <SiVercel style={{ color: "#ffffff" }} />;
  if (t.includes("mongo")) return <SiMongodb style={{ color: "#47a248" }} />;
  if (t.includes("npm")) return <SiNpm style={{ color: "#cb3837" }} />;
  if (t.includes("postman")) return <SiPostman style={{ color: "#ff6c37" }} />;
  return <FaWrench style={{ color: "#12f7ff" }} />;
}

// Render soft skill icon
function getProfIcon(iconName) {
  switch (iconName) {
    case "brain":
      return <FaBrain className="bento-prof-icon" />;
    case "sitemap":
      return <FaSitemap className="bento-prof-icon" />;
    case "comments":
      return <FaComments className="bento-prof-icon" />;
    case "rocket":
      return <FaRocket className="bento-prof-icon" />;
    default:
      return <FaCircleCheck className="bento-prof-icon" />;
  }
}

export default function Skills() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [skillsData, setSkillsData] = useState(defaultSkillsData);
  const [activeTab, setActiveTab] = useState("all");

  useScrollReveal();

  useEffect(() => {
    fetch("/api/admin/skills", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (
          data &&
          typeof data === "object" &&
          !Array.isArray(data) &&
          data.technical?.length
        ) {
          // Normalize dynamic technical skills with categories
          const normalizedTech = (data.technical || []).map((skill) => ({
            ...skill,
            category: getSkillCategory(skill),
          }));

          setSkillsData({
            technical: normalizedTech,
            professional: data.professional || defaultSkillsData.professional,
            tools: data.tools || defaultSkillsData.tools,
          });
        }
      })
      .catch(() => {});
  }, []);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Filter tech skills based on activeTab
  const filteredTechnical = skillsData.technical.filter((skill) => {
    if (activeTab === "all") return true;
    const cat = getSkillCategory(skill);
    if (activeTab === "frontend") return cat === "frontend";
    if (activeTab === "backend") return cat === "backend";
    if (activeTab === "tools") return cat === "tools";
    return false;
  });

  // Calculate Tab Counts
  const counts = {
    all: skillsData.technical.length + skillsData.tools.length + skillsData.professional.length,
    frontend: skillsData.technical.filter((s) => getSkillCategory(s) === "frontend").length,
    backend: skillsData.technical.filter((s) => getSkillCategory(s) === "backend").length,
    tools: skillsData.tools.length + skillsData.technical.filter((s) => getSkillCategory(s) === "tools").length,
    professional: skillsData.professional.length,
  };

  return (
    <section id="skills" className="skills-bento-section" ref={sectionRef}>
      <ParticleMesh particleCount={35} />

      <div className="main-text" data-reveal="fade-up" data-delay="0">
        <span>Tech Stack &amp; Architecture</span>
        <h2>Skills &amp; Ecosystem</h2>
      </div>

      {/* Filter Tabs with Badge Counts */}
      <div className="bento-filter-container" data-reveal="fade-up" data-delay="0.1">
        <button
          className={`bento-tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          <FaLayerGroup /> All Stack <span className="tab-count">{counts.all}</span>
        </button>
        <button
          className={`bento-tab ${activeTab === "frontend" ? "active" : ""}`}
          onClick={() => setActiveTab("frontend")}
        >
          Frontend <span className="tab-count">{counts.frontend}</span>
        </button>
        <button
          className={`bento-tab ${activeTab === "backend" ? "active" : ""}`}
          onClick={() => setActiveTab("backend")}
        >
          Backend &amp; DB <span className="tab-count">{counts.backend}</span>
        </button>
        <button
          className={`bento-tab ${activeTab === "tools" ? "active" : ""}`}
          onClick={() => setActiveTab("tools")}
        >
          Tools &amp; DevOps <span className="tab-count">{counts.tools}</span>
        </button>
        <button
          className={`bento-tab ${activeTab === "professional" ? "active" : ""}`}
          onClick={() => setActiveTab("professional")}
        >
          Soft Skills <span className="tab-count">{counts.professional}</span>
        </button>
      </div>

      {/* Bento Grid */}
      <div className="bento-grid-wrapper">
        {/* Technical Skills Cards */}
        {activeTab !== "professional" && filteredTechnical.length > 0 && (
          <div key={`tech-grid-${activeTab}`} className="bento-tech-grid bento-animate-in">
            {filteredTechnical.map((skill, index) => {
              const isFeatured = skill.featured || index < 2;
              return (
                <div
                  key={skill.name}
                  className={`bento-card ${isFeatured ? "bento-card-featured" : "bento-card-standard"}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="bento-card-glow"></div>
                  <div className="bento-card-top">
                    <div className="bento-icon-wrapper">
                      {getTechIcon(skill.name)}
                    </div>
                    <div className="bento-card-header-info">
                      <div className="bento-title-row">
                        <h4>{skill.name}</h4>
                        {skill.tag && <span className="bento-tag-pill">{skill.tag}</span>}
                      </div>
                      {skill.level && (
                        <span className="bento-level-badge">
                          <span className="bento-pulse-dot"></span>
                          {skill.level}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="bento-progress-container">
                    <div className="bento-progress-info">
                      <span>Proficiency</span>
                      <span className="bento-percent">{isVisible ? skill.percent : 0}%</span>
                    </div>
                    <div className="bento-progress-track">
                      <div
                        className="bento-progress-fill"
                        style={{
                          width: isVisible ? `${skill.percent}%` : "0%",
                          transitionDelay: `${index * 0.08}s`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Capabilities Chips */}
                  {skill.capabilities && (
                    <div className="bento-chips-container">
                      {skill.capabilities.split(/[,&]/).map((cap, i) => (
                        <span key={i} className="bento-cap-chip">
                          {cap.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tools & Platforms Bento Block */}
        {(activeTab === "all" || activeTab === "tools") && (
          <div key={`tools-block-${activeTab}`} className="bento-tools-block bento-animate-in">
            <div className="bento-section-title">
              <FaWrench /> <h3>Developer Tools &amp; Environment</h3>
            </div>
            <div className="bento-tools-grid">
              {skillsData.tools.map((tool, index) => {
                const toolName = typeof tool === "string" ? tool : tool.name;
                const toolBadge = typeof tool === "object" ? tool.badge : null;
                const isAntigravity = toolName.toLowerCase().includes("antigravity");
                return (
                  <div
                    key={toolName}
                    className={`bento-tool-item ${isAntigravity ? "bento-tool-antigravity" : ""}`}
                    style={{ animationDelay: `${index * 0.04}s` }}
                  >
                    <div className="bento-tool-icon">{getToolIcon(tool)}</div>
                    <div className="bento-tool-info">
                      <span>{toolName}</span>
                      {toolBadge && <small className="bento-tool-badge">{toolBadge}</small>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Professional / Soft Skills Bento Block */}
        {(activeTab === "all" || activeTab === "professional") && (
          <div key={`prof-block-${activeTab}`} className="bento-prof-block bento-animate-in">
            <div className="bento-section-title">
              <FaBrain /> <h3>Engineering Mindset &amp; Soft Skills</h3>
            </div>
            <div className="bento-prof-grid">
              {skillsData.professional.map((prof, i) => (
                <div
                  key={prof.name}
                  className="bento-prof-card"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className="bento-prof-header">
                    {getProfIcon(prof.icon || (i === 0 ? "brain" : i === 1 ? "sitemap" : i === 2 ? "comments" : "rocket"))}
                    <div>
                      <h5>{prof.name}</h5>
                      {prof.desc && <p className="bento-prof-desc">{prof.desc}</p>}
                    </div>
                  </div>
                  <div className="bento-prof-bar-wrap">
                    <div className="bento-prof-bar-track">
                      <div
                        className="bento-prof-bar-fill"
                        style={{
                          width: isVisible ? `${prof.percent}%` : "0%",
                          transitionDelay: `${0.1 + i * 0.08}s`,
                        }}
                      ></div>
                    </div>
                    <span className="bento-prof-val">{isVisible ? prof.percent : 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}



