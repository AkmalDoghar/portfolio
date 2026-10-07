"use client";

import { useState, useEffect, useCallback } from "react";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`toast toast--${type}`}>{message}</div>;
}

const inputStyle = {
  width: "100%",
  background: "rgba(15, 23, 42, 0.75)",
  border: "1px solid rgba(18, 247, 255, 0.25)",
  borderRadius: "10px",
  color: "#ffffff",
  padding: "0.7rem 0.9rem",
  fontSize: "0.9rem",
  outline: "none",
  transition: "all 0.2s ease",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  color: "#94a3b8",
  fontSize: "0.82rem",
  fontWeight: 600,
  marginBottom: "6px",
  letterSpacing: "0.3px",
};

export default function CvContentEditor({ onUpdate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("personal");

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchCvContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cv-content", { cache: "no-store" });
      const json = await res.json();
      if (json && json.personalInfo) {
        if (!json.languages) json.languages = ["English (Professional)", "Urdu (Native)"];
        setData(json);
      }
    } catch {
      showToast("Failed to load CV content", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCvContent();
  }, [fetchCvContent]);

  const handleSave = async (updatedData = data) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cv-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const result = await res.json();
      if (res.ok) {
        setData(updatedData);
        onUpdate?.();
        showToast("CV content updated and saved live!");
      } else {
        showToast(result.error || "Failed to save CV content", "error");
      }
    } catch {
      showToast("Error saving CV content", "error");
    } finally {
      setSaving(false);
    }
  };

  // Personal Info change handler
  const handlePersonalChange = (field, val) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: val },
    }));
  };

  // Languages handlers
  const handleAddLanguage = (langStr) => {
    if (!langStr.trim()) return;
    setData((prev) => {
      const list = [...(prev.languages || [])];
      if (!list.includes(langStr.trim())) {
        list.push(langStr.trim());
      }
      return { ...prev, languages: list };
    });
  };

  const handleRemoveLanguage = (langStr) => {
    setData((prev) => ({
      ...prev,
      languages: (prev.languages || []).filter((l) => l !== langStr),
    }));
  };

  // Experience handlers
  const handleAddExperience = () => {
    const newItem = {
      id: Date.now(),
      company: "Company Name",
      role: "Job Title / Role",
      period: "2024 – Present",
      description: "Brief summary of responsibilities...",
      bullets: ["Accomplishment or key deliverable 1", "Key deliverable 2"],
    };
    setData((prev) => ({
      ...prev,
      experience: [newItem, ...(prev.experience || [])],
    }));
  };

  const handleUpdateExperience = (index, field, val) => {
    setData((prev) => {
      const list = [...(prev.experience || [])];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, experience: list };
    });
  };

  const handleUpdateBullet = (expIndex, bulletIndex, val) => {
    setData((prev) => {
      const list = [...(prev.experience || [])];
      const bullets = [...(list[expIndex].bullets || [])];
      bullets[bulletIndex] = val;
      list[expIndex] = { ...list[expIndex], bullets };
      return { ...prev, experience: list };
    });
  };

  const handleAddBullet = (expIndex) => {
    setData((prev) => {
      const list = [...(prev.experience || [])];
      const bullets = [...(list[expIndex].bullets || []), "New bullet point..."];
      list[expIndex] = { ...list[expIndex], bullets };
      return { ...prev, experience: list };
    });
  };

  const handleRemoveBullet = (expIndex, bulletIndex) => {
    setData((prev) => {
      const list = [...(prev.experience || [])];
      const bullets = (list[expIndex].bullets || []).filter((_, idx) => idx !== bulletIndex);
      list[expIndex] = { ...list[expIndex], bullets };
      return { ...prev, experience: list };
    });
  };

  const handleDeleteExperience = (index) => {
    if (!confirm("Delete this experience entry?")) return;
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, idx) => idx !== index),
    }));
  };

  // Education handlers
  const handleAddEducation = () => {
    const newItem = {
      id: Date.now(),
      degree: "Bachelor of Science in Computer Science",
      institution: "University / Institute Name",
      period: "2021 – 2025",
      details: "Major coursework, GPA, or honors...",
    };
    setData((prev) => ({
      ...prev,
      education: [newItem, ...(prev.education || [])],
    }));
  };

  const handleUpdateEducation = (index, field, val) => {
    setData((prev) => {
      const list = [...(prev.education || [])];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, education: list };
    });
  };

  const handleDeleteEducation = (index) => {
    if (!confirm("Delete this education entry?")) return;
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((_, idx) => idx !== index),
    }));
  };

  // Skill Tags handlers
  const handleAddSkillTag = (category, tagStr) => {
    if (!tagStr.trim()) return;
    setData((prev) => {
      const catList = [...(prev.skills?.[category] || [])];
      if (!catList.includes(tagStr.trim())) {
        catList.push(tagStr.trim());
      }
      return {
        ...prev,
        skills: { ...prev.skills, [category]: catList },
      };
    });
  };

  const handleRemoveSkillTag = (category, tagStr) => {
    setData((prev) => {
      const catList = (prev.skills?.[category] || []).filter((t) => t !== tagStr);
      return {
        ...prev,
        skills: { ...prev.skills, [category]: catList },
      };
    });
  };

  // Project handlers
  const handleAddProject = () => {
    const newItem = {
      id: Date.now(),
      title: "Project Name",
      tech: "Next.js, React, Node.js",
      link: "https://...",
      github: "https://github.com/...",
      desc: "Project description and key features...",
    };
    setData((prev) => ({
      ...prev,
      projects: [newItem, ...(prev.projects || [])],
    }));
  };

  const handleUpdateProject = (index, field, val) => {
    setData((prev) => {
      const list = [...(prev.projects || [])];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, projects: list };
    });
  };

  const handleDeleteProject = (index) => {
    if (!confirm("Delete this project from CV?")) return;
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, idx) => idx !== index),
    }));
  };

  if (loading) {
    return (
      <div className="loading-state">
        <span className="spin" /> Loading Interactive CV Editor...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="cv-content-editor">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* TOP PROMINENT ACTION BAR (Re-aligned & Sticky) */}
      <div
        className="cv-editor-toolbar"
        style={{
          background: "rgba(15, 23, 42, 0.9)",
          border: "1px solid rgba(18, 247, 255, 0.3)",
          borderRadius: "16px",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div>
          <h4 style={{ color: "#ffffff", margin: 0, fontSize: "1rem", fontWeight: 700 }}>
            ⚡ Live CV Editor &amp; Customizer
          </h4>
          <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
            Changes are saved live to your public resume route at <strong style={{ color: "#12f7ff" }}>/cv</strong>
          </span>
        </div>

        <div className="cv-editor-toolbar-actions" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <a
            href="/cv"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "0.6rem 1.2rem",
              borderRadius: "10px",
              background: "rgba(18, 247, 255, 0.12)",
              color: "#12f7ff",
              border: "1px solid rgba(18, 247, 255, 0.35)",
              fontWeight: 600,
              fontSize: "0.85rem",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            👁️ View Printable Resume Page ↗
          </a>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "0.6rem 1.4rem",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #12f7ff, #0099ff)",
              color: "#0b0f19",
              border: "none",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              boxShadow: "0 4px 18px rgba(18, 247, 255, 0.4)",
            }}
          >
            {saving ? "Saving..." : "💾 Save CV Content"}
          </button>
        </div>
      </div>

      {/* Sub Tabs Bar */}
      <div className="cv-editor-tabs" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {[
          { id: "personal", label: "👤 Personal Profile" },
          { id: "experience", label: "💼 Experience (" + (data.experience?.length || 0) + ")" },
          { id: "skills", label: "⚡ Technical Skills" },
          { id: "languages", label: "🌐 Languages (" + (data.languages?.length || 0) + ")" },
          { id: "education", label: "🎓 Education (" + (data.education?.length || 0) + ")" },
          { id: "projects", label: "🚀 CV Projects (" + (data.projects?.length || 0) + ")" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`btn-edit ${activeSubTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              padding: "0.55rem 1.1rem",
              borderRadius: "10px",
              background: activeSubTab === tab.id ? "linear-gradient(135deg, #12f7ff, #0099ff)" : "rgba(255,255,255,0.05)",
              color: activeSubTab === tab.id ? "#0f172a" : "#cbd5e1",
              fontWeight: activeSubTab === tab.id ? 700 : 500,
              border: activeSubTab === tab.id ? "none" : "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Personal Info */}
      {activeSubTab === "personal" && (
        <div className="admin-card" style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem", borderRadius: "16px" }}>
          <h3 style={{ color: "#ffffff", marginBottom: "1.25rem", fontSize: "1.1rem" }}>👤 Personal Profile &amp; Design Template</h3>

          {/* Active Template Switcher */}
          <div style={{ background: "rgba(18, 247, 255, 0.05)", border: "1px solid rgba(18, 247, 255, 0.2)", padding: "1rem", borderRadius: "12px", marginBottom: "1.25rem" }}>
            <label style={{ color: "#12f7ff", fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "8px" }}>
              🎨 Select Active Resume Layout Template:
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                { id: "executive", label: "🏢 Executive Slate" },
                { id: "minimalist", label: "📄 Minimalist Corporate" },
                { id: "techlead", label: "💻 Tech Lead Gradient" },
                { id: "compact", label: "⚡ Compact Two-Column" },
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setData((prev) => ({ ...prev, activeTemplate: tpl.id }))}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "0.83rem",
                    fontWeight: (data.activeTemplate || "executive") === tpl.id ? 700 : 500,
                    background: (data.activeTemplate || "executive") === tpl.id ? "linear-gradient(135deg, #12f7ff, #0099ff)" : "rgba(255, 255, 255, 0.05)",
                    color: (data.activeTemplate || "executive") === tpl.id ? "#0b0f19" : "#ffffff",
                    border: (data.activeTemplate || "executive") === tpl.id ? "none" : "1px solid rgba(255,255,255,0.15)",
                    cursor: "pointer",
                  }}
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Accent Color Picker */}
          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem" }}>
            <label style={{ color: "#ffffff", fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "8px" }}>
              🎨 Custom Primary Accent Color (Apne Marzi ka Color Pick Karein):
            </label>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              {/* Presets */}
              {[
                { hex: "#0284c7", name: "Royal Blue" },
                { hex: "#059669", name: "Emerald Green" },
                { hex: "#7c3aed", name: "Deep Purple" },
                { hex: "#dc2626", name: "Crimson Red" },
                { hex: "#d97706", name: "Amber Gold" },
                { hex: "#1e293b", name: "Midnight Navy" },
                { hex: "#db2777", name: "Neon Pink" },
              ].map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  title={c.name}
                  onClick={() => setData((prev) => ({ ...prev, primaryColor: c.hex }))}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: c.hex,
                    border: (data.primaryColor || "#0284c7") === c.hex ? "3px solid #12f7ff" : "2px solid rgba(255,255,255,0.2)",
                    boxShadow: (data.primaryColor || "#0284c7") === c.hex ? "0 0 12px " + c.hex : "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                />
              ))}

              {/* Native Color Picker + Hex Input */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(15, 23, 42, 0.8)", padding: "4px 8px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)" }}>
                <input
                  type="color"
                  value={data.primaryColor || "#0284c7"}
                  onChange={(e) => setData((prev) => ({ ...prev, primaryColor: e.target.value }))}
                  style={{ width: "26px", height: "26px", border: "none", background: "none", cursor: "pointer", padding: 0 }}
                />
                <input
                  type="text"
                  value={data.primaryColor || "#0284c7"}
                  onChange={(e) => setData((prev) => ({ ...prev, primaryColor: e.target.value }))}
                  placeholder="#0284c7"
                  style={{ width: "70px", background: "transparent", border: "none", color: "#ffffff", fontSize: "0.82rem", fontFamily: "monospace", fontWeight: 700 }}
                />
              </div>
            </div>
          </div>

          <div className="cv-editor-grid cv-editor-grid--two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div className="form-group">
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                style={inputStyle}
                value={data.personalInfo?.name || ""}
                onChange={(e) => handlePersonalChange("name", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>Professional Job Title</label>
              <input
                type="text"
                style={inputStyle}
                value={data.personalInfo?.title || ""}
                onChange={(e) => handlePersonalChange("title", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>Email Address</label>
              <input
                type="text"
                style={inputStyle}
                value={data.personalInfo?.email || ""}
                onChange={(e) => handlePersonalChange("email", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>Phone Number</label>
              <input
                type="text"
                style={inputStyle}
                value={data.personalInfo?.phone || ""}
                onChange={(e) => handlePersonalChange("phone", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>Location / Region</label>
              <input
                type="text"
                style={inputStyle}
                value={data.personalInfo?.location || ""}
                onChange={(e) => handlePersonalChange("location", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>Portfolio URL</label>
              <input
                type="text"
                style={inputStyle}
                value={data.personalInfo?.website || ""}
                onChange={(e) => handlePersonalChange("website", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>GitHub Profile Link</label>
              <input
                type="text"
                style={inputStyle}
                value={data.personalInfo?.github || ""}
                onChange={(e) => handlePersonalChange("github", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>LinkedIn Profile Link</label>
              <input
                type="text"
                style={inputStyle}
                value={data.personalInfo?.linkedin || ""}
                onChange={(e) => handlePersonalChange("linkedin", e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: "1.25rem" }}>
            <label style={labelStyle}>Professional Executive Summary / Bio</label>
            <textarea
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
              value={data.personalInfo?.summary || ""}
              onChange={(e) => handlePersonalChange("summary", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* TAB: Languages */}
      {activeSubTab === "languages" && (
        <div className="admin-card" style={{ background: "rgba(15, 23, 42, 0.6)", padding: "1.5rem", borderRadius: "16px" }}>
          <h3 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>🌐 Languages Spoken</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.84rem", marginBottom: "1.25rem" }}>
            Add spoken languages and proficiency levels to be displayed on your printable resume
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "1.25rem" }}>
            {(data.languages || []).map((lang, lIdx) => (
              <span
                key={lIdx}
                style={{
                  background: "rgba(18, 247, 255, 0.1)",
                  border: "1px solid rgba(18, 247, 255, 0.3)",
                  color: "#ffffff",
                  padding: "6px 14px",
                  borderRadius: "10px",
                  fontSize: "0.88rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: 500,
                }}
              >
                🗣️ {lang}
                <button
                  type="button"
                  onClick={() => handleRemoveLanguage(lang)}
                  style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontWeight: 700, padding: 0 }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div className="cv-editor-add-row" style={{ display: "flex", gap: "10px", maxWidth: "450px" }}>
            <input
              type="text"
              id="new-language-input"
              placeholder="e.g. English (Fluent) or German (Intermediate)"
              style={inputStyle}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddLanguage(e.target.value);
                  e.target.value = "";
                }
              }}
            />
            <button
              type="button"
              className="btn-add"
              onClick={() => {
                const el = document.getElementById("new-language-input");
                if (el) {
                  handleAddLanguage(el.value);
                  el.value = "";
                }
              }}
              style={{ whiteSpace: "nowrap" }}
            >
              ➕ Add Language
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Work Experience */}
      {activeSubTab === "experience" && (
        <div>
          <div className="cv-editor-section-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ color: "#ffffff", margin: 0 }}>💼 Work &amp; Role History</h3>
            <button type="button" className="btn-add" onClick={handleAddExperience}>
              ➕ Add Work Experience Entry
            </button>
          </div>

          {(data.experience || []).map((exp, idx) => (
            <div key={exp.id || idx} className="admin-card" style={{ marginBottom: "1.25rem", background: "rgba(15, 23, 42, 0.6)", padding: "1.5rem", borderRadius: "16px" }}>
              <div className="cv-editor-entry-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span style={{ color: "#12f7ff", fontWeight: 700, fontSize: "0.95rem" }}>
                  Entry #{idx + 1}: {exp.role || "Untitled Role"}
                </span>
                <button type="button" className="btn-delete" onClick={() => handleDeleteExperience(idx)}>
                  🗑️ Remove Entry
                </button>
              </div>

              <div className="cv-editor-grid cv-editor-grid--three" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label style={labelStyle}>Role / Position Title</label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={exp.role || ""}
                    onChange={(e) => handleUpdateExperience(idx, "role", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={labelStyle}>Company / Client Name</label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={exp.company || ""}
                    onChange={(e) => handleUpdateExperience(idx, "company", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={labelStyle}>Period / Dates (e.g. 2024 – Present)</label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={exp.period || ""}
                    onChange={(e) => handleUpdateExperience(idx, "period", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label style={labelStyle}>Short Overview</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={exp.description || ""}
                  onChange={(e) => handleUpdateExperience(idx, "description", e.target.value)}
                />
              </div>

              {/* Bullet points manager */}
              <div style={{ marginTop: "1rem", background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="cv-editor-section-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <label style={{ color: "#cbd5e1", fontSize: "0.85rem", fontWeight: 600 }}>
                    Key Bullet Points &amp; Achievements:
                  </label>
                  <button type="button" className="btn-edit" onClick={() => handleAddBullet(idx)} style={{ fontSize: "0.75rem" }}>
                    ➕ Add Bullet Point
                  </button>
                </div>

                {(exp.bullets || []).map((bullet, bIdx) => (
                  <div key={bIdx} className="cv-editor-bullet-row" style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <input
                      type="text"
                      style={inputStyle}
                      value={bullet}
                      onChange={(e) => handleUpdateBullet(idx, bIdx, e.target.value)}
                    />
                    <button type="button" className="btn-delete" onClick={() => handleRemoveBullet(idx, bIdx)} style={{ padding: "0.25rem 0.6rem" }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Technical Skills */}
      {activeSubTab === "skills" && (
        <div className="admin-card" style={{ background: "rgba(15, 23, 42, 0.6)", padding: "1.5rem", borderRadius: "16px" }}>
          <h3 style={{ color: "#ffffff", marginBottom: "1rem" }}>⚡ CV Skill Tags Manager</h3>

          {["frontend", "backend", "tools"].map((category) => {
            const catLabel =
              category === "frontend" ? "Frontend Stack" : category === "backend" ? "Backend & Databases" : "Tools & Platforms";
            const tags = data.skills?.[category] || [];

            return (
              <div key={category} style={{ marginBottom: "1.5rem", background: "rgba(0,0,0,0.2)", padding: "1.25rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <h4 style={{ color: "#12f7ff", fontSize: "0.95rem", marginBottom: "0.75rem" }}>{catLabel}</h4>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "0.75rem" }}>
                  {tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        background: "rgba(18, 247, 255, 0.1)",
                        border: "1px solid rgba(18, 247, 255, 0.3)",
                        color: "#ffffff",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkillTag(category, tag)}
                        style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontWeight: 700, padding: 0 }}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                <div className="cv-editor-add-row" style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    id={`new-tag-${category}`}
                    placeholder={`Add new ${category} skill...`}
                    style={{ ...inputStyle, maxWidth: "320px" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkillTag(category, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-add"
                    onClick={() => {
                      const input = document.getElementById(`new-tag-${category}`);
                      if (input) {
                        handleAddSkillTag(category, input.value);
                        input.value = "";
                      }
                    }}
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: Education */}
      {activeSubTab === "education" && (
        <div>
          <div className="cv-editor-section-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ color: "#ffffff", margin: 0 }}>🎓 Education &amp; Credentials</h3>
            <button type="button" className="btn-add" onClick={handleAddEducation}>
              ➕ Add Education Entry
            </button>
          </div>

          {(data.education || []).map((edu, idx) => (
            <div key={edu.id || idx} className="admin-card" style={{ marginBottom: "1.25rem", background: "rgba(15, 23, 42, 0.6)", padding: "1.5rem", borderRadius: "16px" }}>
              <div className="cv-editor-entry-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span style={{ color: "#12f7ff", fontWeight: 700, fontSize: "0.95rem" }}>
                  Education #{idx + 1}: {edu.degree || "Degree Title"}
                </span>
                <button type="button" className="btn-delete" onClick={() => handleDeleteEducation(idx)}>
                  🗑️ Remove
                </button>
              </div>

              <div className="cv-editor-grid cv-editor-grid--three" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label style={labelStyle}>Degree / Qualification</label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={edu.degree || ""}
                    onChange={(e) => handleUpdateEducation(idx, "degree", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={labelStyle}>University / Institute</label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={edu.institution || ""}
                    onChange={(e) => handleUpdateEducation(idx, "institution", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={labelStyle}>Dates (e.g. 2021 – 2025)</label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={edu.period || ""}
                    onChange={(e) => handleUpdateEducation(idx, "period", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label style={labelStyle}>Details / Major Coursework</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={edu.details || ""}
                  onChange={(e) => handleUpdateEducation(idx, "details", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: CV Projects */}
      {activeSubTab === "projects" && (
        <div>
          <div className="cv-editor-section-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ color: "#ffffff", margin: 0 }}>🚀 Featured Projects in CV</h3>
            <button type="button" className="btn-add" onClick={handleAddProject}>
              ➕ Add CV Project Entry
            </button>
          </div>

          {(data.projects || []).map((proj, idx) => (
            <div key={proj.id || idx} className="admin-card" style={{ marginBottom: "1.25rem", background: "rgba(15, 23, 42, 0.6)", padding: "1.5rem", borderRadius: "16px" }}>
              <div className="cv-editor-entry-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span style={{ color: "#12f7ff", fontWeight: 700, fontSize: "0.95rem" }}>
                  Project #{idx + 1}: {proj.title || "Project Title"}
                </span>
                <button type="button" className="btn-delete" onClick={() => handleDeleteProject(idx)}>
                  🗑️ Remove
                </button>
              </div>

              <div className="cv-editor-grid cv-editor-grid--two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label style={labelStyle}>Project Title</label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={proj.title || ""}
                    onChange={(e) => handleUpdateProject(idx, "title", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={labelStyle}>Tech Stack Used</label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={proj.tech || ""}
                    onChange={(e) => handleUpdateProject(idx, "tech", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={labelStyle}>Live Demo Link</label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={proj.link || ""}
                    onChange={(e) => handleUpdateProject(idx, "link", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={labelStyle}>GitHub Repository Link</label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={proj.github || ""}
                    onChange={(e) => handleUpdateProject(idx, "github", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label style={labelStyle}>Description / Features</label>
                <textarea
                  rows={2}
                  style={{ ...inputStyle, resize: "vertical" }}
                  value={proj.desc || ""}
                  onChange={(e) => handleUpdateProject(idx, "desc", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
