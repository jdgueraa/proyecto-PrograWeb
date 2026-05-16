import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { campañas, ongs } from '../data'; 

export default function ProfileScreen() {
  const [seguido, setSeguido] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); 

  const ong = ongs.find(o => o.id === parseInt(id)) || ongs[0];

  return (
    <div className="fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}>⬅ Volver a buscar</button>
      
      <div className="profile-banner" style={{ background: ong.banner }}>
        <div className="profile-avatar-container" style={{ backgroundColor: ong.color }}>
          <span className="profile-avatar-emoji">{ong.emoji}</span>
        </div>
      </div>

      <div className="profile-container">
        <div className="profile-sidebar-info">
          <h2 className="profile-name">{ong.name}</h2>
          <div className="profile-location">📍 {ong.location}</div>
          <p className="profile-desc">{ong.desc}</p>
          
          <div className="profile-meta-box">
            <div className="meta-stat-item">
              <span className="meta-number">{ong.seguidores + (seguido ? 1 : 0)}</span>
              <span className="meta-label">Seguidores</span>
            </div>
            <div className="meta-stat-item">
              <span className="meta-number">{ong.campañas}</span>
              <span className="meta-label">Campañas</span>
            </div>
          </div>

          <button 
            className={`action-btn-primary ${seguido ? "btn-following" : ""}`}
            onClick={() => setSeguido(!seguido)}
          >
            {seguido ? "✓ Siguiendo" : "❤️ Seguir Organización"}
          </button>
        </div>

        <div className="profile-main-content">
          <h3 className="section-title">Campañas de recaudación activas</h3>
          <div className="campaigns-list">
            {campañas.map((c, idx) => {
              const pct = Math.min(100, Math.round((c.actual / c.meta) * 100));
              return (
                <div key={idx} className="campaign-card">
                  <div className="campaign-header">
                    <h4 className="campaign-name">{c.name}</h4>
                    <span className={`campaign-badge ${c.badgeClass}`}>{c.badge}</span>
                  </div>
                  <p className="campaign-desc">{c.desc}</p>
                  <div className="progress-container">
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                  <div className="campaign-footer">
                    <span>Meta: <strong>${c.meta.toLocaleString()}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}