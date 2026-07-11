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

import CampaignCard from '../components/CampaignCard';
import FeaturedOng from '../components/FeaturedOng'
import CampaignDetailModal from '../components/CampaignDetailModal';
import '../App.css';

export default function HomeScreen({ user, onDonate }) {
  const navigate = useNavigate();
  const [campanasList, setCampanasList] = useState([]);
  const [ongsList, setOngsList] = useState([]);
  const [selectedCampaña, setSelectedCampaña] = useState(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatosBackend = async () => {
      try {
        const [resCampanas, resOngs] = await Promise.all([
          fetch('http://localhost:3000/api/campanas'),
          fetch('http://localhost:3000/api/ongs')
        ]);

        const campanasData = await resCampanas.json();
        const ongsData = await resOngs.json();

        // Actualizamos los estados con la data real
        setCampanasList(campanasData);
        setOngsList(ongsData);
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosBackend();
  }, []);

  if (!user) {
        return <Navigate to="/login" replace />;
    }

  const campañasUrgentes = campanasList.filter(c => c.urgent === true);
  const ongDestacada = ongsList.find(o => o.featured === true);
  const totalCampanas = campanasList.length;
  const totalOngs = ongsList.length;

  const handleDonarEnHome = (id, monto) => {
    onDonate(id, monto);
    // Actualiza la campaña seleccionada
    setCampanasList(prevLista =>
      prevLista.map(c =>
        c.id === id
          ? { ...c, actual: c.actual + monto, donantes: (c.donantes || 0) + 1 }
          : c
      )
    );

    setSelectedCampaña(prev => ({
      ...prev,
      actual: prev.actual + monto,
      donantes: (prev.donantes || 0) + 1
    }));
  };

  if (loading) {
    return (
      <div className="fade-in home-screen-wrapper" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>Cargando información... ⏳</h2>
      </div>
    );
  }

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
          <h3 className="home-screen-stat-number">{totalOngs}</h3>
          <p className="home-screen-stat-label">Organizaciones Aliadas</p>
        </div>
        <div className="home-screen-stat-card">
          <span>🌍</span>
          <h3 className="home-screen-stat-number">4</h3>
          <p className="home-screen-stat-label">Regiones Impactadas</p>
        </div>
        <div className="home-screen-stat-card">
          <span>🤝</span>
          <h3 className="home-screen-stat-number">{totalCampanas}</h3>
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
      {ongDestacada && (
        <FeaturedOng
          ong={ongDestacada}
          onNavigate={() => navigate(`/perfil/${ongDestacada.id}`)}
        />
      )}

      {selectedCampaña && (
        <CampaignDetailModal
          campaña={selectedCampaña}
          user={user}
          onDonate={handleDonarEnHome}
          onClose={() => setSelectedCampaña(null)}
        />
      )}
    </div>
  );
}
