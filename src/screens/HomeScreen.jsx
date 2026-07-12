// src/screens/HomeScreen.jsx
//
// TODO(backend): esta pantalla importa `ongs, campañas` fijos desde
// data.json (usados abajo en `ongDestacada` y `campañasUrgentes`). Como
// App.jsx no le pasa `campañas`/`ongs` como props a esta pantalla
// (mirar la <Route path="/home" ...> en App.jsx), hay dos formas de
// conectarla:
//   a) Más simple: que App.jsx le pase `campañas` como prop (ya la tiene
//      cargada) y aquí agregar `const [ongs, setOngs] = useState([]);`
//      con un `useEffect(() => { api.get('/ongs').then(setOngs); }, []);`
//      para la ONG destacada.
//   b) O bien, esta pantalla misma pide ambas cosas con `api.get('/campanas')`
//      y `api.get('/ongs')` en su propio useEffect, sin depender de App.jsx.
// El resto de la lógica (`.find(o => o.featured === true)`,
// `.filter(c => c.urgent === true)`) no cambia, ya funciona igual sobre
// cualquier arreglo real que venga del backend.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { api } from '../api';

import CampaignCard from '../components/CampaignCard';
import FeaturedOng from '../components/FeaturedOng';
import CampaignDetailModal from '../components/CampaignDetailModal';
import '../App.css';

export default function HomeScreen({ user, onDonate }) {
  const navigate = useNavigate();
  const [selectedCampaña, setSelectedCampaña] = useState(null);

  const [ongsList, setOngsList] = useState([]);
  const [campanasList, setCampanasList] = useState([]);

  async function handleLocalDonate(campañaId, amount) {
    await onDonate(campañaId, amount);

    setCampanasList(prevList => 
      prevList.map(c => {
        if (c.id === campañaId) {
          const nuevoMonto = c.actual + amount;
          const nuevoObjeto = { ...c, actual: nuevoMonto };
          if (selectedCampaña?.id === campañaId) {
            setSelectedCampaña(nuevoObjeto);
          }
          return nuevoObjeto;
        }
        return c;
      })
    );
  }

  useEffect(() => {
    api.get('/campanas')
      .then(setCampanasList)
      .catch(() => setCampanasList([]));

    api.get('/ongs')
      .then(setOngsList)
      .catch(() => setOngsList([]));
  }, []);

  const ongDestacada = ongsList.find(o => o.featured === true) || ongsList[0];
  const campañasUrgentes = campanasList.filter(c => c.urgent === true);
  const totalRegiones = [...new Set(ongsList.map(o => o.location).filter(Boolean))].length;

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
          <h3 className="home-screen-stat-number">{ongsList.length}</h3>
          <p className="home-screen-stat-label">Organizaciones Aliadas</p>
        </div>
        <div className="home-screen-stat-card">
          <span>🌍</span>
          <h3 className="home-screen-stat-number">{totalRegiones || 0}</h3>
          <p className="home-screen-stat-label">Regiones Impactadas</p>
        </div>
        <div className="home-screen-stat-card">
          <span>🤝</span>
          <h3 className="home-screen-stat-number">{campanasList.length}</h3>
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
              onAction={() => navigate(`/perfil/${campaña.ongId}`)}
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
          user={user}
          onDonate={handleLocalDonate}
          onClose={() => setSelectedCampaña(null)}
        />
      )}
    </div>
  );
}