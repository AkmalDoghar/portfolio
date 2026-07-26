"use client";

import React, { useEffect, useState, useRef } from "react";
import "./MagicCursor.css";

export default function MagicCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const particlesRef = useRef([]);

  useEffect(() => {
    setMounted(true);
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
    
    if (!isTouch) {
      document.body.classList.add("hide-cursor");
    }

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setPosition({ x: clientX, y: clientY });

      // Create a new particle with physics
      const newParticle = {
        id: Math.random(),
        x: clientX,
        y: clientY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 2,
        life: 1,
      };

      particlesRef.current.push(newParticle);
      if (particlesRef.current.length > 40) {
        particlesRef.current.shift();
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("port-box") ||
        target.classList.contains("service-card") ||
        target.classList.contains("skill-box")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    // Physics Update Loop
    let animId;
    const updateParticles = () => {
      particlesRef.current = particlesRef.current
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 0.02,
        }))
        .filter((p) => p.life > 0);

      setParticles([...particlesRef.current]);
      animId = requestAnimationFrame(updateParticles);
    };
    animId = requestAnimationFrame(updateParticles);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animId);
      document.body.classList.remove("hide-cursor");
    };
  }, []);

  if (!mounted || isTouchDevice) return null;

  return (
    <div className="magic-cursor-container">
      {/* Main SVG Cursor with Border */}
      <svg
        className={`main-cursor ${isHovering ? "hovering" : ""} ${isClicking ? "clicking" : ""}`}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <path
          className="cursor-path"
          d="M 2 2 L 2 22 L 8 13 L 18 15 Z"
          strokeLinejoin="round"
        />
      </svg>

      {/* Magic Stardust Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="cursor-dot"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.life,
          }}
        />
      ))}
    </div>
  );
}
