import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CampaignDetailModal({ campaña, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!campaña) return null;

  const pct      = Math.min(100, Math.round((campaña.actual / campaña.meta) * 100));
  const lograda  = campaña.badge === '¡Lograda!';
  const faltante = Math.max(0, campaña.meta - campaña.actual);

  const fechaInicio = campaña.fechaInicio
    ? new Date(campaña.fechaInicio).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const fechaFin = campaña.fechaFin
    ? new Date(campaña.fechaFin).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        {/* ── Botón cerrar ── */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">✕</button>

        {/* ── Badges ── */}
        <div className="modal-badges">
          <span className={`campaign-badge ${campaña.badgeClass}`}>{campaña.badge}</span>
          {campaña.urgent && <span className="donations-urgent-tag">🔥 Urgente</span>}
          {campaña.category && <span className="modal-category-tag">{campaña.category}</span>}
        </div>

        {/* ── Título ── */}
        <h2 className="modal-title">{campaña.name}</h2>

        {/* ── ONG y ubicación ── */}
        {campaña.ongName && (
          <button
            className="donations-card-ong-link modal-ong-link"
            onClick={() => { navigate(`/perfil/${campaña.ongId}`); onClose(); }}
          >
            {campaña.ongName} · 📍 {campaña.location}
          </button>
        )}

        {/* ── Stats rápidas ── */}
        <div className="modal-stats-row">
          {campaña.beneficiarios && (
            <div className="modal-stat-chip">
              <span className="modal-stat-icon">👥</span>
              <div>
                <span className="modal-stat-value">{campaña.beneficiarios.toLocaleString()}</span>
                <span className="modal-stat-label">Beneficiarios</span>
              </div>
            </div>
          )}
          {campaña.donantes && (
            <div className="modal-stat-chip">
              <span className="modal-stat-icon">❤️</span>
              <div>
                <span className="modal-stat-value">{campaña.donantes.toLocaleString()}</span>
                <span className="modal-stat-label">Donantes</span>
              </div>
            </div>
          )}
          {fechaFin && (
            <div className="modal-stat-chip">
              <span className="modal-stat-icon">📅</span>
              <div>
                <span className="modal-stat-value" style={{ fontSize: '12px' }}>{fechaFin}</span>
                <span className="modal-stat-label">Fecha límite</span>
              </div>
            </div>
          )}
        </div>

        <div className="modal-divider" />

        {/* ── Descripción ── */}
        <div className="modal-section">
          <h4 className="modal-section-title">Sobre esta campaña</h4>
          <p className="modal-desc">{campaña.impacto || campaña.desc}</p>
        </div>

        {/* ── Última actualización ── */}
        {campaña.actualizacion && (
          <div className="modal-update-box">
            <span className="modal-update-label">📣 Última actualización</span>
            <p className="modal-update-text">{campaña.actualizacion}</p>
          </div>
        )}

        <div className="modal-divider" />

        {/* ── Progreso ── */}
        <div className="modal-section">
          <h4 className="modal-section-title">Recaudación</h4>

          <div className="modal-progress-numbers">
            <div>
              <span className="modal-amount-big">S/. {campaña.actual.toLocaleString()}</span>
              <span className="modal-amount-label"> recaudados</span>
            </div>
            <span className="modal-pct-big">{pct}%</span>
          </div>

          <div className="donations-progress-bar-bg" style={{ height: '10px', margin: '10px 0' }}>
            <div
              className="donations-progress-bar-fill"
              style={{
                width: `${pct}%`,
                backgroundColor: lograda ? 'var(--green-light)' : 'var(--green-mid)',
              }}
            />
          </div>

          <div className="modal-progress-footer">
            <span>Meta: <strong>S/. {campaña.meta.toLocaleString()}</strong></span>
            {!lograda && faltante > 0 && (
              <span className="modal-faltante">Faltan: <strong>S/. {faltante.toLocaleString()}</strong></span>
            )}
          </div>

          {fechaInicio && (
            <div className="modal-dates-row">
              <span>📅 Inicio: <strong>{fechaInicio}</strong></span>
              {fechaFin && <span>🏁 Cierre: <strong>{fechaFin}</strong></span>}
            </div>
          )}
        </div>

        {/* ── Acción ── */}
        <button
          className={`donations-btn ${lograda ? 'donations-btn--done' : ''}`}
          disabled={lograda}
        >
          {lograda ? '✓ Meta alcanzada' : '❤️ Donar ahora'}
        </button>

      </div>
    </div>
  );
}
