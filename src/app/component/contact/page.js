"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaPaperPlane,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./contact.css";

const DEFAULT_SETTINGS = {
  email: "84pakarmy@gmail.com",
  location: "Pakistan (Remote Worldwide)",
  responseTime: "Within 24 hours guaranteed",
  github: "https://github.com/AkmalDoghar",
  linkedin: "https://www.linkedin.com/in/muhammad-akmal-dev/",
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/muhammadakmal1225/",
  whatsapp: "https://wa.me/923017697832",
};

export default function Contact() {
  const [status, setStatus] = useState("");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useScrollReveal();

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name?.value?.trim() || "";
    const email = form.email?.value?.trim() || "";
    const message = form.message?.value?.trim() || "";

    if (!name) {
      toast.error("Please enter your name.");
      return;
    }
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    if (message.length < 10) {
      toast.error(
        "Please enter a message of at least 10 characters (current: " +
          message.length +
          ")."
      );
      return;
    }

    setStatus("submitting");

    const data = { name, email, message };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(
          result.message || "Message sent! I'll get back to you within 24 hours."
        );
        form.reset();
      } else {
        toast.error(result.error || "Failed to send message.");
      }
    } catch (err) {
      toast.error("Error sending message: " + (err.message || "Network error"));
    } finally {
      setStatus("");
    }
  };

  return (
    <section id="contact" className="contact">
      <ParticleMesh particleCount={35} />
      <div className="contact-container" data-reveal="fade-up">
        {/* Left Side: Info */}
        <div className="contact-info" data-reveal="fade-right" data-delay="0.1">
          <div className="main-text">
            <span>Let&apos;s build something together</span>
            <h2 className="font-accent">Get In Touch</h2>
          </div>

          <div className="contact-status-pill">
            <span className="pulse-dot"></span>
            <span>Available for Freelance &amp; Contract Work</span>
          </div>

          <p className="contact-availability">
            Have a product idea, full-stack application to build, or career
            opportunity? Drop a message below and I&apos;ll get back to you
            promptly.
          </p>

          <div className="info-items">
            <div className="info-item">
              <div className="info-icon">
                <FaEnvelope />
              </div>
              <div>
                <h4>Email Address</h4>
                <p>{settings.email}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h4>Location</h4>
                <p>{settings.location}</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FiClock />
              </div>
              <div>
                <h4>Response Time</h4>
                <p>{settings.responseTime}</p>
              </div>
            </div>
          </div>

          <div className="social-links">
            {settings.github && (
              <a
                href={settings.github}
                target="_blank"
                rel="noreferrer"
                title="GitHub Profile"
              >
                <FaGithub />
              </a>
            )}
            {settings.linkedin && (
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noreferrer"
                title="LinkedIn Profile"
              >
                <FaLinkedin />
              </a>
            )}
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer"
                title="Facebook Profile"
              >
                <FaFacebook />
              </a>
            )}
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                title="Instagram Profile"
              >
                <FaInstagram />
              </a>
            )}
            {settings.whatsapp && (
              <a
                href={settings.whatsapp}
                target="_blank"
                rel="noreferrer"
                title="WhatsApp"
              >
                <FaWhatsapp />
              </a>
            )}
          </div>
        </div>

        {/* Right Side: Form */}
        <div
          className="contact-form-wrapper"
          data-reveal="fade-left"
          data-delay="0.2"
        >
          <div className="form-header">
            <h3>Send Message</h3>
            <p>Direct communication form</p>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="botcheck"
              style={{ display: "none" }}
              tabIndex="-1"
              autoComplete="off"
            />
            <div className="input-group">
              <div className="input-field-wrap">
                <input
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  aria-label="Your Name"
                  required
                />
              </div>
              <div className="input-field-wrap">
                <input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  aria-label="Your Email"
                  required
                />
              </div>
            </div>

            <div className="input-field-wrap">
              <textarea
                name="message"
                cols="30"
                rows="5"
                placeholder="Tell me about your project, timelines, or opportunity..."
                aria-label="Message"
                required
              ></textarea>
            </div>

            <div className="formBtn">
              <button
                type="submit"
                className={`sending-btn ${
                  status === "submitting" ? "btn-submitting" : ""
                }`}
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <FaPaperPlane /> <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
