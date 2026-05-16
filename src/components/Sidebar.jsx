import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { icon: "🏠", label: "Inicio",      path: "/home" },
    { icon: "🔍", label: "Buscar",      path: "/buscar" },
    { icon: "❤️", label: "Donaciones",  path: null },
    { icon: "🤝", label: "Voluntariado",path: null },
    { icon: "👤", label: "Mi perfil",   path: null },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">🌿</div>
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
          title={item.label}
          onClick={() => item.path && navigate(item.path)}
          style={{ cursor: item.path ? "pointer" : "default" }}
        >
          {item.icon}
        </div>
      ))}
    </nav>
  );
}