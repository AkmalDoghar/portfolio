"use client";
import { useState, useEffect, useCallback, useRef } from "react";

const EMPTY_PROJECT = {
  id: Date.now(),
  title: "", role: "", category: "web", img: "",
  description: "", tech: "", problem: "", features: "", result: "",
  link: "#", github: "#",
};

const CATEGORY_OPTIONS = [
  { value: "web", label: "Web Apps" },
  { value: "product", label: "Products" },
  { value: "inter", label: "Interfaces" },
];

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`toast toast--${type}`}>{message}</div>;
}

export default function ProjectsManager({ onUpdate }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);
  const [uploadingImg, setUploadingImg] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/projects");
    const data = await res.json();
    const sorted = Array.isArray(data) ? [...data].sort((a, b) => Number(b.id || 0) - Number(a.id || 0)) : [];
    setProjects(sorted);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const openNew = () => {
    setForm({ ...EMPTY_PROJECT, id: Date.now() });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (project) => {
    setForm({
      ...project,
      tech: Array.isArray(project.tech) ? project.tech.join(", ") : project.tech,
      features: Array.isArray(project.features) ? project.features.join("\n") : project.features,
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const updated = projects.filter(p => p.id !== id);
    await saveToAPI(updated);
    setProjects(updated);
    onUpdate?.();
    showToast("Project deleted successfully");
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show temporary local object URL for instant preview feedback
    const localUrl = URL.createObjectURL(file);
    field("img", localUrl);

    setUploadingImg(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        field("img", data.url);
        showToast("Image uploaded successfully!");
      } else {
        showToast(data.error || "Image upload failed", "error");
      }
    } catch (err) {
      showToast("Error uploading image file", "error");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const DEFAULT_POOL = ["/images/image1.jpeg", "/images/image2.jpeg", "/images/image3.jpeg"];
    const finalImg = form.img && form.img.trim() ? form.img.trim() : DEFAULT_POOL[Math.floor(Math.random() * DEFAULT_POOL.length)];

    const formatted = {
      ...form,
      img: finalImg,
      tech: typeof form.tech === "string" ? form.tech.split(",").map(t => t.trim()).filter(Boolean) : form.tech,
      features: typeof form.features === "string" ? form.features.split("\n").map(f => f.trim()).filter(Boolean) : form.features,
    };

    let updated;
    if (editingId !== null) {
      updated = projects.map(p => p.id === editingId ? formatted : p);
    } else {
      updated = [{ ...formatted, id: Date.now() }, ...projects];
    }

    await saveToAPI(updated);
    setProjects(updated);
    setShowForm(false);
    setEditingId(null);
    onUpdate?.();
    showToast(editingId ? "Project updated!" : "Project added!");
    setSaving(false);
  };

  const saveToAPI = async (data) => {
    await fetch("/api/admin/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const field = (key, val) => setForm(f => ({ ...f, [key]: val }));

  if (loading) return <div className="loading-state"><span className="spin" />Loading projects...</div>;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="section-header">
        <div>
          <h2>Projects</h2>
          <p>{projects.length} project{projects.length !== 1 ? "s" : ""} total</p>
        </div>
        <button className="btn-add" onClick={openNew}>
          <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>+</span> Add Project
        </button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="admin-modal-box">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-title-icon">
                  {editingId ? "✏️" : "🚀"}
                </div>
                <div>
                  <h3>{editingId ? "Edit Project Details" : "Create New Project"}</h3>
                  <p>Upload project preview screenshot and details</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form-body">
              {/* Section 1: Basic Info */}
              <div className="form-section">
                <div className="form-section-title">📌 Basic Information</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Project Title *</label>
                    <input value={form.title} onChange={e => field("title", e.target.value)} placeholder="e.g. Weather Forecast PWA" required />
                  </div>
                  <div className="form-group">
                    <label>Your Role *</label>
                    <input value={form.role} onChange={e => field("role", e.target.value)} placeholder="e.g. Lead Full-Stack Developer" required />
                  </div>
                  <div className="form-group col-span-2">
                    <label>Category</label>
                    <select value={form.category} onChange={e => field("category", e.target.value)}>
                      {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Image Upload & Live Preview */}
              <div className="form-section">
                <div className="form-section-title">🖼️ Project Image & Live Preview</div>
                <div className="form-group col-span-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                  />

                  {form.img ? (
                    <div className="img-preview-box">
                      <div className="img-preview-wrap">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={form.img} alt="Project Screenshot Preview" className="img-preview-thumb" />
                        {uploadingImg && (
                          <div className="img-upload-overlay">
                            <span className="spin" /> Uploading image...
                          </div>
                        )}
                      </div>
                      <div className="img-preview-info">
                        <span className="badge">Image Path: {form.img}</span>
                        <div className="img-preview-actions">
                          <button
                            type="button"
                            className="btn-edit"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            📷 Change Image
                          </button>
                          <button
                            type="button"
                            className="btn-delete"
                            onClick={() => field("img", "")}
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="img-dropzone"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="dropzone-icon">📤</div>
                      <div className="dropzone-text">
                        <strong>Click here to Select & Upload Image</strong>
                      </div>
                      <div className="dropzone-sub">PNG, JPG, WEBP, GIF up to 10MB</div>
                    </div>
                  )}

                  <div style={{ marginTop: "0.75rem" }}>
                    <input
                      value={form.img}
                      onChange={(e) => field("img", e.target.value)}
                      placeholder="Or paste direct image URL (e.g. /images/weather.png)"
                      style={{ fontSize: "0.82rem", padding: "0.6rem 0.85rem" }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Links */}
              <div className="form-section">
                <div className="form-section-title">🔗 Links & Repository</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Live Demo URL</label>
                    <input value={form.link} onChange={e => field("link", e.target.value)} placeholder="https://your-app.com" />
                  </div>
                  <div className="form-group">
                    <label>GitHub Repository URL</label>
                    <input value={form.github} onChange={e => field("github", e.target.value)} placeholder="https://github.com/username/repo" />
                  </div>
                </div>
              </div>

              {/* Section 4: Tech & Details */}
              <div className="form-section">
                <div className="form-section-title">⚙️ Tech Stack & Description</div>
                <div className="form-grid">
                  <div className="form-group col-span-2">
                    <label>Tech Stack (comma separated)</label>
                    <input value={form.tech} onChange={e => field("tech", e.target.value)} placeholder="Next.js, React, TailwindCSS, MongoDB" />
                  </div>
                  <div className="form-group col-span-2">
                    <label>Description *</label>
                    <textarea rows={3} value={form.description} onChange={e => field("description", e.target.value)} placeholder="Overview of the project..." required />
                  </div>
                  <div className="form-group col-span-2">
                    <label>Problem Solved</label>
                    <textarea rows={2} value={form.problem} onChange={e => field("problem", e.target.value)} placeholder="What challenge did this project solve?" />
                  </div>
                  <div className="form-group col-span-2">
                    <label>Key Features (one per line)</label>
                    <textarea rows={3} value={form.features} onChange={e => field("features", e.target.value)} placeholder={"Real-time weather data\nPWA installation\nDark & Light mode"} />
                  </div>
                  <div className="form-group col-span-2">
                    <label>Result & Impact</label>
                    <textarea rows={2} value={form.result} onChange={e => field("result", e.target.value)} placeholder="Measurable impact or result..." />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving || uploadingImg}>
                  {saving ? "Saving..." : (editingId ? "Update Project" : "Add Project")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="items-list">
        {projects.map(project => (
          <div key={project.id} className="item-card">
            {project.img && (
              <div style={{ width: "80px", height: "55px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)", background: "#000" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.img} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="item-card-title">{project.title}</div>
              <div className="item-card-sub">{project.role} · <span className="badge">{project.category}</span></div>
              {project.tech && (
                <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  {(Array.isArray(project.tech) ? project.tech : project.tech.split(",")).map(t => (
                    <span key={t} className="badge">{t.trim()}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="item-card-actions">
              <button className="btn-edit" onClick={() => openEdit(project)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDelete(project.id)}>Delete</button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="loading-state">No projects yet. Click "Add Project" to get started.</div>
        )}
      </div>
    </div>
  );
}
