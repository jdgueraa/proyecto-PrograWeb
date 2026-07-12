import React from 'react';

export default function CampaignCard({ campaña, onAction, onCardClick }) {
  const montoActual = Number(campaña.actual || 0);
  const montoMeta = Number(campaña.meta || 0);
  
  const calculoPorcentaje = campaña.meta > 0
    ? Math.round((campaña.actual / campaña.meta) * 100)
    : 0;
  const porcentajeFinal = Math.min(calculoPorcentaje, 100);

  return (
    <div
      className={`home-screen-campaign-card card-clickable`}
      onClick={onCardClick}
    >
      <div>
        <div className="home-screen-campaign-meta">
          <span className="home-screen-campaign-badge">
            {campaña.category || 'General'}
          </span>
          <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500' }}>
            📍 {campaña.location || 'Perú'}
          </span>
        </div>

        <h3 style={{ margin: '12px 0 8px 0', fontSize: '18px', color: '#0f2d1f', fontWeight: 'bold' }}>
          {campaña.name}
        </h3>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px 0', lineHeight: '1.5' }}>
          {campaña.desc}
        </p>
      </div>

      <div className="home-screen-progress-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
          <span style={{ color: '#6b7280' }}>
            {campaña.actual?.toLocaleString()} de {campaña.meta?.toLocaleString()}
          </span>
          <span style={{ color: '#1a6b4a' }}>
            {porcentajeFinal}%
          </span>
        </div>

        <div className="home-screen-progress-bar-bg">
          <div
            className="home-screen-progress-bar-fill"
            style={{
              width: `${porcentajeFinal}%`,
              transition: 'width 0.5s ease',
            }}
          />
        </div>

        <button
          onClick={e => { e.stopPropagation(); onAction && onAction(); }}
          className="home-screen-campaign-btn"
          style={{ marginTop: '16px' }}
        >
          Apoyar Campaña
        </button>
      </div>
    </div>
  );
}
