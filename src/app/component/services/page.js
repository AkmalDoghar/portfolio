"use client";
import { useState } from "react";
import { services } from "./servicesData";
import { FaDesktop, FaCode, FaTimes } from "react-icons/fa";
import { FaChartBar, FaBug } from "react-icons/fa6";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import "./services.css";

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);
  useScrollReveal();

  const icons = {
    FaDesktop: <FaDesktop />,
    FaCode: <FaCode />,
    FaChartBar: <FaChartBar />,
    FaBug: <FaBug />,
  };

  return (
    <section id="services" className="services">
      <ParticleMesh particleCount={40} />
      <div className="main-text" data-reveal="fade-up" data-delay="0">
        <span>What I can do for you</span>
        <h2>What I Do</h2>
      </div>

      <div className="section-services">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="service-box"
            data-reveal="zoom-in"
            data-delay={String(0.08 * index)}
          >
            <div className="servise-icon">{icons[service.icon]}</div>
            <h3>{service.title}</h3>
            <p>{service.shortDesc}</p>
            <div className="btn-box service-btn">
              <button
                onClick={() => setSelectedService(service)}
                className="btn"
              >
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Modal */}
      {selectedService && (
        <div
          className="service-modal-overlay"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="service-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedService(null)}
            >
              <FaTimes />
            </button>
            <div className="modal-icon">{icons[selectedService.icon]}</div>
            <h2>{selectedService.title}</h2>
            <div className="modal-desc">
              {selectedService.fullDesc.split("\n").map((line, i) => (
                <p key={i}>{line.trim()}</p>
              ))}
            </div>

            {/* <button className="btn" onClick={() => setSelectedService(null)}>
              Close
            </button> */}
          </div>
        </div>
      )}
    </section>
  );
}
