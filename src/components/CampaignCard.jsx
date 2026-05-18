// src/components/CampaignCard.jsx
import React from 'react';

export default function CampaignCard({ campaña, onAction }) {
  // 1. Calculamos el porcentaje matemático real 
  const calculoPorcentaje = campaña.meta > 0 
    ? Math.round((campaña.actual / campaña.meta) * 100) 
    : 0;

  // 2. Si pasa de 100%, lo fijamos en 100 
  const porcentajeFinal = calculoPorcentaje > 100 ? 100 : calculoPorcentaje;

  return (
    <div className="home-screen-campaign-card">
      <div>
        <div className="home-screen-campaign-meta">
          <span className="home-screen-campaign-badge">
            {campaña.category || "General"}
          </span>
          <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500' }}>
            📍 {campaña.location || "Perú"}
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
        
        {/* Contenedor gris de la barra */}
        <div 
          className="home-screen-progress-bar-bg" 
          style={{ width: '100%', backgroundColor: '#f3f4f6', borderRadius: '10px', height: '8px', overflow: 'hidden' }}
        >
          {/* Relleno verde de la barra */}
          <div 
            className="home-screen-progress-bar-fill" 
            style={{ 
              width: `${porcentajeFinal}%`,
              backgroundColor: '#1a6b4a', 
              height: '8px', 
              borderRadius: '10px',
              transition: 'width 0.5s ease'
            }}
          ></div>
        </div>
        
        <button onClick={onAction} className="home-screen-campaign-btn" style={{ marginTop: '16px' }}>
          Apoyar Campaña
        </button>
      </div>
    </div>
  );
}