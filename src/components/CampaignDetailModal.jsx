import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MONTOS_RAPIDOS = [10, 25, 50, 100];

export default function CampaignDetailModal({ campaña, user, onDonate, onClose }) {
  const navigate = useNavigate();

  const [donando, setDonando] = useState(false);
  const [monto, setMonto] = useState('');
  const [montoPersonalizado, setMontoPersonalizado] = useState('');
  const [donationStatus, setDonationStatus] = useState(null);

  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!campaña) return null;
  const c = campaña;

  const pct      = Math.min(100, Math.round((campaña.actual / campaña.meta) * 100));
  const lograda  = campaña.badge === '¡Lograda!';
  const faltante = Math.max(0, campaña.meta - campaña.actual);
  const montoFinal = monto === 'custom' ? parseInt(montoPersonalizado) : parseInt(monto);

  const fechaInicio = campaña.fechaInicio
    ? new Date(campaña.fechaInicio).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const fechaFin = campaña.fechaFin
    ? new Date(campaña.fechaFin).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  function handleConfirmarDonacion() {
    if (!user) { setDonationStatus('noauth'); return; }
    if (!montoFinal || montoFinal <= 0) return;
    if ((user.creditos || 0) < montoFinal) { setDonationStatus('error'); return; }
    onDonate(campaña.id, montoFinal);
    setDonationStatus('success');
  }

  function handleAbrirDonacion() {
    if (!user) { setDonationStatus('noauth'); return; }
    setDonando(true);
    setDonationStatus(null);
    setMonto('');
    setMontoPersonalizado('');
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">✕</button>

        <div className="modal-badges">
          <span className={`campaign-badge ${campaña.badgeClass}`}>{campaña.badge}</span>
          {campaña.urgent && <span className="donations-urgent-tag">🔥 Urgente</span>}
          {campaña.category && <span className="modal-category-tag">{campaña.category}</span>}
        </div>

        <h2 className="modal-title">{campaña.name}</h2>

        {campaña.ongName && (
          <button
            className="donations-card-ong-link modal-ong-link"
            onClick={() => { navigate(`/perfil/${campaña.ongId}`); onClose(); }}
          >
            {campaña.ongName} · 📍 {campaña.location}
          </button>
        )}

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
                <span className="modal-stat-value modal-stat-value--small">{fechaFin}</span>
                <span className="modal-stat-label">Fecha límite</span>
              </div>
            </div>
          )}
        </div>

        <div className="modal-divider" />

        <div className="modal-section">
          <h4 className="modal-section-title">Sobre esta campaña</h4>
          <p className="modal-desc">{campaña.impacto || campaña.desc}</p>
        </div>

        {campaña.actualizacion && (
          <div className="modal-update-box">
            <span className="modal-update-label">📣 Última actualización</span>
            <p className="modal-update-text">{campaña.actualizacion}</p>
          </div>
        )}

        <div className="modal-divider" />

        <div className="modal-section">
          <h4 className="modal-section-title">Recaudación</h4>
          <div className="admin-progress-row">
          <span className="admin-progress-money">
          S/. {c.actual.toLocaleString()} / {c.meta.toLocaleString()}
          </span>

  <strong className="admin-progress-percent">{pct}%</strong>
</div>
          <div className="donations-progress-bar-bg modal-progress-bar">
            <div
              className="donations-progress-bar-fill"
              style={{ width: `${pct}%`, backgroundColor: lograda ? 'var(--green-light)' : 'var(--green-mid)' }}
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

        {/* ── Flujo de donación ── */}
        {!lograda && (
          <div className="donate-section">
            {donationStatus === 'noauth' && (
              <div className="donate-noauth-alert">
                Debes <button onClick={() => { onClose(); navigate('/login'); }}>iniciar sesión</button> para donar.
              </div>
            )}
            {donationStatus === 'success' && (
              <div className="donate-success">
                <div className="donate-success-icon">🎉</div>
                <p className="donate-success-title">¡Gracias por tu donación de S/. {montoFinal}!</p>
                <p className="donate-success-subtitle">
                  Tu nuevo saldo: S/. {((user?.creditos || 0) - montoFinal).toLocaleString()}
                </p>
              </div>
            )}
            {donationStatus === 'error' && (
              <div className="donate-error-alert">
                Créditos insuficientes. Tienes S/. {user?.creditos || 0} disponibles.
              </div>
            )}
            {donationStatus !== 'success' && (
              <>
                {!donando ? (
                  <button className="donations-btn" onClick={handleAbrirDonacion}>
                    ❤️ Donar ahora
                  </button>
                ) : (
                  <div className="donate-panel">
                    {user && (
                      <p className="donate-panel-saldo">
                        💰 Tu saldo disponible: S/. {(user.creditos || 0).toLocaleString()}
                      </p>
                    )}
                    <p className="donate-question">¿Cuánto quieres donar?</p>
                    <div className="donate-amounts-row">
                      {MONTOS_RAPIDOS.map(m => (
                        <button
                          key={m}
                          className={`donate-amount-btn ${monto === String(m) ? 'donate-amount-btn--active' : ''}`}
                          onClick={() => { setMonto(String(m)); setMontoPersonalizado(''); setDonationStatus(null); }}
                        >
                          S/. {m}
                        </button>
                      ))}
                      <button
                        className={`donate-amount-btn ${monto === 'custom' ? 'donate-amount-btn--active' : ''}`}
                        onClick={() => { setMonto('custom'); setDonationStatus(null); }}
                      >
                        Otro
                      </button>
                    </div>
                    {monto === 'custom' && (
                      <input
                        className="donate-custom-input"
                        type="number"
                        min="1"
                        placeholder="Ingresa el monto (S/.)"
                        value={montoPersonalizado}
                        onChange={e => { setMontoPersonalizado(e.target.value); setDonationStatus(null); }}
                      />
                    )}
                    <div className="donate-actions">
                      <button
                        className="donate-confirm-btn"
                        onClick={handleConfirmarDonacion}
                        disabled={!montoFinal || montoFinal <= 0}
                      >
                        Confirmar donación
                      </button>
                      <button
                        className="donate-cancel-btn"
                        onClick={() => { setDonando(false); setDonationStatus(null); }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {lograda && (
          <button className="donations-btn donations-btn--done" disabled>
            ✓ Meta alcanzada
          </button>
        )}

      </div>
    </div>
  );
}
