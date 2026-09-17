"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function HomeSettingsManager({ onUpdate }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [activeTab, setActiveTab] = useState("hero");

  const [form, setForm] = useState({
    name: "",
    copyrightName: "",
    navbarLogoText: "",
    email: "",
    location: "",
    responseTime: "",
    github: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
    heroTitle: "",
    typingWords: [],
    heroDescription: "",
    heroImage: "",
    badge1Title: "",
    badge1Sub: "",
    badge2Title: "",
    badge2Sub: "",
    aboutImage: "",
    aboutTag: "",
    aboutTitle: "",
    aboutDescription1: "",
    aboutDescription2: "",
    aboutYearsExp: "",
    aboutProjectsBuilt: "",
    aboutLiveDeployed: "",
  });

  const [typingInput, setTypingInput] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setForm(data);
        if (Array.isArray(data.typingWords)) {
          setTypingInput(data.typingWords.join(", "));
        }
      } else {
        toast.error("Failed to load settings");
      }
    } catch {
      toast.error("Error connecting to settings server");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypingChange = (e) => {
    const val = e.target.value;
    setTypingInput(val);
    const words = val.split(",").map((w) => w.trim()).filter(Boolean);
    setForm((prev) => ({ ...prev, typingWords: words }));
  };

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm((prev) => ({ ...prev, [fieldName]: data.url }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(data.error || "Image upload failed");
      }
    } catch {
      toast.error("Error uploading image");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Home & Site Settings updated successfully! 🎉");
        if (onUpdate) onUpdate();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save settings");
      }
    } catch {
      toast.error("Network error while saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="section-card">
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading Home Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-card settings-manager">
      {/* Header */}
      <div className="section-header">
        <div>
          <h2>Home &amp; Site Manager</h2>
          <p className="section-desc">
            Edit your homepage text, profile details, hero banners, social links, email addresses, images, navbar logo, and footer credentials in real-time.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary btn-save"
        >
          {saving ? "Saving Changes..." : "Save Settings"}
        </button>
      </div>

      {/* Tabs */}
      <div className="settings-tabs" style={{ display: "flex", gap: "10px", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)", pb: "12px", flexWrap: "wrap" }}>
        {[
          { id: "hero", label: "Hero & Home Page" },
          { id: "profile", label: "Profile & Contact" },
          { id: "about", label: "About Section" },
          { id: "social", label: "Social Links" },
          { id: "brand", label: "Navbar & Footer" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: activeTab === tab.id ? "1px solid #0ff7e0" : "1px solid rgba(255,255,255,0.1)",
              background: activeTab === tab.id ? "rgba(15, 247, 224, 0.1)" : "rgba(255,255,255,0.03)",
              color: activeTab === tab.id ? "#0ff7e0" : "#a0aec0",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tab 1: Hero & Home Page */}
        {activeTab === "hero" && (
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Hero Heading</label>
              <input
                type="text"
                name="heroTitle"
                value={form.heroTitle || ""}
                onChange={handleChange}
                placeholder="Full-Stack Next.js Developer Building Fast, Production-Ready Web Apps"
              />
            </div>

            <div className="form-group full-width">
              <label>Typing Animation Roles (Comma Separated)</label>
              <input
                type="text"
                value={typingInput}
                onChange={handleTypingChange}
                placeholder="Full-Stack JavaScript Developer, Next.js & React Engineer, Node.js & MongoDB Specialist"
              />
              <span className="field-hint" style={{ fontSize: "12px", color: "#808a9d", marginTop: "4px" }}>
                Separate each role with a comma. Example: Full-Stack Developer, React Engineer, Mobile Developer
              </span>
            </div>

            <div className="form-group full-width">
              <label>Hero Intro Paragraph / Description</label>
              <textarea
                name="heroDescription"
                rows="3"
                value={form.heroDescription || ""}
                onChange={handleChange}
                placeholder="I build fast, production-ready web apps..."
              />
            </div>

            <div className="form-group">
              <label>Hero Image Link / Upload</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="text"
                  name="heroImage"
                  value={form.heroImage || ""}
                  onChange={handleChange}
                  placeholder="/Akmal1.png or image URL"
                />
                <label className="btn-secondary" style={{ padding: "8px 14px", cursor: "pointer", whiteSpace: "nowrap" }}>
                  {uploadingField === "heroImage" ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "heroImage")}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
              {form.heroImage && (
                <div style={{ marginTop: "10px" }}>
                  <img src={form.heroImage} alt="Hero Preview" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)" }} />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Floating Badge 1 - Title & Subtitle</label>
              <input
                type="text"
                name="badge1Title"
                value={form.badge1Title || ""}
                onChange={handleChange}
                placeholder="Full-Stack JS"
                style={{ marginBottom: "8px" }}
              />
              <input
                type="text"
                name="badge1Sub"
                value={form.badge1Sub || ""}
                onChange={handleChange}
                placeholder="Next.js • React • Node • Mongo"
              />
            </div>

            <div className="form-group">
              <label>Floating Badge 2 - Title & Subtitle</label>
              <input
                type="text"
                name="badge2Title"
                value={form.badge2Title || ""}
                onChange={handleChange}
                placeholder="Web Apps"
                style={{ marginBottom: "8px" }}
              />
              <input
                type="text"
                name="badge2Sub"
                value={form.badge2Sub || ""}
                onChange={handleChange}
                placeholder="Fast & Scalable"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Profile & Contact */}
        {activeTab === "profile" && (
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                placeholder="Muhammad Akmal"
              />
            </div>

            <div className="form-group">
              <label>Primary Email (Used across Navbar, Home & Contact)</label>
              <input
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                placeholder="84pakarmy@gmail.com"
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={form.location || ""}
                onChange={handleChange}
                placeholder="Pakistan (Remote Worldwide)"
              />
            </div>

            <div className="form-group">
              <label>Response Time Guarantee</label>
              <input
                type="text"
                name="responseTime"
                value={form.responseTime || ""}
                onChange={handleChange}
                placeholder="Within 24 hours guaranteed"
              />
            </div>
          </div>
        )}

        {/* Tab 3: About Section */}
        {activeTab === "about" && (
          <div className="form-grid">
            <div className="form-group">
              <label>About Profile Image</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="text"
                  name="aboutImage"
                  value={form.aboutImage || ""}
                  onChange={handleChange}
                  placeholder="/Akmal2.png"
                />
                <label className="btn-secondary" style={{ padding: "8px 14px", cursor: "pointer", whiteSpace: "nowrap" }}>
                  {uploadingField === "aboutImage" ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "aboutImage")}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
              {form.aboutImage && (
                <div style={{ marginTop: "10px" }}>
                  <img src={form.aboutImage} alt="About Preview" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)" }} />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>About Tag</label>
              <input
                type="text"
                name="aboutTag"
                value={form.aboutTag || ""}
                onChange={handleChange}
                placeholder="FULL-STACK WEB ENGINEER"
              />
            </div>

            <div className="form-group full-width">
              <label>About Main Headline Title</label>
              <input
                type="text"
                name="aboutTitle"
                value={form.aboutTitle || ""}
                onChange={handleChange}
                placeholder="Crafting Scalable Digital Products with Clean Architecture"
              />
            </div>

            <div className="form-group full-width">
              <label>About Paragraph 1</label>
              <textarea
                name="aboutDescription1"
                rows="3"
                value={form.aboutDescription1 || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>About Paragraph 2</label>
              <textarea
                name="aboutDescription2"
                rows="3"
                value={form.aboutDescription2 || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Years Experience Stat</label>
              <input
                type="text"
                name="aboutYearsExp"
                value={form.aboutYearsExp || ""}
                onChange={handleChange}
                placeholder="1+"
              />
            </div>

            <div className="form-group">
              <label>Projects Built Stat</label>
              <input
                type="text"
                name="aboutProjectsBuilt"
                value={form.aboutProjectsBuilt || ""}
                onChange={handleChange}
                placeholder="8+"
              />
            </div>

            <div className="form-group">
              <label>Live Deployed Stat</label>
              <input
                type="text"
                name="aboutLiveDeployed"
                value={form.aboutLiveDeployed || ""}
                onChange={handleChange}
                placeholder="3+"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Social Links */}
        {activeTab === "social" && (
          <div className="form-grid">
            <div className="form-group">
              <label>GitHub Profile URL</label>
              <input
                type="text"
                name="github"
                value={form.github || ""}
                onChange={handleChange}
                placeholder="https://github.com/AkmalDoghar"
              />
            </div>

            <div className="form-group">
              <label>LinkedIn Profile URL</label>
              <input
                type="text"
                name="linkedin"
                value={form.linkedin || ""}
                onChange={handleChange}
                placeholder="https://www.linkedin.com/in/muhammad-akmal-dev/"
              />
            </div>

            <div className="form-group">
              <label>Facebook Profile URL</label>
              <input
                type="text"
                name="facebook"
                value={form.facebook || ""}
                onChange={handleChange}
                placeholder="https://www.facebook.com/"
              />
            </div>

            <div className="form-group">
              <label>Instagram Profile URL</label>
              <input
                type="text"
                name="instagram"
                value={form.instagram || ""}
                onChange={handleChange}
                placeholder="https://www.instagram.com/muhammadakmal1225/"
              />
            </div>

            <div className="form-group">
              <label>WhatsApp Link / Number</label>
              <input
                type="text"
                name="whatsapp"
                value={form.whatsapp || ""}
                onChange={handleChange}
                placeholder="https://wa.me/923017697832"
              />
            </div>
          </div>
        )}

        {/* Tab 5: Navbar & Footer */}
        {activeTab === "brand" && (
          <div className="form-grid">
            <div className="form-group">
              <label>Navbar Brand Logo Text</label>
              <input
                type="text"
                name="navbarLogoText"
                value={form.navbarLogoText || ""}
                onChange={handleChange}
                placeholder="Akmal"
              />
              <span className="field-hint" style={{ fontSize: "12px", color: "#808a9d", marginTop: "4px" }}>
                Rendered inside logo tag as &lt; {form.navbarLogoText || "Akmal"} /&gt;
              </span>
            </div>

            <div className="form-group">
              <label>Footer Copyright Name</label>
              <input
                type="text"
                name="copyrightName"
                value={form.copyrightName || ""}
                onChange={handleChange}
                placeholder="Rana Akmal"
              />
            </div>
          </div>
        )}

        {/* Save Footer Button */}
        <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary btn-save"
            style={{ padding: "12px 28px", fontSize: "15px" }}
          >
            {saving ? "Saving Changes..." : "Save All Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
