"use client";
import { useState, useEffect, useCallback } from "react";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`toast toast--${type}`}>{message}</div>;
}

const EMPTY = { id: Date.now(), period: "", title: "", type: "", points: "", tech: "" };

export default function ExperienceManager({ onUpdate }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => setToast({ message: msg, type });

  const fetchExp = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/experience");
    const data = await res.json();
    setExperiences(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchExp(); }, [fetchExp]);

  const saveToAPI = async (data) => {
    await fetch("/api/admin/experience", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const openNew = () => {
    setForm({ ...EMPTY, id: Date.now() });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (exp) => {
    setForm({
      ...exp,
      points: Array.isArray(exp.points) ? exp.points.join("\n") : exp.points,
      tech: Array.isArray(exp.tech) ? exp.tech.join(", ") : exp.tech,
    });
    setEditingId(exp.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this experience?")) return;
    const updated = experiences.filter(e => e.id !== id);
    await saveToAPI(updated);
    setExperiences(updated);
    onUpdate?.();
    showToast("Experience deleted");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formatted = {
      ...form,
      id: editingId || Date.now(),
      points: form.points.split("\n").map(p => p.trim()).filter(Boolean),
      tech: form.tech.split(",").map(t => t.trim()).filter(Boolean),
    };

    let updated;
    if (editingId) {
      updated = experiences.map(exp => exp.id === editingId ? formatted : exp);
    } else {
      updated = [...experiences, formatted];
    }

    await saveToAPI(updated);
    setExperiences(updated);
    setShowForm(false);
    setEditingId(null);
    onUpdate?.();
    showToast(editingId ? "Experience updated!" : "Experience added!");
    setSaving(false);
  };

  const field = (key, val) => setForm(f => ({ ...f, [key]: val }));

  if (loading) return <div className="loading-state"><span className="spin" />Loading experiences...</div>;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="section-header">
        <div>
          <h2>Experience</h2>
          <p>{experiences.length} experience record{experiences.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="btn-add" onClick={openNew}>
          <span>+</span> Add Experience
        </button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="admin-modal-box">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-title-icon">📜</div>
                <div>
                  <h3>{editingId ? "Edit Experience Record" : "New Career History"}</h3>
                  <p>Configure role title, duration, responsibilities, and technologies</p>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form-body">
              <div className="form-section">
                <div className="form-section-title">💼 Role & Duration</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Period / Duration *</label>
                    <input value={form.period} onChange={e => field("period", e.target.value)} placeholder="e.g. 2024 – Present" required />
                  </div>
                  <div className="form-group">
                    <label>Engagement Type</label>
                    <input value={form.type} onChange={e => field("type", e.target.value)} placeholder="e.g. Freelance / Full-Time" />
                  </div>
                  <div className="form-group col-span-2">
                    <label>Role / Position Title *</label>
                    <input value={form.title} onChange={e => field("title", e.target.value)} placeholder="e.g. Freelance Full-Stack Developer" required />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">⚡ Highlights & Stack</div>
                <div className="form-grid">
                  <div className="form-group col-span-2">
                    <label>Key Responsibilities & Highlights (one per line)</label>
                    <textarea rows={4} value={form.points} onChange={e => field("points", e.target.value)} placeholder={"Built responsive web apps for clients\nOptimized RESTful API endpoints\nManaged deployment pipelines"} />
                  </div>
                  <div className="form-group col-span-2">
                    <label>Technologies Used (comma separated)</label>
                    <input value={form.tech} onChange={e => field("tech", e.target.value)} placeholder="Next.js, React, Node.js, MongoDB" />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>{saving ? "Saving..." : (editingId ? "Update Experience" : "Add Experience")}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="items-list">
        {experiences.map(exp => (
          <div key={exp.id} className="item-card">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="item-card-title">{exp.title}</div>
              <div className="item-card-sub">{exp.period} · {exp.type}</div>
              {exp.tech && (
                <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                  {(Array.isArray(exp.tech) ? exp.tech : exp.tech.split(",")).map(t => (
                    <span key={t} className="badge">{t.trim()}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="item-card-actions">
              <button className="btn-edit" onClick={() => openEdit(exp)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(exp.id)}>Delete</button>
            </div>
          </div>
        ))}
        {experiences.length === 0 && (
          <div className="loading-state">No experiences yet.</div>
        )}
      </div>
    </div>
  );
}
