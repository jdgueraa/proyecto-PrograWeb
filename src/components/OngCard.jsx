// ─────────────────────────────────────────────────────────────
// OngCard.jsx  —  Tarjeta visual de una ONG
//
// USADO EN:  SearchScreen
//
// PROP QUE RECIBE:
//   • o  →  objeto ONG del JSON (name, emoji, color, banner,
//            location, desc, tags, seguidores, id)
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OngCard({ o }) {
  const navigate = useNavigate();

  return (
    <div className="ong-card">

      {/* Banda de color superior (usa el gradiente del banner) */}
      <div className="card-accent" style={{ background: o.banner }} />

      <div className="card-body">

        {/* Ícono con emoji de la ONG */}
        <div className="card-emoji-container" style={{ backgroundColor: o.color }}>
          <span className="card-emoji">{o.emoji}</span>
        </div>

        {/* Nombre y ubicación */}
        <h3 className="card-name">{o.name}</h3>
        <div className="card-location">📍 {o.location}</div>

        {/* Descripción breve */}
        <p className="card-desc">{o.desc}</p>

        {/* Etiquetas de categoría */}
        <div className="card-tags">
          {o.tags.map(t => (
            <span key={t} className="card-tag">{t}</span>
          ))}
        </div>

        {/* Pie: seguidores + botón para ir al perfil */}
        <div className="card-footer">
          <div className="card-stats">
            <strong>👥 {o.seguidores}</strong> seguidores
          </div>
          <button className="card-btn" onClick={() => navigate(`/perfil/${o.id}`)}>
            Ver Perfil ➔
          </button>
        </div>
      </div>
    </div>
  );
}
