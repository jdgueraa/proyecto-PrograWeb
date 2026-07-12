// AdminScreen.jsx — YA CONECTADO al backend real.
//
// Cambios respecto a la versión con data.json + localStorage:
//   1. Ya no se importa dataJson. La ONG propia viene en `user.ong`
//      (gracias a GET /api/me).
//   2. `handleCrearCampaña` / `handleCrearVoluntariado` ahora mandan SOLO
//      los campos del formulario a `onCreateCampaña` / `onCreateVoluntariado`
//      (funciones que App.jsx debe implementar llamando a
//      `api.post('/campanas', datos)` / `api.post('/voluntariados', datos)`
//      y devolviendo la campaña/voluntariado ya creado con su id real).
//   3. Los donantes y postulantes ya NO salen de localStorage: se piden al
//      backend con `GET /campanas/:id/donaciones` y
//      `GET /voluntariados/:id/postulaciones`, una vez por cada
//      campaña/voluntariado propio, cada vez que cambia la lista.
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const CATEGORIAS = ['Medio Ambiente', 'Educación', 'Salud', 'Agua', 'Pobreza'];
const MODALIDADES = ['Presencial', 'Virtual', 'Híbrido'];

const TABS = [
  { id: 'campañas',      label: '📋 Mis Campañas' },
  { id: 'voluntariados', label: '🤝 Mis Voluntariados' },
  { id: 'crear-campaña', label: '➕ Crear Campaña' },
  { id: 'crear-vol',     label: '➕ Crear Voluntariado' },
];

export default function AdminScreen({ user, campañas = [], voluntariados = [], onCreateCampaña, onCreateVoluntariado }) {
  const [activeTab, setActiveTab] = useState('campañas');

  const [formCampaña, setFormCampaña] = useState({
    name: '', desc: '', meta: '', category: 'Educación',
    location: '', fechaInicio: '', fechaFin: '', urgent: false,
  });

  const [formVol, setFormVol] = useState({
    name: '', desc: '', category: 'Educación', modalidad: 'Presencial',
    cupos: '', duracion: '', fechaInicio: '', location: '',
  });

  const [mensajeCampaña, setMensajeCampaña] = useState('');
  const [mensajeVol, setMensajeVol] = useState('');
  const [creandoCampaña, setCreandoCampaña] = useState(false);
  const [creandoVol, setCreandoVol] = useState(false);

  // Donantes/postulantes por id, traídos del backend
  const [donantesPorCampaña, setDonantesPorCampaña] = useState({});
  const [postulantesPorVoluntariado, setPostulantesPorVoluntariado] = useState({});

  const miOng = user?.ong;
  const misCampañas = campañas.filter(c => c.ongId === user?.ongId);
  const misVoluntariados = voluntariados.filter(v => v.ongId === user?.ongId);

  // Cada vez que cambia la lista de campañas propias, pedimos sus donantes
  useEffect(() => {
    if (activeTab !== 'campañas' || misCampañas.length === 0) return;
    let cancelado = false;

    (async () => {
      const entradas = await Promise.all(
        misCampañas.map(async (c) => {
          try {
            const donaciones = await api.get(`/campanas/${c.id}/donaciones`);
            return [c.id, donaciones];
          } catch {
            return [c.id, []];
          }
        })
      );
      if (!cancelado) setDonantesPorCampaña(Object.fromEntries(entradas));
    })();

    return () => { cancelado = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, misCampañas.map(c => c.id).join(',')]);

  // Cada vez que cambia la lista de voluntariados propios, pedimos sus postulantes
  useEffect(() => {
    if (activeTab !== 'voluntariados' || misVoluntariados.length === 0) return;
    let cancelado = false;

    (async () => {
      const entradas = await Promise.all(
        misVoluntariados.map(async (v) => {
          try {
            const postulaciones = await api.get(`/voluntariados/${v.id}/postulaciones`);
            return [v.id, postulaciones];
          } catch {
            return [v.id, []];
          }
        })
      );
      if (!cancelado) setPostulantesPorVoluntariado(Object.fromEntries(entradas));
    })();

    return () => { cancelado = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, misVoluntariados.map(v => v.id).join(',')]);

  async function handleCrearCampaña() {
    if (!formCampaña.name || !formCampaña.desc || !formCampaña.meta || !formCampaña.location) {
      setMensajeCampaña('Completa todos los campos obligatorios.');
      return;
    }
    setCreandoCampaña(true);
    try {
      await onCreateCampaña({
        name: formCampaña.name.trim(),
        desc: formCampaña.desc.trim(),
        meta: parseInt(formCampaña.meta, 10),
        category: formCampaña.category,
        location: formCampaña.location.trim(),
        fechaInicio: formCampaña.fechaInicio || undefined,
        fechaFin: formCampaña.fechaFin || undefined,
        urgent: formCampaña.urgent,
      });
      setFormCampaña({ name: '', desc: '', meta: '', category: 'Educación', location: '', fechaInicio: '', fechaFin: '', urgent: false });
      setMensajeCampaña('¡Campaña creada! Ya aparece en la sección de Donaciones.');
      setTimeout(() => setMensajeCampaña(''), 4000);
    } catch (err) {
      setMensajeCampaña(err.message || 'No se pudo crear la campaña.');
    } finally {
      setCreandoCampaña(false);
    }
  }

  async function handleCrearVoluntariado() {
    if (!formVol.name || !formVol.desc || !formVol.cupos || !formVol.location) {
      setMensajeVol('Completa todos los campos obligatorios.');
      return;
    }
    setCreandoVol(true);
    try {
      await onCreateVoluntariado({
        name: formVol.name.trim(),
        desc: formVol.desc.trim(),
        category: formVol.category,
        modalidad: formVol.modalidad,
        cupos: parseInt(formVol.cupos, 10),
        duracion: formVol.duracion || undefined,
        fechaInicio: formVol.fechaInicio || undefined,
        location: formVol.location.trim(),
      });
      setFormVol({ name: '', desc: '', category: 'Educación', modalidad: 'Presencial', cupos: '', duracion: '', fechaInicio: '', location: '' });
      setMensajeVol('¡Voluntariado creado! Ya aparece en la sección de Voluntariado.');
      setTimeout(() => setMensajeVol(''), 4000);
    } catch (err) {
      setMensajeVol(err.message || 'No se pudo crear el voluntariado.');
    } finally {
      setCreandoVol(false);
    }
  }

  return (
    <div className="admin-wrapper fade-in">
      <h1 className="admin-title">Panel ONG</h1>

      {miOng && (
        <div className="admin-ong-header">
          <span className="admin-ong-header-emoji">{miOng.emoji}</span>
          <div>
            <p className="admin-ong-header-name">{miOng.name}</p>
            <p className="admin-ong-header-location">{miOng.location}</p>
          </div>
        </div>
      )}

      <div className="admin-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`admin-tab-btn ${activeTab === tab.id ? 'admin-tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Mis Campañas ── */}
      {activeTab === 'campañas' && (
        <div>
          {misCampañas.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">📋</div>
              <p>Aún no tienes campañas creadas.</p>
              <button className="admin-empty-btn" onClick={() => setActiveTab('crear-campaña')}>
                Crear primera campaña
              </button>
            </div>
          ) : (
            <div className="admin-item-list">
              {misCampañas.map(c => {
                const donantes = donantesPorCampaña[c.id] || [];
                const pct = Math.min(100, Math.round((c.actual / c.meta) * 100));
                return (
                  <div key={c.id} className="admin-item-card">
                    <div className="admin-item-header">
                      <h3 className="admin-item-title">{c.name}</h3>
                      <span className={`campaign-badge ${c.badgeClass}`}>{c.badge}</span>
                    </div>
                    <p className="admin-item-desc">{c.desc}</p>
                    <div className="admin-progress-row">
                      <span>S/. {c.actual.toLocaleString()} / {c.meta.toLocaleString()}</span>
                      <strong>{pct}%</strong>
                    </div>
                    <div className="admin-progress-bar-bg">
                      <div className="admin-progress-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="admin-section-label">❤️ Donantes ({donantes.length})</p>
                    {donantes.length === 0 ? (
                      <p className="admin-empty-msg">Aún no hay donaciones para esta campaña.</p>
                    ) : (
                      <div className="admin-log-list">
                        {donantes.map((d, i) => (
                          <div key={d.id ?? i} className="admin-log-row">
                            <span className="admin-log-name">👤 {d.user?.fullName || d.user?.email || 'Usuario'}</span>
                            <span className="admin-log-amount">S/. {d.monto}</span>
                            <span className="admin-log-date">{new Date(d.createdAt).toLocaleDateString('es-PE')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Mis Voluntariados ── */}
      {activeTab === 'voluntariados' && (
        <div>
          {misVoluntariados.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">🤝</div>
              <p>Aún no tienes voluntariados creados.</p>
              <button className="admin-empty-btn" onClick={() => setActiveTab('crear-vol')}>
                Crear primer voluntariado
              </button>
            </div>
          ) : (
            <div className="admin-item-list">
              {misVoluntariados.map(v => {
                const postulantes = postulantesPorVoluntariado[v.id] || [];
                const cuposLibres = v.cupos - v.cuposOcupados;
                return (
                  <div key={v.id} className="admin-item-card">
                    <div className="admin-item-header">
                      <h3 className="admin-item-title">{v.name}</h3>
                      <span className={`campaign-badge ${v.badgeClass}`}>{v.badge}</span>
                    </div>
                    <p className="admin-item-desc">{v.desc}</p>
                    <p className="admin-vol-meta">
                      📍 {v.location} · 🪑 {cuposLibres} cupo{cuposLibres !== 1 ? 's' : ''} libre{cuposLibres !== 1 ? 's' : ''}
                    </p>
                    <p className="admin-section-label">🤝 Postulantes ({postulantes.length})</p>
                    {postulantes.length === 0 ? (
                      <p className="admin-empty-msg">Aún no hay postulantes para este voluntariado.</p>
                    ) : (
                      <div className="admin-log-list">
                        {postulantes.map((p, i) => (
                          <div key={p.id ?? i} className="admin-log-row">
                            <span className="admin-log-name">👤 {p.user?.fullName || 'Usuario'}</span>
                            <span className="admin-log-email">{p.user?.email}</span>
                            <span className="admin-log-date">{new Date(p.createdAt).toLocaleDateString('es-PE')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Crear Campaña ── */}
      {activeTab === 'crear-campaña' && (
        <div className="admin-form-section">
          <h2 className="admin-form-title">Nueva campaña de donación</h2>
          {mensajeCampaña && (
            <div className={`admin-msg ${mensajeCampaña.includes('¡') ? 'admin-msg--success' : 'admin-msg--error'}`}>
              {mensajeCampaña}
            </div>
          )}
          <div className="admin-field-group">
            <div>
              <label className="admin-label">Título de la campaña *</label>
              <input className="admin-input" placeholder="Ej: Reforestación en Loreto" value={formCampaña.name} onChange={e => setFormCampaña({ ...formCampaña, name: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Descripción / Impacto *</label>
              <textarea className="admin-input admin-input--textarea" placeholder="¿Qué hace esta campaña y cuál es su impacto?" value={formCampaña.desc} onChange={e => setFormCampaña({ ...formCampaña, desc: e.target.value })} />
            </div>
            <div className="admin-field-row">
              <div>
                <label className="admin-label">Meta (S/.) *</label>
                <input className="admin-input" type="number" min="1" placeholder="Ej: 15000" value={formCampaña.meta} onChange={e => setFormCampaña({ ...formCampaña, meta: e.target.value })} />
              </div>
              <div>
                <label className="admin-label">Categoría</label>
                <select className="admin-input" value={formCampaña.category} onChange={e => setFormCampaña({ ...formCampaña, category: e.target.value })}>
                  {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="admin-label">Ubicación *</label>
              <input className="admin-input" placeholder="Ej: Loreto, Perú" value={formCampaña.location} onChange={e => setFormCampaña({ ...formCampaña, location: e.target.value })} />
            </div>
            <div className="admin-field-row">
              <div>
                <label className="admin-label">Fecha de inicio</label>
                <input className="admin-input" type="date" value={formCampaña.fechaInicio} onChange={e => setFormCampaña({ ...formCampaña, fechaInicio: e.target.value })} />
              </div>
              <div>
                <label className="admin-label">Fecha de cierre</label>
                <input className="admin-input" type="date" value={formCampaña.fechaFin} onChange={e => setFormCampaña({ ...formCampaña, fechaFin: e.target.value })} />
              </div>
            </div>
            <label className="admin-checkbox-label">
              <input type="checkbox" checked={formCampaña.urgent} onChange={e => setFormCampaña({ ...formCampaña, urgent: e.target.checked })} />
              Marcar como urgente 🔥
            </label>
            <button className="admin-submit-btn" onClick={handleCrearCampaña} disabled={creandoCampaña}>
              {creandoCampaña ? 'Creando...' : 'Crear campaña'}
            </button>
          </div>
        </div>
      )}

      {/* ── Crear Voluntariado ── */}
      {activeTab === 'crear-vol' && (
        <div className="admin-form-section">
          <h2 className="admin-form-title">Nuevo voluntariado</h2>
          {mensajeVol && (
            <div className={`admin-msg ${mensajeVol.includes('¡') ? 'admin-msg--success' : 'admin-msg--error'}`}>
              {mensajeVol}
            </div>
          )}
          <div className="admin-field-group">
            <div>
              <label className="admin-label">Nombre del voluntariado *</label>
              <input className="admin-input" placeholder="Ej: Brigada de reforestación" value={formVol.name} onChange={e => setFormVol({ ...formVol, name: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Descripción *</label>
              <textarea className="admin-input admin-input--textarea" placeholder="¿Qué harán los voluntarios y cuál es el impacto?" value={formVol.desc} onChange={e => setFormVol({ ...formVol, desc: e.target.value })} />
            </div>
            <div className="admin-field-row">
              <div>
                <label className="admin-label">Categoría</label>
                <select className="admin-input" value={formVol.category} onChange={e => setFormVol({ ...formVol, category: e.target.value })}>
                  {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Modalidad</label>
                <select className="admin-input" value={formVol.modalidad} onChange={e => setFormVol({ ...formVol, modalidad: e.target.value })}>
                  {MODALIDADES.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div className="admin-field-row">
              <div>
                <label className="admin-label">Cupos disponibles *</label>
                <input className="admin-input" type="number" min="1" placeholder="Ej: 20" value={formVol.cupos} onChange={e => setFormVol({ ...formVol, cupos: e.target.value })} />
              </div>
              <div>
                <label className="admin-label">Duración</label>
                <input className="admin-input" placeholder="Ej: 2 semanas" value={formVol.duracion} onChange={e => setFormVol({ ...formVol, duracion: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="admin-label">Ubicación *</label>
              <input className="admin-input" placeholder="Ej: Loreto, Perú / Remoto" value={formVol.location} onChange={e => setFormVol({ ...formVol, location: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Fecha de inicio</label>
              <input className="admin-input" type="date" value={formVol.fechaInicio} onChange={e => setFormVol({ ...formVol, fechaInicio: e.target.value })} />
            </div>
            <button className="admin-submit-btn" onClick={handleCrearVoluntariado} disabled={creandoVol}>
              {creandoVol ? 'Creando...' : 'Crear voluntariado'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
