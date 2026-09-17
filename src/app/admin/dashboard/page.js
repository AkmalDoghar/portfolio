"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProjectsManager from "./sections/ProjectsManager";
import SkillsManager from "./sections/SkillsManager";
import ServicesManager from "./sections/ServicesManager";
import ExperienceManager from "./sections/ExperienceManager";
import CaseStudyManager from "./sections/CaseStudyManager";
import CvManager from "./sections/CvManager";
import HomeSettingsManager from "./sections/HomeSettingsManager";
import "./dashboard.css";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "homeSettings", label: "Home & Site Info", icon: "sliders" },
  { id: "projects", label: "Projects", icon: "folder" },
  { id: "skills", label: "Skills", icon: "zap" },
  { id: "services", label: "Services", icon: "briefcase" },
  { id: "experience", label: "Experience", icon: "clock" },
  { id: "casestudy", label: "Case Study", icon: "sparkles" },
  { id: "cv", label: "Resume / CV", icon: "fileText" },
];


function Icon({ name, size = 20 }) {
  const icons = {
    grid: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    folder: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M2 8C2 6.9 2.9 6 4 6H9.6L11.6 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V8Z" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    zap: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    briefcase: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M16 7V5C16 4.4 15.6 4 15 4H9C8.4 4 8 4.4 8 5V7" stroke="currentColor" strokeWidth="2" />
        <line x1="12" y1="12" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    clock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    logout: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M9 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    menu: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    x: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    externalLink: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <polyline points="15 3 21 3 21 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    sparkles: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    shield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    fileText: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    sliders: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <line x1="4" y1="21" x2="4" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="4" y1="10" x2="4" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="21" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="8" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="21" x2="20" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="12" x2="20" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="1" y1="14" x2="7" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="9" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="17" y1="16" x2="23" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  };
  return icons[name] || null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ projects: 0, skills: 0, services: 0, experience: 0 });
  const [logoutLoading, setLogoutLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const [proj, skills, services, exp, cs] = await Promise.all([
        fetch("/api/admin/projects").then((r) => r.json()),
        fetch("/api/admin/skills").then((r) => r.json()),
        fetch("/api/admin/services").then((r) => r.json()),
        fetch("/api/admin/experience").then((r) => r.json()),
        fetch("/api/admin/casestudy").then((r) => r.json()).catch(() => []),
      ]);
      setStats({
        projects: Array.isArray(proj) ? proj.length : 0,
        skills: skills?.technical ? skills.technical.length : Array.isArray(skills) ? skills.length : 0,
        services: Array.isArray(services) ? services.length : 0,
        experience: Array.isArray(exp) ? exp.length : 0,
        casestudy: Array.isArray(cs) ? cs.length : 0,
      });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch {
      toast.error("Logout failed");
    } finally {
      setLogoutLoading(false);
    }
  };

  const navigate = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  const currentSectionLabel = NAV_ITEMS.find((i) => i.id === activeSection)?.label || "Overview";

  return (
    <div className="dash-root">
      {/* Background Ambient Glow Grid */}
      <div className="dash-bg-grid" />
      <div className="dash-bg-orb" />

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`dash-sidebar ${sidebarOpen ? "dash-sidebar--open" : ""}`}>
        <div className="dash-sidebar-brand">
          <div className="dash-logo-icon">
            <img src="/images/AK.png" alt="AK Logo" className="dash-logo-img" />
          </div>
          <div className="dash-brand-info">
            <div className="dash-logo-title">
              Admin <span className="logo-badge">CMS</span>
            </div>
            <div className="dash-logo-sub">Portfolio Management</div>
          </div>
        </div>

        <div className="dash-sidebar-meta">
          <span className="live-pulse" />
          <span>System Status: Operational</span>
        </div>

        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`dash-nav-item ${activeSection === item.id ? "dash-nav-item--active" : ""}`}
              onClick={() => navigate(item.id)}
            >
              <span className="nav-icon-wrap">
                <Icon name={item.icon} size={18} />
              </span>
              <span className="nav-label">{item.label}</span>
              {activeSection === item.id && <span className="nav-active-pill" />}
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <div className="admin-profile-card">
            <div className="admin-avatar">
              <img src="/images/AK.png" alt="Akmal Avatar" className="admin-avatar-img" />
            </div>
            <div className="admin-profile-info">
              <span className="admin-name">Muhammad Akmal</span>
              <span className="admin-role">Super Administrator</span>
            </div>
          </div>

          <div className="sidebar-action-buttons">
            <a href="https://akmalcode.vercel.app/" target="_blank" rel="noopener noreferrer" className="dash-view-site">
              <Icon name="externalLink" size={16} />
              <span>Live Website</span>
            </a>
            <button
              className="dash-logout-btn"
              onClick={handleLogout}
              disabled={logoutLoading}
              title="Logout from Admin Panel"
            >
              <Icon name="logout" size={16} />
              <span>{logoutLoading ? "Exiting..." : "Logout"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="dash-main">
        {/* Topbar */}
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <button
              className="dash-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <Icon name={sidebarOpen ? "x" : "menu"} size={22} />
            </button>

            <div className="dash-breadcrumb">
              <span className="bc-root">Admin</span>
              <span className="bc-sep">/</span>
              <span className="bc-current">{currentSectionLabel}</span>
            </div>
          </div>

          <div className="dash-topbar-right">
            <a href="https://akmalcode.vercel.app/" target="_blank" rel="noopener noreferrer" className="topbar-quick-link">
              <Icon name="externalLink" size={15} />
              <span>View Site</span>
            </a>
            <div className="dash-admin-badge">
              <Icon name="shield" size={14} />
              <span>Verified Admin</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="dash-content">
          {activeSection === "overview" && (
            <OverviewSection stats={stats} navigate={navigate} />
          )}
          {activeSection === "homeSettings" && (
            <HomeSettingsManager onUpdate={fetchStats} />
          )}
          {activeSection === "projects" && (
            <ProjectsManager onUpdate={fetchStats} />
          )}
          {activeSection === "skills" && (
            <SkillsManager onUpdate={fetchStats} />
          )}
          {activeSection === "services" && (
            <ServicesManager onUpdate={fetchStats} />
          )}
          {activeSection === "experience" && (
            <ExperienceManager onUpdate={fetchStats} />
          )}
          {activeSection === "casestudy" && (
            <CaseStudyManager onUpdate={fetchStats} />
          )}
          {activeSection === "cv" && (
            <CvManager onUpdate={fetchStats} />
          )}
        </main>
      </div>
    </div>
  );
}

function OverviewSection({ stats, navigate }) {
  const cards = [
    { label: "Home & Site Info", value: "Active", icon: "sliders", color: "#3b82f6", section: "homeSettings", tag: "Site Customizer" },
    { label: "Projects", value: stats.projects, icon: "folder", color: "#0ff7e0", section: "projects", tag: "Portfolio Showcase" },
    { label: "Technical Skills", value: stats.skills, icon: "zap", color: "#7c3aed", section: "skills", tag: "Expertise Matrix" },
    { label: "Services", value: stats.services, icon: "briefcase", color: "#ec4899", section: "services", tag: "Offered Solutions" },
    { label: "Experience Years", value: stats.experience, icon: "clock", color: "#f59e0b", section: "experience", tag: "Career Timeline" },
    { label: "Case Studies", value: stats.casestudy || 0, icon: "sparkles", color: "#10b981", section: "casestudy", tag: "Detailed Analysis" },
  ];

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="overview">
      {/* Overview Banner */}
      <div className="overview-banner">
        <div className="banner-content">
          <div className="banner-badge">
            <Icon name="sparkles" size={14} />
            <span>Dashboard v2.0 • Live Control Center</span>
          </div>
          <h2>Welcome back, Muhammad Akmal 👋</h2>
          <p>Full control center for homepage customization, profile details, projects, skills &amp; resume.</p>
        </div>
        <div className="banner-date">
          <span>{currentDate}</span>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="overview-stats">
        {cards.map((card) => (
          <button
            key={card.label}
            className="stat-card"
            onClick={() => navigate(card.section)}
            style={{ "--card-color": card.color }}
          >
            <div className="stat-card-top">
              <div className="stat-icon">
                <Icon name={card.icon} size={22} />
              </div>
              <span className="stat-tag">{card.tag}</span>
            </div>

            <div className="stat-info">
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>

            <div className="stat-card-bottom">
              <span>Manage Section</span>
              <span className="stat-arrow">→</span>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="overview-quick">
        <div className="quick-header">
          <h3>Quick Management Shortcuts</h3>
          <p>Directly jump into editing any portfolio section</p>
        </div>
        <div className="quick-actions-grid">
          {[
            { label: "Edit Home & Site Info", desc: "Modify hero text, email, social links & images", section: "homeSettings", color: "#3b82f6", icon: "sliders" },
            { label: "Add New Project", desc: "Showcase a new web app or repository", section: "projects", color: "#0ff7e0", icon: "folder" },
            { label: "Update Tech Stack", desc: "Add skills, frameworks & proficiency", section: "skills", color: "#7c3aed", icon: "zap" },
            { label: "Edit Service Offerings", desc: "Modify development & consulting services", section: "services", color: "#ec4899", icon: "briefcase" },
            { label: "Update Career History", desc: "Add jobs, client work or roles", section: "experience", color: "#f59e0b", icon: "clock" },
            { label: "Manage Case Studies", desc: "Create or edit architecture breakdowns", section: "casestudy", color: "#10b981", icon: "sparkles" },
            { label: "Upload Resume / CV", desc: "Replace PDF or update downloadable link", section: "cv", color: "#6366f1", icon: "fileText" },
          ].map((a) => (
            <button
              key={a.label}
              className="quick-card-btn"
              onClick={() => navigate(a.section)}
              style={{ "--q-color": a.color }}
            >
              <div className="quick-btn-icon">
                <Icon name={a.icon} size={20} />
              </div>
              <div className="quick-btn-text">
                <span className="quick-btn-title">{a.label}</span>
                <span className="quick-btn-desc">{a.desc}</span>
              </div>
              <span className="quick-btn-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
