"use client";
import { useState, useEffect, useCallback } from "react";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`toast toast--${type}`}>{message}</div>;
}

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
const CATEGORIES = [
  { label: "Frontend", value: "frontend" },
  { label: "Backend & DB", value: "backend" },
  { label: "Tools & DevOps", value: "tools" },
];
const PROF_ICONS = ["brain", "sitemap", "comments", "rocket", "check"];

export default function SkillsManager({ onUpdate }) {
  const [data, setData] = useState({ technical: [], professional: [], tools: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("technical");

  // Forms
  const [showTechForm, setShowTechForm] = useState(false);
  const [techForm, setTechForm] = useState({
    name: "",
    category: "frontend",
    percent: 85,
    level: "Advanced",
    tag: "",
    capabilities: "",
    featured: false,
  });
  const [editingTechId, setEditingTechId] = useState(null);

  const [showProfForm, setShowProfForm] = useState(false);
  const [profForm, setProfForm] = useState({ name: "", percent: 85, desc: "", icon: "brain" });
  const [editingProfId, setEditingProfId] = useState(null);

  const [toolForm, setToolForm] = useState({ name: "", badge: "" });

  const showToast = (msg, type = "success") => setToast({ message: msg, type });

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/skills");
    const d = await res.json();
    if (d && typeof d === "object" && !Array.isArray(d)) {
      setData({
        technical: d.technical || [],
        professional: d.professional || [],
        tools: d.tools || [],
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const saveToAPI = async (newData) => {
    await fetch("/api/admin/skills", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    });
  };

  // Save Technical Skill
  async function saveTech(e) {
    e.preventDefault();
    setSaving(true);
    const skill = {
      ...techForm,
      percent: Number(techForm.percent) || 80,
      id: editingTechId || Date.now(),
    };
    const updated = editingTechId
      ? data.technical.map((s) => (s.id === editingTechId ? skill : s))
      : [...data.technical, skill];
    const newData = { ...data, technical: updated };
    await saveToAPI(newData);
    setData(newData);
    setShowTechForm(false);
    setEditingTechId(null);
    setTechForm({
      name: "",
      category: "frontend",
      percent: 85,
      level: "Advanced",
      tag: "",
      capabilities: "",
      featured: false,
    });
    onUpdate?.();
    showToast(editingTechId ? "Technical skill updated!" : "Technical skill added!");
    setSaving(false);
  }

  async function deleteTech(id) {
    if (!confirm("Delete this technical skill?")) return;
    const updated = { ...data, technical: data.technical.filter((s) => s.id !== id) };
    await saveToAPI(updated);
    setData(updated);
    onUpdate?.();
    showToast("Technical skill deleted");
  }

  // Save Professional / Soft Skill
  async function saveProf(e) {
    e.preventDefault();
    setSaving(true);
    const skill = {
      ...profForm,
      percent: Number(profForm.percent) || 80,
      id: editingProfId || Date.now(),
    };
    const updated = editingProfId
      ? data.professional.map((s) => (s.id === editingProfId ? skill : s))
      : [...data.professional, skill];
    const newData = { ...data, professional: updated };
    await saveToAPI(newData);
    setData(newData);
    setShowProfForm(false);
    setEditingProfId(null);
    setProfForm({ name: "", percent: 85, desc: "", icon: "brain" });
    onUpdate?.();
    showToast(editingProfId ? "Soft skill updated!" : "Soft skill added!");
    setSaving(false);
  }

  async function deleteProf(id) {
    if (!confirm("Delete this soft skill?")) return;
    const updated = { ...data, professional: data.professional.filter((s) => s.id !== id) };
    await saveToAPI(updated);
    setData(updated);
    onUpdate?.();
    showToast("Skill deleted");
  }

  // Add Developer Tool
  async function addTool(e) {
    e.preventDefault();
    if (!toolForm.name.trim()) return;
    const item = toolForm.badge.trim()
      ? { name: toolForm.name.trim(), badge: toolForm.badge.trim() }
      : toolForm.name.trim();

    const updated = { ...data, tools: [...data.tools, item] };
    await saveToAPI(updated);
    setData(updated);
    setToolForm({ name: "", badge: "" });
    onUpdate?.();
    showToast("Tool added successfully!");
  }

  async function deleteTool(toolToDelete) {
    const targetName = typeof toolToDelete === "string" ? toolToDelete : toolToDelete.name;
    const updated = {
      ...data,
      tools: data.tools.filter((t) => (typeof t === "string" ? t : t.name) !== targetName),
    };
    await saveToAPI(updated);
    setData(updated);
    onUpdate?.();
    showToast("Tool removed");
  }

  if (loading)
    return (
      <div className="loading-state">
        <span className="spin" />
        Loading skills manager...
      </div>
    );

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="section-header">
        <div>
          <h2>Skills &amp; Architecture Manager</h2>
          <p>Manage Bento Grid technology cards, proficiency levels, tools, and soft skills</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {["technical", "professional", "tools"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "0.5rem 1.2rem",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: activeTab === tab ? "rgba(15,247,224,0.4)" : "rgba(255,255,255,0.1)",
              background: activeTab === tab ? "rgba(15,247,224,0.12)" : "transparent",
              color: activeTab === tab ? "#0ff7e0" : "rgba(255,255,255,0.6)",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 600,
              fontFamily: "inherit",
              textTransform: "capitalize",
            }}
          >
            {tab === "technical" ? "⚡ Technical Skills" : tab === "professional" ? "💡 Soft Skills" : "🛠️ Developer Tools"}
          </button>
        ))}
      </div>

      {/* ── Technical Skills ── */}
      {activeTab === "technical" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
            <button
              className="btn-add"
              onClick={() => {
                setShowTechForm(true);
                setEditingTechId(null);
                setTechForm({
                  name: "",
                  category: "frontend",
                  percent: 85,
                  level: "Advanced",
                  tag: "",
                  capabilities: "",
                  featured: false,
                });
              }}
            >
              <span>+</span> Add Technical Skill
            </button>
          </div>

          {showTechForm && (
            <div
              className="admin-modal-overlay"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowTechForm(false);
              }}
            >
              <div className="admin-modal-box">
                <div className="modal-header">
                  <div className="modal-title-wrap">
                    <div className="modal-title-icon">⚡</div>
                    <div>
                      <h3>{editingTechId ? "Edit Technical Skill" : "New Technical Skill"}</h3>
                      <p>Configure Bento Grid technology card and proficiency</p>
                    </div>
                  </div>
                  <button type="button" className="modal-close-btn" onClick={() => setShowTechForm(false)}>
                    ✕
                  </button>
                </div>

                <form onSubmit={saveTech} className="modal-form-body">
                  <div className="form-section">
                    <div className="form-section-title">⚡ Technology Details</div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Skill Name *</label>
                        <input
                          value={techForm.name}
                          onChange={(e) => setTechForm((f) => ({ ...f, name: e.target.value }))}
                          placeholder="e.g. Next.js, React, Node.js"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Category *</label>
                        <select
                          value={techForm.category || "frontend"}
                          onChange={(e) => setTechForm((f) => ({ ...f, category: e.target.value }))}
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Proficiency Percentage (1 - 100%): {techForm.percent}%</label>
                        <input
                          type="range"
                          min={10}
                          max={100}
                          value={techForm.percent}
                          onChange={(e) => setTechForm((f) => ({ ...f, percent: Number(e.target.value) }))}
                        />
                      </div>

                      <div className="form-group">
                        <label>Level Badge</label>
                        <select
                          value={techForm.level}
                          onChange={(e) => setTechForm((f) => ({ ...f, level: e.target.value }))}
                        >
                          {LEVELS.map((l) => (
                            <option key={l} value={l}>
                              {l}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Tag / Role Pill (Optional)</label>
                        <input
                          value={techForm.tag || ""}
                          onChange={(e) => setTechForm((f) => ({ ...f, tag: e.target.value }))}
                          placeholder="e.g. CORE STACK, DATABASE, SERVER SIDE"
                        />
                      </div>

                      <div className="form-group" style={{ gridColumn: "span 2" }}>
                        <label>Capabilities (Comma Separated)</label>
                        <input
                          value={techForm.capabilities || ""}
                          onChange={(e) => setTechForm((f) => ({ ...f, capabilities: e.target.value }))}
                          placeholder="e.g. SSR/SSG, App Router, API Routes & Auth"
                        />
                      </div>

                      <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <input
                          type="checkbox"
                          id="featured-check"
                          checked={techForm.featured || false}
                          onChange={(e) => setTechForm((f) => ({ ...f, featured: e.target.checked }))}
                        />
                        <label htmlFor="featured-check" style={{ margin: 0, cursor: "pointer" }}>
                          Feature this card with extra glow
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn-cancel" onClick={() => setShowTechForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-save" disabled={saving}>
                      {saving ? "Saving..." : editingTechId ? "Update Skill" : "Add Skill"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="items-list">
            {data.technical.map((s) => (
              <div key={s.id || s.name} className="item-card">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="item-card-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {s.name}
                    {s.category && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          background: "rgba(15,247,224,0.1)",
                          color: "#0ff7e0",
                          padding: "0.1rem 0.4rem",
                          borderRadius: "4px",
                          textTransform: "uppercase",
                        }}
                      >
                        {s.category}
                      </span>
                    )}
                    {s.percent && <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>({s.percent}%)</span>}
                  </div>
                  <div className="item-card-sub">
                    {s.level || "Technical Skill"}
                    {s.tag ? ` • Tag: ${s.tag}` : ""}
                    {s.capabilities ? ` • ${s.capabilities}` : ""}
                  </div>
                </div>
                <div className="item-card-actions">
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setTechForm({
                        name: s.name,
                        category: s.category || "frontend",
                        percent: s.percent || 85,
                        level: s.level || "Advanced",
                        tag: s.tag || "",
                        capabilities: s.capabilities || "",
                        featured: s.featured || false,
                      });
                      setEditingTechId(s.id);
                      setShowTechForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => deleteTech(s.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Professional Skills ── */}
      {activeTab === "professional" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
            <button
              className="btn-add"
              onClick={() => {
                setShowProfForm(true);
                setEditingProfId(null);
                setProfForm({ name: "", percent: 85, desc: "", icon: "brain" });
              }}
            >
              <span>+</span> Add Soft Skill
            </button>
          </div>

          {showProfForm && (
            <div
              className="admin-modal-overlay"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowProfForm(false);
              }}
            >
              <div className="admin-modal-box">
                <div className="modal-header">
                  <div className="modal-title-wrap">
                    <div className="modal-title-icon">💡</div>
                    <div>
                      <h3>{editingProfId ? "Edit Soft Skill" : "New Soft Skill"}</h3>
                      <p>Define engineering mindset and communication skills</p>
                    </div>
                  </div>
                  <button type="button" className="modal-close-btn" onClick={() => setShowProfForm(false)}>
                    ✕
                  </button>
                </div>

                <form onSubmit={saveProf} className="modal-form-body">
                  <div className="form-section">
                    <div className="form-section-title">💡 Soft Skill Details</div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Skill Name *</label>
                        <input
                          value={profForm.name}
                          onChange={(e) => setProfForm((f) => ({ ...f, name: e.target.value }))}
                          placeholder="e.g. Problem Solving"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Proficiency Percentage (1 - 100%): {profForm.percent}%</label>
                        <input
                          type="range"
                          min={10}
                          max={100}
                          value={profForm.percent}
                          onChange={(e) => setProfForm((f) => ({ ...f, percent: Number(e.target.value) }))}
                        />
                      </div>

                      <div className="form-group">
                        <label>Icon Type</label>
                        <select
                          value={profForm.icon || "brain"}
                          onChange={(e) => setProfForm((f) => ({ ...f, icon: e.target.value }))}
                        >
                          {PROF_ICONS.map((ic) => (
                            <option key={ic} value={ic}>
                              {ic.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group" style={{ gridColumn: "span 2" }}>
                        <label>Description / Subtitle</label>
                        <input
                          value={profForm.desc || ""}
                          onChange={(e) => setProfForm((f) => ({ ...f, desc: e.target.value }))}
                          placeholder="e.g. Algorithmic thinking & debugging complex architecture"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn-cancel" onClick={() => setShowProfForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-save" disabled={saving}>
                      {saving ? "Saving..." : editingProfId ? "Update Skill" : "Add Skill"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="items-list">
            {data.professional.map((s) => (
              <div key={s.id || s.name} className="item-card">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="item-card-title">
                    {s.name} ({s.percent}%)
                  </div>
                  <div className="item-card-sub">{s.desc || "Soft Skill"}</div>
                </div>
                <div className="item-card-actions">
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setProfForm({
                        name: s.name,
                        percent: s.percent || 85,
                        desc: s.desc || "",
                        icon: s.icon || "brain",
                      });
                      setEditingProfId(s.id);
                      setShowProfForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => deleteProf(s.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tools ── */}
      {activeTab === "tools" && (
        <div>
          <form onSubmit={addTool} style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div className="form-group" style={{ flex: 2 }}>
              <input
                value={toolForm.name}
                onChange={(e) => setToolForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Tool Name (e.g. Antigravity, Docker, Postman)"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <input
                value={toolForm.badge}
                onChange={(e) => setToolForm((f) => ({ ...f, badge: e.target.value }))}
                placeholder="Role / Badge (e.g. AI PAIR PROGRAMMER, IDE)"
              />
            </div>
            <button type="submit" className="btn-add">
              Add Tool
            </button>
          </form>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
            {data.tools.map((tool) => {
              const toolName = typeof tool === "string" ? tool : tool.name;
              const toolBadge = typeof tool === "object" ? tool.badge : null;
              return (
                <div
                  key={toolName}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "50px",
                    padding: "0.4rem 0.95rem",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "#ffffff", fontWeight: 600 }}>{toolName}</span>
                  {toolBadge && (
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "#0ff7e0",
                        background: "rgba(15,247,224,0.12)",
                        padding: "0.1rem 0.4rem",
                        borderRadius: "4px",
                        fontWeight: 700,
                      }}
                    >
                      {toolBadge}
                    </span>
                  )}
                  <button
                    onClick={() => deleteTool(tool)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#f87171",
                      fontSize: "1.1rem",
                      lineHeight: 1,
                      padding: 0,
                      marginLeft: "0.2rem",
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

