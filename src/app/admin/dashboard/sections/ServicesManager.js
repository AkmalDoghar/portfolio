"use client";
import { useState, useEffect, useCallback } from "react";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`toast toast--${type}`}>{message}</div>;
}

const ICONS = ["FaDesktop", "FaCode", "FaChartBar", "FaBug"];

const EMPTY = { id: "", title: "", icon: "FaDesktop", shortDesc: "", fullDesc: "" };

export default function ServicesManager({ onUpdate }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => setToast({ message: msg, type });

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setServices(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const saveToAPI = async (data) => {
    await fetch("/api/admin/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const openNew = () => {
    setForm({ ...EMPTY, id: `service-${Date.now()}` });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (s) => {
    setForm({ ...s });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this service?")) return;
    const updated = services.filter(s => s.id !== id);
    await saveToAPI(updated);
    setServices(updated);
    onUpdate?.();
    showToast("Service deleted");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    let updated;
    if (editingId) {
      updated = services.map(s => s.id === editingId ? form : s);
    } else {
      updated = [...services, { ...form, id: form.id || `service-${Date.now()}` }];
    }
    await saveToAPI(updated);
    setServices(updated);
    setShowForm(false);
    setEditingId(null);
    onUpdate?.();
    showToast(editingId ? "Service updated!" : "Service added!");
    setSaving(false);
  };

  const field = (key, val) => setForm(f => ({ ...f, [key]: val }));

  if (loading) return <div className="loading-state"><span className="spin" />Loading services...</div>;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="section-header">
        <div>
          <h2>Services</h2>
          <p>{services.length} service{services.length !== 1 ? "s" : ""} total</p>
        </div>
        <button className="btn-add" onClick={openNew}>
          <span>+</span> Add Service
        </button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="admin-modal-box">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-title-icon">💼</div>
                <div>
                  <h3>{editingId ? "Edit Service Offering" : "New Service Offering"}</h3>
                  <p>Configure client service offering details and descriptions</p>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form-body">
              <div className="form-section">
                <div className="form-section-title">📌 Service Identity</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Service Title *</label>
                    <input value={form.title} onChange={e => field("title", e.target.value)} placeholder="e.g. Full-Stack Web Development" required />
                  </div>
                  <div className="form-group">
                    <label>Icon Component</label>
                    <select value={form.icon} onChange={e => field("icon", e.target.value)}>
                      {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">📝 Descriptions & Scope</div>
                <div className="form-grid">
                  <div className="form-group col-span-2">
                    <label>Short Summary * (shown on grid card)</label>
                    <textarea rows={2} value={form.shortDesc} onChange={e => field("shortDesc", e.target.value)} placeholder="Brief summary shown on the card..." required />
                  </div>
                  <div className="form-group col-span-2">
                    <label>Detailed Overview (Full Modal Description)</label>
                    <textarea rows={4} value={form.fullDesc} onChange={e => field("fullDesc", e.target.value)} placeholder="Detailed breakdown of what this service includes..." />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>{saving ? "Saving..." : (editingId ? "Update Service" : "Add Service")}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="items-list">
        {services.map(s => (
          <div key={s.id} className="item-card">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="item-card-title">{s.title}</div>
              <div className="item-card-sub">{s.shortDesc}</div>
              <div style={{ marginTop: "0.35rem" }}><span className="badge">{s.icon}</span></div>
            </div>
            <div className="item-card-actions">
              <button className="btn-edit" onClick={() => openEdit(s)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(s.id)}>Delete</button>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <div className="loading-state">No services yet.</div>
        )}
      </div>
    </div>
  );
}
