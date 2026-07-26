"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { services } from "../servicesData";
import { FaDesktop, FaCode } from "react-icons/fa";
import { FaChartBar, FaBug } from "react-icons/fa6";
import "./services.css";

export default function ServiceDetail() {
  const params = useParams();
  const { id } = params;

  const service = services.find((s) => s.id === id);

  const icons = {
    FaDesktop: <FaDesktop />,
    FaCode: <FaCode />,
    FaChartBar: <FaChartBar />,
    FaBug: <FaBug />,
  };

  if (!service)
    return (
      <div className="service-detail-wrapper">
        <div className="service-detail-card">
          <p className="not-found">Service not found</p>
          <Link href="/services" className="back-btn">
            ← Back
          </Link>
        </div>
      </div>
    );

  return (
    <div className="service-detail-wrapper">
      <div className="service-detail-card">
        <div className="service-detail-icon">{icons[service.icon]}</div>
        <h1 className="service-detail-title">{service.title}</h1>
        <div className="service-detail-desc">
          {service.fullDesc.split("\n").map((line, idx) => (
            <p key={idx}>{line.trim()}</p>
          ))}
        </div>
        <Link href="/" className="back-btn">
           Back
        </Link>
      </div>
    </div>
  );
}
