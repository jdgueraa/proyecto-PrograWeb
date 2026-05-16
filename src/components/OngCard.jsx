import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OngCard({ o }) {
  const navigate = useNavigate();

  return (
    <div className="ong-card">
      <div className="card-accent" style={{ background: o.banner }}></div>
      <div className="card-body">
        <div className="card-emoji-container" style={{ backgroundColor: o.color }}>
          <span className="card-emoji">{o.emoji}</span>
        </div>
        <h3 className="card-name">{o.name}</h3>
        <div className="card-location">📍 {o.location}</div>
        <p className="card-desc">{o.desc}</p>
        
        <div className="card-tags">
          {o.tags.map(t => <span key={t} className="card-tag">{t}</span>)}
        </div>

        <div className="card-footer">
          <div className="card-stats"><strong>👥 {o.seguidores}</strong> seguidores</div>
          <button className="card-btn" onClick={() => navigate(`/perfil/${o.id}`)}>
            Ver Perfil ➔
          </button>
        </div>
      </div>
    </div>
  );
}