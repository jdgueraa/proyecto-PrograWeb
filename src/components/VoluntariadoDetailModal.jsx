import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MODALIDAD_ICON = { Presencial: '📍', Virtual: '💻', Híbrido: '🔄' };

export default function VoluntariadoDetailModal({ voluntariado: v, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!v) return null;

  const cuposLibres  = v.cupos - v.cuposOcupados;
  const pctOcupado   = Math.round((v.cuposOcupados / v.cupos) * 100);
  const lleno        = v.badge === 'Lleno' || cuposLibres <= 0;
  const fechaInicio  = new Date(v.fechaInicio).toLocaleDateString('es-PE', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        {/* ── Cerrar ── */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">✕</button>

        {/* ── Badges ── */}
        <div className="modal-badges">
          <span className={`campaign-badge ${v.badgeClass}`}>{v.badge}</span>
          <span className="vol-modalidad-tag">
            {MODALIDAD_ICON[v.modalidad]} {v.modalidad}
          </span>
          {v.category && <span className="modal-category-tag">{v.category}</span>}
        </div>

        {/* ── Título ── */}
        <h2 className="modal-title">{v.name}</h2>

        {/* ── ONG y ubicación ── */}
        <button
          className="donations-card-ong-link modal-ong-link"
          onClick={() => { navigate(`/perfil/${v.ongId}`); onClose(); }}
        >
          {v.ongName} · 📍 {v.location}
        </button>

        {/* ── Stats rápidas ── */}
        <div className="modal-stats-row">
          <div className="modal-stat-chip">
            <span className="modal-stat-icon">🪑</span>
            <div>
              <span className="modal-stat-value">
                {lleno ? 'Sin cupos' : `${cuposLibres} libre${cuposLibres !== 1 ? 's' : ''}`}
              </span>
              <span className="modal-stat-label">Cupos disponibles</span>
            </div>
          </div>
          <div className="modal-stat-chip">
            <span className="modal-stat-icon">⏱</span>
            <div>
              <span className="modal-stat-value">{v.duracion}</span>
              <span className="modal-stat-label">Duración</span>
            </div>
          </div>
          <div className="modal-stat-chip">
            <span className="modal-stat-icon">📅</span>
            <div>
              <span className="modal-stat-value" style={{ fontSize: '12px' }}>{fechaInicio}</span>
              <span className="modal-stat-label">Fecha de inicio</span>
            </div>
          </div>
        </div>

        <div className="modal-divider" />

        {/* ── Descripción de impacto ── */}
        <div className="modal-section">
          <h4 className="modal-section-title">Sobre este voluntariado</h4>
          <p className="modal-desc">{v.impacto || v.desc}</p>
        </div>

        {/* ── Actividades ── */}
        {v.actividades?.length > 0 && (
          <div className="modal-section" style={{ marginTop: '16px' }}>
            <h4 className="modal-section-title">¿Qué harás?</h4>
            <ul className="modal-list">
              {v.actividades.map((act, i) => (
                <li key={i} className="modal-list-item">
                  <span className="modal-list-dot">▸</span>{act}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Requisitos ── */}
        {v.requisitos?.length > 0 && (
          <div className="modal-section" style={{ marginTop: '16px' }}>
            <h4 className="modal-section-title">Requisitos</h4>
            <ul className="modal-list">
              {v.requisitos.map((req, i) => (
                <li key={i} className="modal-list-item">
                  <span className="modal-list-dot modal-list-dot--req">✓</span>{req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Última actualización ── */}
        {v.actualizacion && (
          <div className="modal-update-box" style={{ marginTop: '16px' }}>
            <span className="modal-update-label">📣 Última actualización</span>
            <p className="modal-update-text">{v.actualizacion}</p>
          </div>
        )}

        <div className="modal-divider" />

        {/* ── Cupos ── */}
        <div className="modal-section">
          <h4 className="modal-section-title">Disponibilidad</h4>
          <div className="modal-progress-numbers">
            <span>
              <span className="modal-amount-big">{v.cuposOcupados}</span>
              <span className="modal-amount-label"> de {v.cupos} cupos ocupados</span>
            </span>
            <span className="modal-pct-big">{pctOcupado}%</span>
          </div>
          <div className="donations-progress-bar-bg" style={{ height: '10px', margin: '10px 0' }}>
            <div
              className="donations-progress-bar-fill"
              style={{
                width: `${pctOcupado}%`,
                backgroundColor: lleno ? 'var(--green-light)' : 'var(--teal)',
              }}
            />
          </div>
        </div>

        {/* ── Acción ── */}
        <button
          className={`donations-btn ${lleno ? 'donations-btn--done' : 'vol-btn-postular'}`}
          disabled={lleno}
        >
          {lleno ? '✓ Sin cupos disponibles' : '🤝 Postularme a este voluntariado'}
        </button>

      </div>
    </div>
  );
}
