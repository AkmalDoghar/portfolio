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
const TECH_CLASSES = ["html", "css", "javascript", "reactjs", "nextjs", "nodejs", "mongodb", "git", "python", "typescript", "other"];

export default function SkillsManager({ onUpdate }) {
  const [data, setData] = useState({ technical: [], professional: [], tools: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("technical");

  // Forms
  const [showTechForm, setShowTechForm] = useState(false);
  const [techForm, setTechForm] = useState({ name: "", percent: 80, class: "other", level: "Intermediate" });
  const [editingTechId, setEditingTechId] = useState(null);

  const [showProfForm, setShowProfForm] = useState(false);
  const [profForm, setProfForm] = useState({ name: "", percent: 80 });
  const [editingProfId, setEditingProfId] = useState(null);

  const [newTool, setNewTool] = useState("");

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

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  const saveToAPI = async (newData) => {
    await fetch("/api/admin/skills", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    });
  };

  async function saveTech(e) {
    e.preventDefault();
    setSaving(true);
    const skill = { ...techForm, percent: Number(techForm.percent), id: editingTechId || Date.now() };
    const updated = editingTechId
      ? data.technical.map(s => s.id === editingTechId ? skill : s)
      : [...data.technical, skill];
    const newData = { ...data, technical: updated };
    await saveToAPI(newData);
    setData(newData);
    setShowTechForm(false);
    setEditingTechId(null);
    setTechForm({ name: "", percent: 80, class: "other", level: "Intermediate" });
    onUpdate?.();
    showToast(editingTechId ? "Skill updated!" : "Skill added!");
    setSaving(false);
  }

  async function deleteTech(id) {
    if (!confirm("Delete this skill?")) return;
    const updated = { ...data, technical: data.technical.filter(s => s.id !== id) };
    await saveToAPI(updated);
    setData(updated);
    onUpdate?.();
    showToast("Skill deleted");
  }

  async function saveProf(e) {
    e.preventDefault();
    setSaving(true);
    const skill = { ...profForm, percent: Number(profForm.percent), id: editingProfId || Date.now() };
    const updated = editingProfId
      ? data.professional.map(s => s.id === editingProfId ? skill : s)
      : [...data.professional, skill];
    const newData = { ...data, professional: updated };
    await saveToAPI(newData);
    setData(newData);
    setShowProfForm(false);
    setEditingProfId(null);
    setProfForm({ name: "", percent: 80 });
    onUpdate?.();
    showToast(editingProfId ? "Skill updated!" : "Skill added!");
    setSaving(false);
  }

  async function deleteProf(id) {
    if (!confirm("Delete this skill?")) return;
    const updated = { ...data, professional: data.professional.filter(s => s.id !== id) };
    await saveToAPI(updated);
    setData(updated);
    onUpdate?.();
    showToast("Skill deleted");
  }

  async function addTool(e) {
    e.preventDefault();
    if (!newTool.trim()) return;
    const updated = { ...data, tools: [...data.tools, newTool.trim()] };
    await saveToAPI(updated);
    setData(updated);
    setNewTool("");
    onUpdate?.();
    showToast("Tool added!");
  }

  async function deleteTool(tool) {
    const updated = { ...data, tools: data.tools.filter(t => t !== tool) };
    await saveToAPI(updated);
    setData(updated);
    onUpdate?.();
    showToast("Tool removed");
  }

  if (loading) return <div className="loading-state"><span className="spin" />Loading skills...</div>;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="section-header">
        <div>
          <h2>Skills</h2>
          <p>Manage technical, professional skills and tools</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {["technical", "professional", "tools"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "0.45rem 1rem",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: activeTab === tab ? "rgba(15,247,224,0.4)" : "rgba(255,255,255,0.1)",
              background: activeTab === tab ? "rgba(15,247,224,0.1)" : "transparent",
              color: activeTab === tab ? "#0ff7e0" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 500,
              fontFamily: "inherit",
              textTransform: "capitalize",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Technical Skills ── */}
      {activeTab === "technical" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
            <button className="btn-add" onClick={() => { setShowTechForm(true); setEditingTechId(null); setTechForm({ name: "", percent: 80, class: "other", level: "Intermediate" }); }}>
              <span>+</span> Add Skill
            </button>
          </div>

          {showTechForm && (
            <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowTechForm(false); }}>
              <div className="admin-modal-box">
                <div className="modal-header">
                  <div className="modal-title-wrap">
                    <div className="modal-title-icon">⚡</div>
                    <div>
                      <h3>{editingTechId ? "Edit Technical Skill" : "New Technical Skill"}</h3>
                      <p>Define technology stack item and proficiency rating</p>
                    </div>
                  </div>
                  <button type="button" className="modal-close-btn" onClick={() => setShowTechForm(false)}>✕</button>
                </div>
                <form onSubmit={saveTech} className="modal-form-body">
                  <div className="form-section">
                    <div className="form-section-title">⚡ Skill Information</div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Skill Name *</label>
                        <input value={techForm.name} onChange={e => setTechForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. React.js" required />
                      </div>
                      <div className="form-group">
                        <label>Proficiency Percent (1 - 100%)</label>
                        <input type="number" min={1} max={100} value={techForm.percent} onChange={e => setTechForm(f => ({ ...f, percent: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label>Icon CSS Class</label>
                        <select value={techForm.class} onChange={e => setTechForm(f => ({ ...f, class: e.target.value }))}>
                          {TECH_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Proficiency Level</label>
                        <select value={techForm.level} onChange={e => setTechForm(f => ({ ...f, level: e.target.value }))}>
                          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn-cancel" onClick={() => setShowTechForm(false)}>Cancel</button>
                    <button type="submit" className="btn-save" disabled={saving}>{saving ? "Saving..." : (editingTechId ? "Update Skill" : "Add Skill")}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="items-list">
            {data.technical.map(s => (
              <div key={s.id} className="item-card">
                <div style={{ flex: 1 }}>
                  <div className="item-card-title">{s.name}</div>
                  <div className="item-card-sub">{s.level} · {s.percent}%</div>
                  <div className="skill-percent-bar">
                    <div className="skill-percent-bar-fill" style={{ width: `${s.percent}%` }} />
                  </div>
                </div>
                <div className="item-card-actions">
                  <button className="btn-edit" onClick={() => { setTechForm({ ...s }); setEditingTechId(s.id); setShowTechForm(true); }}>Edit</button>
                  <button className="btn-delete" onClick={() => deleteTech(s.id)}>Delete</button>
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
            <button className="btn-add" onClick={() => { setShowProfForm(true); setEditingProfId(null); setProfForm({ name: "", percent: 80 }); }}>
              <span>+</span> Add Skill
            </button>
          </div>

          {showProfForm && (
            <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowProfForm(false); }}>
              <div className="admin-modal-box">
                <div className="modal-header">
                  <div className="modal-title-wrap">
                    <div className="modal-title-icon">💡</div>
                    <div>
                      <h3>{editingProfId ? "Edit Professional Skill" : "New Professional Skill"}</h3>
                      <p>Soft skills, communication, or team workflow skills</p>
                    </div>
                  </div>
                  <button type="button" className="modal-close-btn" onClick={() => setShowProfForm(false)}>✕</button>
                </div>
                <form onSubmit={saveProf} className="modal-form-body">
                  <div className="form-section">
                    <div className="form-section-title">💡 Skill Details</div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Skill Name *</label>
                        <input value={profForm.name} onChange={e => setProfForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Team Leadership" required />
                      </div>
                      <div className="form-group">
                        <label>Proficiency Percent (1 - 100%)</label>
                        <input type="number" min={1} max={100} value={profForm.percent} onChange={e => setProfForm(f => ({ ...f, percent: e.target.value }))} />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn-cancel" onClick={() => setShowProfForm(false)}>Cancel</button>
                    <button type="submit" className="btn-save" disabled={saving}>{saving ? "Saving..." : (editingProfId ? "Update Skill" : "Add Skill")}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="items-list">
            {data.professional.map(s => (
              <div key={s.id} className="item-card">
                <div style={{ flex: 1 }}>
                  <div className="item-card-title">{s.name}</div>
                  <div className="item-card-sub">{s.percent}%</div>
                  <div className="skill-percent-bar">
                    <div className="skill-percent-bar-fill" style={{ width: `${s.percent}%` }} />
                  </div>
                </div>
                <div className="item-card-actions">
                  <button className="btn-edit" onClick={() => { setProfForm({ name: s.name, percent: s.percent }); setEditingProfId(s.id); setShowProfForm(true); }}>Edit</button>
                  <button className="btn-delete" onClick={() => deleteProf(s.id)}>Delete</button>
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
            <div className="form-group" style={{ flex: 1 }}>
              <input
                value={newTool}
                onChange={e => setNewTool(e.target.value)}
                placeholder="Add a tool or platform (e.g. Figma, Docker, Postman)"
              />
            </div>
            <button type="submit" className="btn-add">Add Tool</button>
          </form>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
            {data.tools.map(tool => (
              <div key={tool} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", padding: "0.35rem 0.9rem" }}>
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>{tool}</span>
                <button
                  onClick={() => deleteTool(tool)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: "1rem", lineHeight: 1, padding: 0 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
