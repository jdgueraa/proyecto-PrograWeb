import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ITEMS_PERSONA = [
  { icon: "🏠", label: "Inicio",       path: "/home" },
  { icon: "🔍", label: "Buscar",       path: "/buscar" },
  { icon: "❤️", label: "Donaciones",   path: "/donaciones" },
  { icon: "🤝", label: "Voluntariado", path: "/voluntariado" },
  { icon: "👤", label: "Mi perfil",    path: "/MiPerfil" },
];

const ITEMS_ONG = [
  { icon: "🛠️", label: "Panel ONG",   path: "/admin" },
  { icon: "👤", label: "Perfil ONG",  path: "/MiPerfil" },
];

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const esOng = user?.role === 'ong';
  const items = esOng ? ITEMS_ONG : ITEMS_PERSONA;

  return (
    <nav className="sidebar">
      <div
        className="sidebar-logo"
        onClick={() => navigate(esOng ? "/admin" : "/home")}
        style={{ cursor: 'pointer' }}
      >
        🌿
      </div>

      {items.map((item, idx) => (
        <div
          key={idx}
          className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          title={item.label}
          onClick={() => navigate(item.path)}
          style={{ cursor: 'pointer' }}
        >
          {item.icon}
        </div>
      ))}

      {onLogout && (
        <div
          className="sidebar-item"
          title="Cerrar sesión"
          onClick={() => {
            onLogout();
            navigate('/login');
          }}
          style={{ cursor: 'pointer', marginTop: 'auto' }}
        >
          🚪
        </div>
      )}
    </nav>
  );
}