"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./contact.css";

export default function Contact() {
  const [status, setStatus] = useState("");

  useScrollReveal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      address: form.address.value,
      phone: form.phone.value,
      message: form.message.value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Message sent! I'll get back to you within 24 hours.");
        form.reset();
      } else {
        toast.error("Failed to send: " + result.error);
      }
    } catch (err) {
      toast.error("Error sending message: " + err.message);
    } finally {
      setStatus("");
    }
  };

  return (
    <section id="contact" className="contact">
      <ParticleMesh particleCount={40} />
      <div className="contact-container" data-reveal="fade-up">
        {/* Left Side: Info */}
        <div className="contact-info" data-reveal="fade-right" data-delay="0.1">
          <div className="main-text">
            <span>Let&apos;s work together</span>
            <h2 className="font-accent">Contact Me</h2>
          </div>
          <p className="contact-availability">
            Currently open to internships and freelance projects. If you have a
            project in mind or want to discuss an opportunity, let&apos;s talk.
          </p>

          <div className="info-items">
            <div className="info-item">
              <div className="info-icon">
                <FaEnvelope />
              </div>
              <div>
                <h4>Email</h4>
                <p>84pakarmy@gmail.com</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h4>Location</h4>
                <p>Pakistan (Remote Available)</p>
              </div>
            </div>
          </div>

          <div className="social-links">
            <a
              href="https://github.com/AkmalDoghar"
              target="_blank"
              rel="noreferrer"
              title="GitHub Profile"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/muhammad-akmal-dev/"
              target="_blank"
              rel="noreferrer"
              title="LinkedIn Profile"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              title="Facebook Profile"
            >
              <FaFacebook />
            </a>
          </div>
        </div>

        {/* Right Side: Form */}
        <div
          className="contact-form-wrapper"
          data-reveal="fade-left"
          data-delay="0.2"
        >
          <form onSubmit={handleSubmit}>
            {/* Honeypot field for bot protection */}
            <input
              type="text"
              name="botcheck"
              style={{ display: "none" }}
              tabIndex="-1"
              autoComplete="off"
            />
            <div className="input-group">
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                aria-label="Your Name"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Your Email"
                aria-label="Your Email"
                required
              />
            </div>
            <textarea
              name="message"
              cols="30"
              rows="6"
              placeholder="How can I help? (Tell me about your project or opportunity...)"
              aria-label="Message"
              required
            ></textarea>

            <div className="formBtn">
              <button
                type="submit"
                className={`sending-btn ${status === "submitting" ? "btn-submitting" : ""}`}
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Sending Message..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
