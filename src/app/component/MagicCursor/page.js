"use client";

import React, { useEffect, useRef } from "react";
import "./MagicCursor.css";

export default function MagicCursor() {
  const cursorRef = useRef(null);
  const canvasRef = useRef(null);
  const isHoveringRef = useRef(false);
  const particlesRef = useRef([]);
  const animIdRef = useRef(null);

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    document.body.classList.add("hide-cursor");

    const cursor = cursorRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Direct DOM positioning — NO setState, instant cursor response
    const onMouseMove = (e) => {
      if (cursor) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      }

      particlesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 3.5,
        vy: (Math.random() - 0.5) * 3.5,
        size: Math.random() * 3.5 + 1.5,
        life: 1,
      });

      if (particlesRef.current.length > 25) {
        particlesRef.current.shift();
      }
    };

    const onMouseDown = () => cursor?.classList.add("clicking");
    const onMouseUp = () => cursor?.classList.remove("clicking");

    const onMouseOver = (e) => {
      const t = e.target;
      const interactive = !!(
        t.tagName === "A" ||
        t.tagName === "BUTTON" ||
        t.closest("a") ||
        t.closest("button")
      );
      if (interactive !== isHoveringRef.current) {
        isHoveringRef.current = interactive;
        cursor?.classList.toggle("hovering", interactive);
      }
    };

    // passive:true = browser doesn't wait for JS before scroll
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", onMouseOver, { passive: true });

    // Canvas particle animation — runs fully outside React
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 0.045,
        }))
        .filter((p) => p.life > 0);

      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(18, 247, 255, ${p.life * 0.85})`;
        ctx.shadowColor = "rgba(18, 247, 255, 1)";
        ctx.shadowBlur = 12;
        ctx.fill();
      }

      animIdRef.current = requestAnimationFrame(tick);
    };
    animIdRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animIdRef.current);
      document.body.classList.remove("hide-cursor");
    };
  }, []);

  return (
    <>
      {/* Canvas for stardust particles — zero React re-renders */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2147483646, // Max z-index, above everything including navbar
        }}
      />

      {/* SVG cursor — direct DOM positioned, above everything */}
      <svg
        ref={cursorRef}
        className="main-cursor"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        style={{ left: "-100px", top: "-100px", zIndex: 2147483647 }}
      >
        <path
          className="cursor-path"
          d="M 2 2 L 2 22 L 8 13 L 18 15 Z"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}
