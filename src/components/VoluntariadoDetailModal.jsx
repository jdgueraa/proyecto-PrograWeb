// ─────────────────────────────────────────────────────────────
// VoluntariadoDetailModal.jsx  —  Modal de detalle de voluntariado + postulación
//
// USADO EN:  VoluntariadoScreen
//
// PROPS QUE RECIBE:
//   • voluntariado  →  objeto del voluntariado seleccionado
//   • user          →  usuario logueado (para verificar si ya se postuló)
//   • onPostular    →  función de App.jsx que registra la postulación
//   • onClose       →  cierra el modal
//
// FLUJO DE POSTULACIÓN:
//   1. Usuario presiona "Postularme a este voluntariado"
//   2. Aparece confirmación "¿Confirmar tu postulación?"
//   3. Si confirma → se registra la postulación y aparece mensaje de éxito
//   4. Si ya estaba postulado → muestra directamente "¡Postulación enviada!"
//
// CONECTADO AL BACKEND:
// `yaPostulado` ahora se fija en `user.postulaciones` (antes se
// llamaba `voluntariadosPostulados` en data.json). Y `handlePostularConfirm`
// ahora espera (con "await") la respuesta real del backend antes de
// mostrar el mensaje de éxito, por si el backend la rechaza (por
// ejemplo porque alguien más se postuló justo antes y ya no hay cupos).
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MODALIDAD_ICON = { Presencial: '📍', Virtual: '💻', Híbrido: '🔄' };

export default function VoluntariadoDetailModal({ voluntariado: v, user, onPostular, onClose }) {
  const navigate = useNavigate();

  const [confirmando, setConfirmando] = useState(false);
  const [postulacionStatus, setPostulacionStatus] = useState(null);

  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!v) return null;

  const cuposLibres = v.cupos - v.cuposOcupados;
  const pctOcupado  = Math.round((v.cuposOcupados / v.cupos) * 100);
  const lleno       = v.badge === 'Lleno' || cuposLibres <= 0;
  // Antes este dato se llamaba "voluntariadosPostulados". El backend
  // lo manda ahora con el nombre "postulaciones".
  const yaPostulado = user?.postulaciones?.some(p => p.voluntariadoId === v.id) || false;

  const fechaInicio = new Date(v.fechaInicio).toLocaleDateString('es-PE', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // "async" quiere decir que esta función va a esperar una respuesta
  // del backend antes de seguir. Usamos "await" para eso, y "try/catch"
  // para saber si el backend dijo que sí (try) o si hubo algún problema
  // (catch), por ejemplo que ya no quedan cupos.
  async function handlePostularConfirm() {
    if (!user) { setPostulacionStatus('noauth'); return; }

    try {
      await onPostular(v.id);
      setPostulacionStatus('success');
    } catch (error) {
      setPostulacionStatus('error');
    }

    setConfirmando(false);
  }

  function renderAccion() {
    if (lleno) {
      return (
        <button className="donations-btn donations-btn--done" disabled>
          ✓ Sin cupos disponibles
        </button>
      );
    }
    if (postulacionStatus === 'success' || yaPostulado) {
      return (
        <div className="postular-success">
          <div className="postular-success-icon">🎉</div>
          <p className="postular-success-title">¡Postulación enviada!</p>
          <p className="postular-success-subtitle">La ONG se pondrá en contacto contigo pronto.</p>
        </div>
      );
    }
    if (postulacionStatus === 'noauth') {
      return (
        <div className="postular-noauth-alert">
          Debes <button onClick={() => { onClose(); navigate('/login'); }}>iniciar sesión</button> para postularte.
        </div>
      );
    }
    // Mensaje que aparece si el backend no pudo registrar la postulación
    // (por ejemplo, alguien más ocupó el último cupo justo antes).
    if (postulacionStatus === 'error') {
      return (
        <div className="postular-noauth-alert">
          No se pudo registrar tu postulación. Puede que ya no haya cupos disponibles. Intenta de nuevo.
        </div>
      );
    }
    if (confirmando) {
      return (
        <div className="postular-confirm-panel">
          <p className="postular-confirm-text">¿Confirmar tu postulación a este voluntariado?</p>
          <div className="postular-confirm-actions">
            <button className="postular-confirm-btn-yes" onClick={handlePostularConfirm}>
              Sí, postularme
            </button>
            <button className="postular-confirm-btn-cancel" onClick={() => setConfirmando(false)}>
              Cancelar
            </button>
          </div>
        </div>
      );
    }
    return (
      <button
        className="donations-btn vol-btn-postular"
        onClick={() => {
          if (!user) { setPostulacionStatus('noauth'); return; }
          setConfirmando(true);
        }}
      >
        🤝 Postularme a este voluntariado
      </button>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">✕</button>

        <div className="modal-badges">
          <span className={`campaign-badge ${v.badgeClass}`}>{v.badge}</span>
          <span className="vol-modalidad-tag">{MODALIDAD_ICON[v.modalidad]} {v.modalidad}</span>
          {v.category && <span className="modal-category-tag">{v.category}</span>}
        </div>

        <h2 className="modal-title">{v.name}</h2>

        <button
          className="donations-card-ong-link modal-ong-link"
          onClick={() => { navigate(`/perfil/${v.ongId}`); onClose(); }}
        >
          {v.ongName} · 📍 {v.location}
        </button>

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
              <span className="modal-stat-value modal-stat-value--small">{fechaInicio}</span>
              <span className="modal-stat-label">Fecha de inicio</span>
            </div>
          </div>
        </div>

        <div className="modal-divider" />

        <div className="modal-section">
          <h4 className="modal-section-title">Sobre este voluntariado</h4>
          <p className="modal-desc">{v.impacto || v.desc}</p>
        </div>

        {v.actividades?.length > 0 && (
          <div className="modal-section">
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

        {v.requisitos?.length > 0 && (
          <div className="modal-section">
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

        {v.actualizacion && (
          <div className="modal-update-box">
            <span className="modal-update-label">📣 Última actualización</span>
            <p className="modal-update-text">{v.actualizacion}</p>
          </div>
        )}

        <div className="modal-divider" />

        <div className="modal-section">
          <h4 className="modal-section-title">Disponibilidad</h4>
          <div className="modal-progress-numbers">
            <span>
              <span className="modal-amount-big">{v.cuposOcupados}</span>
              <span className="modal-amount-label"> de {v.cupos} cupos ocupados</span>
            </span>
            <span className="modal-pct-big">{pctOcupado}%</span>
          </div>
          <div className="donations-progress-bar-bg modal-progress-bar">
            <div
              className="donations-progress-bar-fill"
              style={{ width: `${pctOcupado}%`, backgroundColor: lleno ? 'var(--green-light)' : 'var(--teal)' }}
            />
          </div>
        </div>

        {renderAccion()}

      </div>
    </div>
  );
}
