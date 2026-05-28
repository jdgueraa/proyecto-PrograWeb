// src/screens/HomeScreen.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ongs, campañas } from '../data.json';

import CampaignCard from '../components/CampaignCard';
import FeaturedOng from '../components/FeaturedOng';
import CampaignDetailModal from '../components/CampaignDetailModal';
import '../App.css';

export default function HomeScreen() {
  const navigate = useNavigate();
  const [selectedCampaña, setSelectedCampaña] = useState(null);

  const ongDestacada      = ongs.find(o => o.featured === true) || ongs[0];
  const campañasUrgentes  = campañas.filter(c => c.urgent === true);

  return (
    <div className="fade-in home-screen-wrapper">

      {/* 1. SECTION PRINCIPAL */}
      <div className="home-principal">
        <h1 className="home-screen-principal-title">Transforma realidades en el Perú</h1>
        <p className="home-screen-principal-subtitle">
          Apoya causas urgentes, encuentra voluntariados locales y conéctate con las organizaciones que están liderando el cambio en nuestro país.
        </p>
        <button onClick={() => navigate('/buscar')} className="home-screen-principal-btn">
          🔍 Ir al buscador de ONGs
        </button>
      </div>
      <br></br>

      {/* 2. IMPACTO EN CIFRAS */}
      <div className="home-screen-stats-grid">
        <div className="home-screen-stat-card">
          <span>🏢</span>
          <h3 className="home-screen-stat-number">{ongs.length}</h3>
          <p className="home-screen-stat-label">Organizaciones Aliadas</p>
        </div>
        <div className="home-screen-stat-card">
          <span>🌍</span>
          <h3 className="home-screen-stat-number">4</h3>
          <p className="home-screen-stat-label">Regiones Impactadas</p>
        </div>
        <div className="home-screen-stat-card">
          <span>🤝</span>
          <h3 className="home-screen-stat-number">{campañas.length}</h3>
          <p className="home-screen-stat-label">Campañas Activas</p>
        </div>
      </div>

      {/* 3. SECCIÓN: CAMPAÑAS URGENTES */}
      <div style={{ marginBottom: '40px' }}>
        <div className="home-screen-section-header">
          <h2 className="home-screen-section-title">🔥 Campañas Urgentes</h2>
          <span className="home-screen-section-tag">Necesitan apoyo esta semana</span>
        </div>

        <div className="home-screen-campaigns-grid">
          {campañasUrgentes.map(campaña => (
            <CampaignCard
              key={campaña.id}
              campaña={campaña}
              onCardClick={() => setSelectedCampaña(campaña)}
              onAction={() => navigate('/donaciones')}
            />
          ))}
        </div>
      </div>

      {/* 4. SECCIÓN: ONG DESTACADA DE LA SEMANA */}
      <FeaturedOng
        ong={ongDestacada}
        onNavigate={() => navigate(`/perfil/${ongDestacada?.id || 1}`)}
      />

      {selectedCampaña && (
        <CampaignDetailModal
          campaña={selectedCampaña}
          onClose={() => setSelectedCampaña(null)}
        />
      )}
    </div>
  );
}
