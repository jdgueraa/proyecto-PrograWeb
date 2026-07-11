// CONECTADO AL BACKEND:
// Esta pantalla es el perfil público de una ONG (se abre cuando haces
// clic en "Ver Perfil" desde Buscar, o en el nombre de la ONG desde una
// tarjeta de Donaciones/Voluntariado).
//
// Antes buscaba la ONG y sus campañas/voluntariados en el archivo fijo
// data.json. Ahora:
//   - La ONG puntual se pide al backend con su id (GET /api/ongs/:id).
//   - Las campañas y voluntariados de esa ONG llegan como props desde
//     App.jsx (que ya los trae del backend), y aquí solo se filtran por
//     ongId, igual que antes.
//   - El botón de "Seguir" ya no guarda nada dentro del usuario a mano:
//     llama al endpoint POST /api/ongs/:id/follow, que es el que de
//     verdad guarda el seguimiento en la base de datos.
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import CampaignDetailModal from '../components/CampaignDetailModal';
import VoluntariadoDetailModal from '../components/VoluntariadoDetailModal';

const MODALIDAD_ICON = { Presencial: '📍', Virtual: '💻', Híbrido: '🔄' };

export default function ProfileScreen({ user, campañas = [], voluntariados = [], onFollowChange }) {
  const [activeTab, setActiveTab]               = useState('campañas');
  const [selectedCampaña, setSelectedCampaña]   = useState(null);
  const [selectedVol, setSelectedVol]           = useState(null);
  const navigate  = useNavigate();
  const { id }    = useParams();

  // Aquí guardamos la ONG que nos responda el backend. Arranca en
  // null porque todavía no hemos recibido la respuesta.
  const [ong, setOng] = useState(null);

  // Le pedimos al backend los datos de esta ONG en particular. El "id"
  // va dentro de la lista de dependencias ([id]) para que, si el
  // usuario navega de un perfil de ONG a otro, se vuelva a pedir.
  useEffect(() => {
    api.get('/ongs/' + id).then(function (respuesta) {
      setOng(respuesta);
    });
  }, [id]);

  // Mientras todavía no llega la respuesta del backend, mostramos un
  // mensaje simple en vez de intentar leer datos que no existen aún.
  if (!ong) {
    return <div className="fade-in">Cargando perfil de la ONG...</div>;
  }

  const ongCampañas      = campañas.filter(c => c.ongId === ong.id);
  const ongVoluntariados = voluntariados.filter(v => v.ongId === ong.id);

  // Verifica si el usuario ya sigue esta ONG. Antes este dato vivía en
  // "user.ongsSeguidasIds" (solo ids). Ahora GET /api/me manda
  // "user.ongsSeguidas", con las ONGs completas que sigue el usuario.
  const seguido = (user?.ongsSeguidas || []).some(o => o.id === ong.id);

  // Avisa al backend que el usuario quiere seguir o dejar de seguir
  // esta ONG. Es "async" porque espera la respuesta del servidor antes
  // de actualizar la pantalla.
  async function toggleSeguir() {
    if (!user) return;

    try {
      // Esto guarda el cambio de verdad en la base de datos
      await api.post('/ongs/' + ong.id + '/follow');

      // Volvemos a pedir la ONG (para que el contador de seguidores
      // se actualice) y avisamos a App.jsx que refresque al usuario
      // (para que "seguido" quede bien la próxima vez que se calcule).
      const ongActualizada = await api.get('/ongs/' + ong.id);
      setOng(ongActualizada);
      if (onFollowChange) {
        onFollowChange();
      }
    } catch (error) {
      console.log('No se pudo actualizar el seguimiento', error);
    }
  }

  return (
    <div className="fade-in ong-prof-wrapper">

      <button className="back-btn" onClick={() => navigate(-1)}>⬅ Volver</button>

      {/* ── Banner ── */}
      <div
        className="ong-prof-banner"
        style={
          ong.fotoPortada
            ? { backgroundImage: `url(${ong.fotoPortada})` }
            : { background: ong.banner }
        }
      >
        <div className="ong-prof-avatar" style={{ backgroundColor: ong.color }}>
          <span className="ong-prof-avatar-emoji">{ong.emoji}</span>
        </div>
      </div>

      {/* ── Header: nombre + seguir ── */}
      <div className="ong-prof-header">
        <div>
          <h1 className="ong-prof-name">{ong.name}</h1>
          <div className="ong-prof-meta">
            <span>📍 {ong.location}</span>
            {ong.añoFundacion && <span>· Desde {ong.añoFundacion}</span>}
          </div>
          <div className="ong-prof-tags">
            {ong.tags.map(t => <span key={t} className="card-tag">{t}</span>)}
          </div>
        </div>
        <button
          className={`action-btn-primary ong-prof-follow-btn ${seguido ? 'btn-following' : ''}`}
          onClick={toggleSeguir}
        >
          {seguido ? '✓ Siguiendo' : '❤️ Seguir'}
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="ong-prof-stats">
        <div className="ong-prof-stat">
          {/* El contador de seguidores ya viene correcto desde el
              backend (ya no hace falta sumarle +1 a mano). */}
          <span className="ong-prof-stat-num">{ong.seguidores.toLocaleString()}</span>
          <span className="ong-prof-stat-label">Seguidores</span>
        </div>
        <div className="ong-prof-stat-divider" />
        <div className="ong-prof-stat">
          <span className="ong-prof-stat-num">{ongCampañas.length}</span>
          <span className="ong-prof-stat-label">Campañas</span>
        </div>
        <div className="ong-prof-stat-divider" />
        <div className="ong-prof-stat">
          <span className="ong-prof-stat-num">{ongVoluntariados.length}</span>
          <span className="ong-prof-stat-label">Voluntariados</span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="dashboard-tabs ong-prof-tabs">
        <button
          className={`tab-btn ${activeTab === 'campañas' ? 'active' : ''}`}
          onClick={() => setActiveTab('campañas')}
        >
          📢 Campañas ({ongCampañas.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'voluntariados' ? 'active' : ''}`}
          onClick={() => setActiveTab('voluntariados')}
        >
          🤝 Voluntariados ({ongVoluntariados.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'sobre' ? 'active' : ''}`}
          onClick={() => setActiveTab('sobre')}
        >
          ℹ️ Sobre nosotros
        </button>
      </div>

      {/* ── Tab: Campañas ── */}
      {activeTab === 'campañas' && (
        ongCampañas.length === 0 ? (
          <div className="ong-prof-empty">
            <p>Esta organización aún no tiene campañas registradas.</p>
          </div>
        ) : (
          <div className="ong-prof-grid">
            {ongCampañas.map(c => {
              const pct     = Math.min(100, Math.round((c.actual / c.meta) * 100));
              const lograda = c.badge === '¡Lograda!';
              return (
                <div
                  key={c.id}
                  className={`ong-prof-card card-clickable ${lograda ? 'ong-prof-card--done' : ''}`}
                  onClick={() => setSelectedCampaña(c)}
                >
                  <div className="ong-prof-card-top">
                    <span className={`campaign-badge ${c.badgeClass}`}>{c.badge}</span>
                    {c.urgent && <span className="donations-urgent-tag">🔥 Urgente</span>}
                    <span className="donations-card-category" style={{ marginLeft: 'auto' }}>{c.category}</span>
                  </div>
                  <h3 className="ong-prof-card-name">{c.name}</h3>
                  <p className="ong-prof-card-desc">{c.desc}</p>
                  <div className="donations-progress-bar-bg" style={{ margin: '8px 0 4px' }}>
                    <div
                      className="donations-progress-bar-fill"
                      style={{ width: `${pct}%`, backgroundColor: lograda ? 'var(--green-light)' : 'var(--green-mid)' }}
                    />
                  </div>
                  <div className="ong-prof-card-footer">
                    <span style={{ color: 'var(--text-mid)', fontSize: '12px' }}>
                      S/. {c.actual.toLocaleString()} de S/. {c.meta.toLocaleString()}
                    </span>
                    <span className="donations-pct">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* ── Tab: Voluntariados ── */}
      {activeTab === 'voluntariados' && (
        ongVoluntariados.length === 0 ? (
          <div className="ong-prof-empty">
            <p>Esta organización aún no tiene voluntariados registrados.</p>
          </div>
        ) : (
          <div className="ong-prof-grid">
            {ongVoluntariados.map(v => {
              const cuposLibres = v.cupos - v.cuposOcupados;
              const lleno       = v.badge === 'Lleno' || cuposLibres <= 0;
              return (
                <div
                  key={v.id}
                  className={`ong-prof-card card-clickable ${lleno ? 'ong-prof-card--done' : ''}`}
                  onClick={() => setSelectedVol(v)}
                >
                  <div className="ong-prof-card-top">
                    <span className={`campaign-badge ${v.badgeClass}`}>{v.badge}</span>
                    <span className="vol-modalidad-tag">{MODALIDAD_ICON[v.modalidad]} {v.modalidad}</span>
                    <span className="donations-card-category" style={{ marginLeft: 'auto' }}>{v.category}</span>
                  </div>
                  <h3 className="ong-prof-card-name">{v.name}</h3>
                  <p className="ong-prof-card-desc">{v.desc}</p>
                  <div className="ong-prof-card-footer" style={{ marginTop: '8px' }}>
                    <span style={{ color: 'var(--text-mid)', fontSize: '12px' }}>
                      ⏱ {v.duracion} · 📅 {new Date(v.fechaInicio).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: lleno ? 'var(--text-light)' : 'var(--teal)' }}>
                      {lleno ? 'Sin cupos' : `${cuposLibres} cupos`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* ── Tab: Sobre nosotros ── */}
      {activeTab === 'sobre' && (
        <div className="ong-prof-about">

          {ong.mision && (
            <div className="ong-prof-mision-box">
              <span className="modal-section-title">Nuestra misión</span>
              <p className="ong-prof-mision-text">"{ong.mision}"</p>
            </div>
          )}

          <div className="ong-prof-about-grid">
            <div>
              <span className="modal-section-title">Descripción</span>
              <p className="modal-desc" style={{ marginTop: '10px' }}>{ong.desc}</p>
              <div className="ong-prof-tags" style={{ marginTop: '16px' }}>
                {ong.tags.map(t => <span key={t} className="card-tag">{t}</span>)}
              </div>
              {ong.añoFundacion && (
                <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-light)' }}>
                  🗓 Organización fundada en <strong>{ong.añoFundacion}</strong>
                </p>
              )}
            </div>

            {ong.galeria?.length > 0 && (
              <div>
                <span className="modal-section-title">Galería</span>
                <div className="ong-prof-gallery">
                  {ong.galeria.map((url, i) => (
                    <img key={i} src={url} alt={`Foto ${i + 1} de ${ong.name}`} className="ong-prof-gallery-img" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedCampaña && (
        <CampaignDetailModal
          campaña={selectedCampaña}
          onClose={() => setSelectedCampaña(null)}
        />
      )}
      {selectedVol && (
        <VoluntariadoDetailModal
          voluntariado={selectedVol}
          onClose={() => setSelectedVol(null)}
        />
      )}
    </div>
  );
}
