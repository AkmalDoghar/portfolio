"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import "./login.css";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError("Please fill in both username and password.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Welcome back! Redirecting to Dashboard...", {
          style: {
            background: "#0d111d",
            color: "#0ff7e0",
            border: "1px solid rgba(15, 247, 224, 0.3)",
          },
        });
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 500);
      } else {
        const errorMsg = data.error || "Invalid username or password";
        setError(errorMsg);
        toast.error(errorMsg);
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      const networkErr = "Connection failed. Please check network.";
      setError(networkErr);
      toast.error(networkErr);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Dynamic Animated Canvas Background */}
      <div className="login-bg">
        <div className="login-orb login-orb--primary" />
        <div className="login-orb login-orb--secondary" />
        <div className="login-orb login-orb--accent" />
        <div className="login-grid-pattern" />
        <div className="login-ambient-light" />
      </div>

      {/* Top Bar Navigation */}
      <header className="login-top-bar">
        <Link href="/" className="login-back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Return to Portfolio</span>
        </Link>

        <div className="login-status-pill">
          <span className="status-dot" />
          <span>CMS Status: Active</span>
        </div>
      </header>

      {/* Main Glassmorphic Login Container */}
      <main className="login-content">
        <div className={`login-card ${shake ? "login-card--shake" : ""}`}>
          {/* Decorative Card Top Border Accent */}
          <div className="card-top-glow" />

          {/* Card Header & Brand */}
          <div className="login-brand">
            <div className="login-logo-scene">
              <div className="logo-ring-pulse" />
              <div className="login-logo-box">
                <img
                  src="/images/AK.png"
                  alt="Muhammad Akmal Logo"
                  className="login-logo-img"
                />
              </div>
            </div>

            <h1 className="login-title">
              Admin <span className="title-gradient">Portal</span>
            </h1>
            <p className="login-subtitle">
              Portfolio Content Management System
            </p>
          </div>

          {/* Secure SSL Shield Badge */}
          <div className="login-security-badge">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>256-Bit Encrypted Admin Control</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Username Input */}
            <div className="login-field">
              <label htmlFor="admin-username">Username or Identity</label>
              <div className="login-input-wrap">
                <div className="field-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <input
                  id="admin-username"
                  type="text"
                  placeholder="Enter admin username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="login-field">
              <div className="field-label-row">
                <label htmlFor="admin-password">Secure Password</label>
              </div>
              <div className="login-input-wrap">
                <div className="field-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M7 11V7a5 5 0 0 1 10 0v4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter account password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="pass-toggle-btn"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  title={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="1"
                        y1="1"
                        x2="23"
                        y2="23"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="login-options-row">
              <label className="remember-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="custom-checkmark">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <polyline
                      points="20 6 9 17 4 12"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>Keep me signed in</span>
              </label>
            </div>

            {/* Inline Error Alert */}
            {error && (
              <div className="login-error-alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="12"
                    y1="8"
                    x2="12"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="12"
                    y1="16"
                    x2="12.01"
                    y2="16"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading-content">
                  <span className="btn-spinner" />
                  <span>Authenticating...</span>
                </span>
              ) : (
                <span className="btn-normal-content">
                  <span>Sign In to Dashboard</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <line
                      x1="5"
                      y1="12"
                      x2="19"
                      y2="12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <polyline
                      points="12 5 19 12 12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </button>
          </form>

          {/* Card Footer Meta */}
          <footer className="login-card-footer">
            <p>© {new Date().getFullYear()} Muhammad Akmal · Portfolio CMS</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
