"use client";
import { useState, useEffect, useCallback, useRef } from "react";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`toast toast--${type}`}>{message}</div>;
}

export default function CvManager({ onUpdate }) {
  const [cvData, setCvData] = useState({ url: "", name: "", updatedAt: "" });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
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

    try {
      const res = await fetch("/api/admin/cv", {
        method: "PUT",
        body: formData,
      });
      const result = await res.json();

      if (res.ok && result.data) {
        setCvData(result.data);
        setManualUrl(result.data.url);
        onUpdate?.();
        showToast("New CV uploaded and updated live!");
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

  const handleManualUrlSave = async (e) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;

    setUploading(true);
    const filename = manualUrl.split("/").pop() || "Custom CV";
    const updated = {
      url: manualUrl.trim(),
      name: filename,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/admin/cv", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const result = await res.json();

      if (res.ok) {
        setCvData(updated);
        onUpdate?.();
        showToast("CV URL updated successfully!");
      } else {
        showToast(result.error || "Failed to update CV URL", "error");
      }
    } catch {
      showToast("Failed to update CV URL", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCv = async () => {
    if (!confirm("Are you sure you want to remove the current CV?")) return;

    setUploading(true);
    try {
      const res = await fetch("/api/admin/cv", { method: "DELETE" });
      const result = await res.json();

      if (res.ok && result.data) {
        setCvData(result.data);
        setManualUrl("");
        onUpdate?.();
        showToast("CV link removed successfully!");
      } else {
        showToast("Failed to remove CV", "error");
      }
    } catch {
      showToast("Failed to remove CV", "error");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <span className="spin" /> Loading CV Manager...
      </div>
    );
  }

  const hasCv = Boolean(cvData.url && cvData.url.trim());

  return (
    <div style={{ maxWidth: "800px" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="section-header">
        <div>
          <h2>Resume &amp; CV Manager</h2>
          <p>Upload, replace, or update your portfolio downloadable CV file</p>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.doc,.docx"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      {/* Active CV Status Card */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(18, 247, 255, 0.2)",
          borderRadius: "16px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "rgba(18, 247, 255, 0.1)",
              border: "1px solid rgba(18, 247, 255, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
              color: "#12f7ff",
            }}
          >
            📄
          </div>

          <div style={{ flex: 1, minWidth: "220px" }}>
            <h3 style={{ color: "#ffffff", fontSize: "1.1rem", margin: "0 0 4px 0", fontWeight: 700 }}>
              {hasCv ? cvData.name || "Active CV File" : "No CV Uploaded"}
            </h3>
            <p style={{ color: "#a0aec0", fontSize: "0.85rem", margin: 0 }}>
              {hasCv ? (
                <>
                  <span style={{ color: "#12f7ff", fontWeight: 600 }}>Active File Path:</span> {cvData.url}
                </>
              ) : (
                "Please upload a PDF / DOCX file below"
              )}
            </p>
            {cvData.updatedAt && (
              <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px", display: "block" }}>
                Last updated: {new Date(cvData.updatedAt).toLocaleString()}
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {hasCv && (
              <a
                href={cvData.url}
                target="_blank"
                rel="noreferrer"
                className="btn-edit"
                style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                👁️ Preview / Download
              </a>
            )}
            <button
              type="button"
              className="btn-add"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
            >
              {uploading ? "Uploading..." : hasCv ? "🔄 Replace CV" : "📤 Upload New CV"}
            </button>
            {hasCv && (
              <button
                type="button"
                className="btn-delete"
                onClick={handleDeleteCv}
                disabled={uploading}
              >
                🗑️ Delete CV
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Manual URL Link Fallback Form */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "14px",
          padding: "1.25rem",
        }}
      >
        <h4 style={{ color: "#ffffff", fontSize: "0.95rem", marginBottom: "0.5rem" }}>
          🔗 Or Set External CV Document Link
        </h4>
        <p style={{ color: "#94a3b8", fontSize: "0.82rem", marginBottom: "1rem" }}>
          You can also paste a direct Google Drive, Dropbox, or custom hosted PDF link instead of uploading a file.
        </p>

        <form onSubmit={handleManualUrlSave} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <div className="form-group" style={{ flex: 1, minWidth: "260px", marginBottom: 0 }}>
            <input
              type="text"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="e.g. /M.Akmal CV.pdf or https://drive.google.com/..."
              style={{ width: "100%" }}
            />
          </div>
          <button type="submit" className="btn-save" disabled={uploading || !manualUrl.trim()}>
            {uploading ? "Saving..." : "Save Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
