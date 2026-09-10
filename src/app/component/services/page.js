"use client";
import { useState, useEffect } from "react";
import { FaDesktop, FaCode, FaTimes, FaServer, FaMobileAlt } from "react-icons/fa";
import { FaChartBar, FaBug } from "react-icons/fa6";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import useScrollReveal from "../../hooks/useScrollReveal";
import ParticleMesh from "../ParticleMesh/ParticleMesh";
import { services as defaultServices } from "./servicesData";
import "./services.css";

const icons = {
  FaDesktop: <FaDesktop />,
  FaCode: <FaCode />,
  FaChartBar: <FaChartBar />,
  FaBug: <FaBug />,
  FaServer: <FaServer />,
  FaMobileAlt: <FaMobileAlt />,
};

const categoryBadges = {
  fullstack: "FULL-STACK & CLOUD",
  dashboard: "DASHBOARDS & ADMIN",
  api: "REST & MICROSERVICES",
  bugfix: "AUDIT & OPTIMIZATION",
};

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);
  const [servicesList, setServicesList] = useState(defaultServices);
  useScrollReveal();

  useEffect(() => {
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServicesList(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="services" className="services">
      <ParticleMesh particleCount={40} />
      <div className="main-text" data-reveal="fade-up" data-delay="0">
        <span>Tailored Software Solutions</span>
        <h2>What I Do</h2>
      </div>

      <div className="section-services">
        {servicesList.map((service, index) => (
          <div
            key={service.id || service.title}
            className="service-box"
            data-reveal="zoom-in"
            data-delay={String(0.08 * index)}
          >
            <div className="service-header-row">
              <span className="service-category-badge">
                {categoryBadges[service.id] || "DEVELOPMENT SERVICE"}
              </span>
              <div className="servise-icon">
                {icons[service.icon] || <FaCode />}
              </div>
            </div>

            <h3>{service.title}</h3>
            <p>{service.shortDesc}</p>

            <div className="service-action-row">
              <button
                onClick={() => setSelectedService(service)}
                className="service-learn-btn"
              >
                <span>Learn Details</span> <FiArrowRight />
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
              aria-label="Close Modal"
            >
              <FaTimes />
            </button>
            <div className="modal-icon">
              {icons[selectedService.icon] || <FaCode />}
            </div>
            <h2>{selectedService.title}</h2>

            <div className="modal-desc">
              {selectedService.fullDesc.split("\n").map((line, i) => (
                <p key={i}>
                  {line.trim() && (
                    <span className="modal-bullet-item">
                      <FiCheckCircle className="bullet-icon" /> {line.trim()}
                    </span>
                  )}
                </p>
              ))}
            </div>

            <div className="service-modal-actions">
              <button
                className="btn modal-btn"
                onClick={() => setSelectedService(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

