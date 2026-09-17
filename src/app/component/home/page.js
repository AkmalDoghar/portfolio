"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaFacebook, FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./home.css";

const DEFAULT_SETTINGS = {
  name: "Muhammad Akmal",
  email: "84pakarmy@gmail.com",
  github: "https://github.com/AkmalDoghar",
  linkedin: "https://www.linkedin.com/in/muhammad-akmal-dev/",
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/muhammadakmal1225/",
  whatsapp: "https://wa.me/923017697832",
  heroTitle: "Full-Stack Next.js Developer Building Fast, Production-Ready Web Apps",
  typingWords: [
    "Full-Stack JavaScript Developer",
    "Next.js & React Engineer",
    "Node.js & MongoDB Specialist",
  ],
  heroDescription:
    "I build fast, production-ready web apps — from responsive frontends to robust back-end APIs and admin dashboards. Currently available for freelance projects and full-time developer roles.",
  heroImage: "/Akmal1.png",
  badge1Title: "Full-Stack JS",
  badge1Sub: "Next.js • React • Node • Mongo",
  badge2Title: "Web Apps",
  badge2Sub: "Fast & Scalable",
};

export default function HomeSection() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [words, setWords] = useState(DEFAULT_SETTINGS.typingWords);
  const [currentWord, setCurrentWord] = useState(DEFAULT_SETTINGS.typingWords[0] || "");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [cvUrl, setCvUrl] = useState("/M.Akmal CV.pdf");

  useScrollReveal();

  useEffect(() => {
    fetch("/api/admin/cv", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.url) setCvUrl(data.url);
      })
      .catch(() => {});

    fetch("/api/admin/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setSettings((prev) => ({ ...prev, ...data }));
          if (Array.isArray(data.typingWords) && data.typingWords.length > 0) {
            setWords(data.typingWords);
            setCurrentWord(data.typingWords[0]);
            setCharIndex(data.typingWords[0].length);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      setHasStarted(true);
    }, 1500);
    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if (!hasStarted || words.length === 0) return;

    const current = words[wordIndex % words.length] || "";
    let typingSpeed = isDeleting ? 80 : 120;

    const type = setTimeout(() => {
      if (!isDeleting && charIndex < current.length) {
        setCurrentWord(current.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setCurrentWord(current.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === current.length) {
        setTimeout(() => setIsDeleting(true), 1200);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }, typingSpeed);

    return () => clearTimeout(type);
  }, [charIndex, isDeleting, wordIndex, words, hasStarted]);

  // Clean display github link
  const githubDisplay = settings.github
    ? settings.github.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "github.com/AkmalDoghar";

  return (
    <section id="home" className="home">
      <ParticleMesh particleCount={45} />
      <div className="home-content">
        <h2 data-reveal="fade-up" data-delay="0">
          {settings.heroTitle}
        </h2>

        <div className="change-text" data-reveal="fade-up" data-delay="0.1">
          <h3>
            And I&apos;m a{" "}
            <span className="typing font-accent">{currentWord}|</span>
          </h3>
        </div>

        <p data-reveal="fade-up" data-delay="0.2">
          {settings.heroDescription}
        </p>

        <div className="info-box" data-reveal="fade-up" data-delay="0.25">
          <div className="email-info">
            <h5>Email :</h5>
            <span>{settings.email}</span>
          </div>
          <div className="behance-info">
            <h5>GitHub :</h5>
            <span>{githubDisplay}</span>
          </div>
        </div>

        <div
          className="box-btn home-btn-box"
          data-reveal="fade-up"
          data-delay="0.3"
        >
          <a
            href={cvUrl || "#"}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="btn1"
          >
            Download CV
          </a>
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
              settings.email
            )}`}
            target="_blank"
            rel="noreferrer"
            className="btn2"
          >
            Hire Me
          </a>
        </div>

        <div className="social-icon" data-reveal="fade-up" data-delay="0.4">
          {settings.facebook && (
            <a
              href={settings.facebook}
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
            >
              <FaFacebook />
            </a>
          )}
          {settings.github && (
            <a
              href={settings.github}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
            >
              <FaGithub />
            </a>
          )}
          {settings.linkedin && (
            <a
              href={settings.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
            >
              <FaLinkedin />
            </a>
          )}
          {settings.instagram && (
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
            >
              <FaInstagram />
            </a>
          )}
          {settings.whatsapp && (
            <a
              href={settings.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp"
            >
              <FaWhatsapp />
            </a>
          )}
        </div>
      </div>

      <div className="home-image" data-reveal="fade-left" data-delay="0.15">
        <div className="hero-image-wrapper">
          {/* Ambient Glow & Accent Backdrop */}
          <div className="hero-glow-backdrop"></div>
          <div className="hero-ring-accent"></div>
          <div className="hero-ring-accent-2"></div>
          <div className="hero-dots-accent"></div>

          {/* Main Cutout Image */}
          <div className="hero-img-container">
            <Image
              src={settings.heroImage || "/Akmal1.png"}
              alt={settings.name || "Muhammad Akmal"}
              width={600}
              height={850}
              priority
              className="hero-cutout-img"
            />
          </div>

          {/* Floating Badges */}
          <div className="floating-badge badge-top-right">
            <div className="badge-icon-box">⚡</div>
            <div className="badge-text">
              <span className="badge-title">{settings.badge1Title}</span>
              <span className="badge-sub">{settings.badge1Sub}</span>
            </div>
          </div>

          <div className="floating-badge badge-bottom-left">
            <div className="badge-icon-box">🚀</div>
            <div className="badge-text">
              <span className="badge-title">{settings.badge2Title}</span>
              <span className="badge-sub">{settings.badge2Sub}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
