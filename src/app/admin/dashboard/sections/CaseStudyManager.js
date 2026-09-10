"use client";
import { useState, useEffect, useCallback } from "react";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`toast toast--${type}`}>{message}</div>;
}

const ACCENT_OPTIONS = [
  { value: "cyan", label: "Cyan (Auth / Core)" },
  { value: "violet", label: "Violet (Architecture)" },
  { value: "rose", label: "Rose (Security)" },
  { value: "amber", label: "Amber (Performance)" },
  { value: "emerald", label: "Emerald (Data Model)" },
  { value: "blue", label: "Blue (Frontend)" },
  { value: "indigo", label: "Indigo (API Layer)" },
  { value: "pink", label: "Pink (UX)" },
];

const EMPTY = {
  id: "",
  badge: "",
  title: "",
  icon: "🔒",
  desc: "",
  points: "",
  accent: "cyan",
  span: "1",
};

export default function CaseStudyManager({ onUpdate }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => setToast({ message: msg, type });

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/casestudy");
      const data = await res.json();
      setCards(Array.isArray(data) ? data : []);
    } catch {
      /* no casestudy API yet — show empty state */
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchCards(); }, [fetchCards]);

  const saveToAPI = async (data) => {
    await fetch("/api/admin/casestudy", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const openNew = () => {
    setForm({ ...EMPTY, id: `cs-${Date.now()}` });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (card) => {
    setForm({
      ...card,
      points: Array.isArray(card.points) ? card.points.join("\n") : (card.points || ""),
    });
    setEditingId(card.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this case study card?")) return;
    const updated = cards.filter((c) => c.id !== id);
    await saveToAPI(updated);
    setCards(updated);
    onUpdate?.();
    showToast("Card deleted");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formatted = {
      ...form,
      points: form.points
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean),
    };
    let updated;
    if (editingId) {
      updated = cards.map((c) => (c.id === editingId ? formatted : c));
    } else {
      updated = [...cards, formatted];
    }
    await saveToAPI(updated);
    setCards(updated);
    setShowForm(false);
    setEditingId(null);
    onUpdate?.();
    showToast(editingId ? "Card updated!" : "Card added!");
    setSaving(false);
  };

  const field = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  if (loading) return <div className="loading-state"><span className="spin" />Loading case study cards...</div>;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="section-header">
        <div>
          <h2>Case Study Bento Cards</h2>
          <p>{cards.length} card{cards.length !== 1 ? "s" : ""} · 8 cards recommended for the grid</p>
        </div>
        <button className="btn-add" onClick={openNew}>
          <span>+</span> Add Card
        </button>
      </div>

      {showForm && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div className="admin-modal-box">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-title-icon">🧩</div>
                <div>
                  <h3>{editingId ? "Edit Case Study Card" : "New Case Study Card"}</h3>
                  <p>Configure bento grid architectural card content and styling</p>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form-body">
              <div className="form-section">
                <div className="form-section-title">🏷️ Card Identity</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Badge Label *</label>
                    <input
                      value={form.badge}
                      onChange={(e) => field("badge", e.target.value)}
                      placeholder="e.g. AUTH & ACCESS"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Card Icon (Emoji)</label>
                    <input
                      value={form.icon}
                      onChange={(e) => field("icon", e.target.value)}
                      placeholder="e.g. 🔒 or ⚡"
                    />
                  </div>
                  <div className="form-group col-span-2">
                    <label>Card Title *</label>
                    <input
                      value={form.title}
                      onChange={(e) => field("title", e.target.value)}
                      placeholder="e.g. Authentication & Role Guards"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">🎨 Visual & Layout</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Neon Accent Color</label>
                    <select value={form.accent} onChange={(e) => field("accent", e.target.value)}>
                      {ACCENT_OPTIONS.map((a) => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Grid Span</label>
                    <select value={form.span} onChange={(e) => field("span", e.target.value)}>
                      <option value="1">Normal (1 column)</option>
                      <option value="2">Wide (2 columns)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">📝 Content</div>
                <div className="form-grid">
                  <div className="form-group col-span-2">
                    <label>Short Description</label>
                    <textarea
                      rows={2}
                      value={form.desc}
                      onChange={(e) => field("desc", e.target.value)}
                      placeholder="Brief card overview..."
                    />
                  </div>
                  <div className="form-group col-span-2">
                    <label>Bullet Points (one per line)</label>
                    <textarea
                      rows={4}
                      value={form.points}
                      onChange={(e) => field("points", e.target.value)}
                      placeholder={"JWT-based session authentication\nRole-based access guards (admin/user)\nRefresh token rotation strategy"}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? "Saving..." : (editingId ? "Update Card" : "Add Card")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="items-list">
        {cards.map((card) => (
          <div key={card.id} className="item-card">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="item-card-title">
                {card.icon} {card.title}
              </div>
              <div className="item-card-sub">{card.badge}</div>
              {card.desc && (
                <div style={{ marginTop: "0.35rem", fontSize: "0.82rem", color: "#94a3b8" }}>
                  {card.desc.substring(0, 100)}{card.desc.length > 100 ? "..." : ""}
                </div>
              )}
              <div style={{ marginTop: "0.4rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                <span className="badge">Accent: {card.accent}</span>
                <span className="badge">Span: {card.span || 1}col</span>
                {Array.isArray(card.points) && (
                  <span className="badge">{card.points.length} points</span>
                )}
              </div>
            </div>
            <div className="item-card-actions">
              <button className="btn-edit" onClick={() => openEdit(card)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(card.id)}>Delete</button>
            </div>
          </div>
        ))}
        {cards.length === 0 && (
          <div className="loading-state">
            No case study cards yet. Add cards to populate the Bento Grid.
          </div>
        )}
      </div>
    </div>
  );
}
