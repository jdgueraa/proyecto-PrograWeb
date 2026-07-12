import React from 'react';

function FeaturedOng({ ong, onNavigate }) {
  if (!ong) return null;
  const categoriaReal = ong.tags && ong.tags.length > 0 ? ong.tags[0] : "General";

  return (
    <div className="home-screen-featured-card">
      <div className="home-screen-featured-info">
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#238c62', textTransform: 'uppercase' }}>
          ⭐ Destacada de la semana
        </span>
        <h2 className="home-screen-featured-title">{ong.name}</h2>
        <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6', margin: '0 0 16px 0' }}>
          {ong.mision || `Ubicada en ${ong.location || 'Perú'}, esta organización destaca por su increíble labor social y su transparencia en la gestión de proyectos de ayuda comunitaria.`}
        </p>
        <div className="home-screen-featured-badges">
          <span className="home-screen-badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>{categoriaReal}</span>
          <span className="home-screen-badge" style={{ backgroundColor: '#eaf5f0', color: '#1a6b4a' }}>📍 {ong.location}</span>
        </div>
        <button onClick={onNavigate} className="home-screen-featured-btn">
          Conocer más
        </button>
      </div>
      <div className="home-screen-featured-aside">
        <span style={{ fontSize: '40px', display: 'block', marginBottom: '8px' }}>{ong.emoji || '🏢'}</span>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#1a6b4a' }}>{ong.name}</p>
      </div>
    </div>
  );
}

export default FeaturedOng