"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaFacebook, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./home.css";

export default function HomeSection() {
  const words = ["Full-Stack Developer", "Next.js Engineer", "MERN Stack Developer"];
  const [currentWord, setCurrentWord] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useScrollReveal();

  useEffect(() => {
    const current = words[wordIndex];
    let typingSpeed = isDeleting ? 80 : 120;

    const type = setTimeout(() => {
      if (!isDeleting && charIndex < current.length) {
        setCurrentWord(current.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setCurrentWord(current.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === current.length) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }, typingSpeed);

    return () => clearTimeout(type);
  }, [charIndex, isDeleting, wordIndex, words]);

  return (
    <section id="home" className="home">
      <ParticleMesh particleCount={45} />
      <div className="home-content">
        <h2 data-reveal="fade-up" data-delay="0">
          I Build Web Products That <span className="font-accent">Work</span> —
          Not Just Look Good
        </h2>

        <div className="change-text" data-reveal="fade-up" data-delay="0.1">
          <h3>
            And I&apos;m a{" "}
            <span className="typing font-accent">{currentWord}|</span>
          </h3>
        </div>

        <p data-reveal="fade-up" data-delay="0.2">
          I turn ideas into fast, real-world web apps — from pixel-perfect
          frontends to robust back-end APIs and admin dashboards. Currently
          available for internships and freelance projects.
        </p>

        <div className="info-box" data-reveal="fade-up" data-delay="0.25">
          <div className="email-info">
            <h5>Email :</h5>
            <span>84pakarmy@gmail.com</span>
          </div>
          <div className="behance-info">
            <h5>GitHub :</h5>
            <span>github.com/AkmalDoghar</span>
          </div>
        </div>

        <div
          className="box-btn home-btn-box"
          data-reveal="fade-up"
          data-delay="0.3"
        >
          <a href="/M.Akmal CV.pdf" download className="btn1">
            Download CV
          </a>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=84pakarmy@gmail.com"
            target="_blank"
            rel="noreferrer"
            className="btn2"
          >
            Hire Me
          </a>
        </div>

        <div className="social-icon" data-reveal="fade-up" data-delay="0.4">
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook />
          </a>
          <a
            href="https://github.com/AkmalDoghar"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/muhammad-akmal-dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://www.instagram.com/muhammadakmal1225/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
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
              src="/Akmal1.png"
              alt="Muhammad Akmal"
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
              <span className="badge-title">Full-Stack</span>
              <span className="badge-sub">Next.js & MERN</span>
            </div>
          </div>

          <div className="floating-badge badge-bottom-left">
            <div className="badge-icon-box">🚀</div>
            <div className="badge-text">
              <span className="badge-title">Web Apps</span>
              <span className="badge-sub">Fast & Scalable</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
