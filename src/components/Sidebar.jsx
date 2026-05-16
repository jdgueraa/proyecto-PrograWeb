import React from 'react';

export default function Sidebar() {
  const items = [
    { icon: "🏠", label: "Inicio" },
    { icon: "🔍", label: "Buscar" },
    { icon: "❤️", label: "Donaciones" },
    { icon: "🤝", label: "Voluntariado" },
    { icon: "👤", label: "Mi perfil" },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">🌿</div>
      {items.map((i, idx) => (
        <div key={idx} className={`sidebar-item ${i.label === "Buscar" ? "active" : ""}`} title={i.label}>
          {i.icon}
        </div>
      ))}
    </nav>
  );
}