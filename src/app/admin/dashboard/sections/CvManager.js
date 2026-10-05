"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import CvContentEditor from "./CvContentEditor";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`toast toast--${type}`}>{message}</div>;
}

export default function CvManager({ onUpdate }) {
  const [activeTab, setActiveTab] = useState("content"); // 'content' | 'upload'
  const [cvData, setCvData] = useState({ url: "", name: "", updatedAt: "" });
  const [displayName, setDisplayName] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchCv = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cv", { cache: "no-store" });
      const data = await res.json();
      if (data) {
        setCvData(data);
        setDisplayName(data.name || "");
        setManualUrl(data.url || "");
      }
    } catch {
      showToast("Failed to load CV status", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCv();
  }, [fetchCv]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (displayName.trim()) {
      formData.append("name", displayName.trim());
    }

    try {
      const res = await fetch("/api/admin/cv", {
        method: "PUT",
        body: formData,
      });
      const result = await res.json();

      if (res.ok && result.data) {
        setCvData(result.data);
        setManualUrl(result.data.url);
        setDisplayName(result.data.name);
        onUpdate?.();
        showToast("New CV uploaded and updated live on portfolio!");
      } else {
        showToast(result.error || "Failed to upload CV file", "error");
      }
    } catch (err) {
      showToast("Error uploading file: " + err.message, "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    if (!manualUrl.trim()) {
      showToast("Please provide a valid file path or URL", "error");
      return;
    }

    setUploading(true);
    const updatedPayload = {
      url: manualUrl.trim(),
      name: displayName.trim() || manualUrl.split("/").pop() || "Muhammad Akmal CV.pdf",
    };

    try {
      const res = await fetch("/api/admin/cv", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });
      const result = await res.json();

      if (res.ok && result.data) {
        setCvData(result.data);
        setDisplayName(result.data.name);
        setManualUrl(result.data.url);
        onUpdate?.();
        showToast("CV details updated successfully!");
      } else {
        showToast(result.error || "Failed to update CV details", "error");
      }
    } catch {
      showToast("Failed to update CV details", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleResetCv = async () => {
    if (!confirm("Reset CV to default portfolio document (M.Akmal CV.pdf)?")) return;

    setUploading(true);
    try {
      const res = await fetch("/api/admin/cv", { method: "DELETE" });
      const result = await res.json();

      if (res.ok && result.data) {
        setCvData(result.data);
        setDisplayName(result.data.name);
        setManualUrl(result.data.url);
        onUpdate?.();
        showToast("Reset to default CV document successfully!");
      } else {
        showToast("Failed to reset CV", "error");
      }
    } catch {
      showToast("Failed to reset CV", "error");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <span className="spin" /> Loading CV Management Center...
      </div>
    );
  }

  const hasCv = Boolean(cvData.url && cvData.url.trim());

  return (
    <div style={{ maxWidth: "950px" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="section-header">
        <div>
          <h2>Resume &amp; CV Management Center</h2>
          <p>Edit full text content online (Experience, Education, Skills, Bio) or upload custom PDF files</p>
        </div>
      </div>

      {/* Main Mode Toggle Buttons */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.75rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: "1rem",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("content")}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "12px",
            background: activeTab === "content" ? "linear-gradient(135deg, #12f7ff, #0099ff)" : "rgba(255, 255, 255, 0.05)",
            color: activeTab === "content" ? "#0b0f19" : "#cbd5e1",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontSize: "0.95rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: activeTab === "content" ? "0 4px 20px rgba(18, 247, 255, 0.3)" : "none",
          }}
        >
          📝 Interactive CV Content Builder
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "12px",
            background: activeTab === "upload" ? "linear-gradient(135deg, #12f7ff, #0099ff)" : "rgba(255, 255, 255, 0.05)",
            color: activeTab === "upload" ? "#0b0f19" : "#cbd5e1",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontSize: "0.95rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: activeTab === "upload" ? "0 4px 20px rgba(18, 247, 255, 0.3)" : "none",
          }}
        >
          📤 PDF Upload &amp; Link Manager
        </button>
      </div>

      {/* MODE 1: Interactive CV Content Builder */}
      {activeTab === "content" && <CvContentEditor onUpdate={onUpdate} />}

      {/* MODE 2: PDF Upload & Custom Link Manager */}
      {activeTab === "upload" && (
        <>
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />

          {/* Active CV Status Header Card */}
          <div
            style={{
              background: "rgba(18, 247, 255, 0.04)",
              border: "1px solid rgba(18, 247, 255, 0.25)",
              borderRadius: "16px",
              padding: "1.5rem",
              marginBottom: "1.75rem",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, rgba(18, 247, 255, 0.2), rgba(0, 168, 255, 0.1))",
                  border: "1px solid rgba(18, 247, 255, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                }}
              >
                📄
              </div>

              <div style={{ flex: 1, minWidth: "240px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h3 style={{ color: "#ffffff", fontSize: "1.15rem", margin: 0, fontWeight: 700 }}>
                    {cvData.name || "Muhammad Akmal CV.pdf"}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      background: hasCv ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                      color: hasCv ? "#34d399" : "#f87171",
                      border: `1px solid ${hasCv ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)"}`,
                      fontWeight: 600,
                    }}
                  >
                    {hasCv ? "Live Active" : "No Document"}
                  </span>
                </div>

                <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "6px 0 0 0", wordBreak: "break-all" }}>
                  <strong style={{ color: "#12f7ff" }}>Download Path:</strong> {cvData.url || "Not set"}
                </p>

                {cvData.updatedAt && (
                  <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px", display: "block" }}>
                    Last updated: {new Date(cvData.updatedAt).toLocaleString()}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn-add"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{ fontSize: "0.85rem", padding: "0.55rem 1.1rem" }}
                >
                  {uploading ? "Uploading..." : "📤 Upload PDF"}
                </button>

                {hasCv && (
                  <>
                    <button
                      type="button"
                      className="btn-edit"
                      onClick={() => setPreviewOpen(!previewOpen)}
                      style={{ fontSize: "0.85rem" }}
                    >
                      {previewOpen ? "🙈 Hide Preview" : "👁️ Live Preview"}
                    </button>
                    <a
                      href={cvData.url}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="btn-edit"
                      style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      ⬇️ Download
                    </a>
                  </>
                )}

                <button
                  type="button"
                  className="btn-delete"
                  onClick={handleResetCv}
                  disabled={uploading}
                  title="Reset to default M.Akmal CV.pdf"
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>

          {/* Embedded Live PDF Preview */}
          {previewOpen && hasCv && (
            <div
              style={{
                marginBottom: "1.75rem",
                background: "#0f172a",
                borderRadius: "16px",
                border: "1px solid rgba(18, 247, 255, 0.3)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "0.75rem 1.25rem",
                  background: "rgba(15, 23, 42, 0.9)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#12f7ff", fontSize: "0.85rem", fontWeight: 600 }}>
                  📄 Live Document Preview: {cvData.name}
                </span>
                <a
                  href={cvData.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#94a3b8", fontSize: "0.8rem", textDecoration: "underline" }}
                >
                  Open in full tab ↗
                </a>
              </div>
              <iframe
                src={cvData.url}
                title="CV Document Preview"
                style={{ width: "100%", height: "550px", border: "none" }}
              />
            </div>
          )}

          {/* Edit CV Form */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.025)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "1.5rem",
            }}
          >
            <h3 style={{ color: "#ffffff", fontSize: "1.05rem", marginBottom: "0.25rem", fontWeight: 600 }}>
              ✏️ Edit CV File Link &amp; Properties
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.84rem", marginBottom: "1.25rem" }}>
              Customize file display name, or paste a Google Drive, Dropbox, or custom hosted PDF link
            </p>

            <form onSubmit={handleSaveDetails}>
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label style={{ color: "#cbd5e1", fontSize: "0.85rem", marginBottom: "6px", display: "block" }}>
                  Document Display Name / File Title
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Muhammad Akmal - Full Stack Developer CV.pdf"
                  style={{ width: "100%" }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label style={{ color: "#cbd5e1", fontSize: "0.85rem", marginBottom: "6px", display: "block" }}>
                  File Path or External URL (PDF / DOCX)
                </label>
                <input
                  type="text"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="e.g. /M.Akmal CV.pdf or https://drive.google.com/..."
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="btn-add"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  📁 Choose Local PDF File
                </button>

                <button type="submit" className="btn-save" disabled={uploading}>
                  {uploading ? "Saving..." : "💾 Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
