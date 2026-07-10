// ─────────────────────────────────────────────────────────────
// VoluntariadoScreen.jsx  —  Pantalla "Voluntariado"
//
// COMPONENTE USADO:
//   • VoluntariadoDetailModal  →  popup con detalles del voluntariado
//                                 y el botón para postularse
//
// PROPS QUE RECIBE (vienen de App.jsx):
//   • voluntariados  →  lista de voluntariados desde el estado de App
//   • user           →  usuario logueado (para saber si ya se postuló)
//   • onPostular     →  función que registra la postulación
//
// DATOS (data.json):
//   • categories     →  categorías para los botones de filtro
//
// TODO(backend): `voluntariados`, `user` y `onPostular` ya llegan
// conectados al backend vía App.jsx. El import de `categories` puede
// quedarse (lista fija). Único cambio real necesario: la función
// `yaPostulado(vId)` más abajo compara contra `user.voluntariadosPostulados`,
// pero GET /api/me ya no devuelve ese campo — devuelve `user.postulaciones`
// (arreglo de filas Postulacion, cada una con `.voluntariadoId`). Cambiar
// esa función a: `(user?.postulaciones || []).some(p => p.voluntariadoId === vId)`.
// (El mismo cambio aplica dentro de VoluntariadoDetailModal.jsx, que hace
// la misma comprobación).
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data.json';
import VoluntariadoDetailModal from '../components/VoluntariadoDetailModal';

// Opciones del filtro de modalidad
const MODALIDADES = ['Todas', 'Presencial', 'Virtual', 'Híbrido'];

// Íconos para cada modalidad
const MODALIDAD_ICON = {
  Presencial: '📍',
  Virtual:    '💻',
  Híbrido:    '🔄',
};

export default function VoluntariadoScreen({ voluntariados = [], user, onPostular }) {
  const navigate = useNavigate();

  // Texto libre del buscador
  const [query, setQuery] = useState('');

  // Categoría activa en los filtros
  const [activeCategory, setActiveCategory] = useState('Todas');

  // Modalidad activa: Todas / Presencial / Virtual / Híbrido
  const [activeModalidad, setActiveModalidad] = useState('Todas');

  // Voluntariado seleccionado para abrir el modal de detalles
  const [selectedVol, setSelectedVol] = useState(null);

  // ── Filtrado ──────────────────────────────────────────────
  // Un voluntariado aparece si coincide con el texto, la categoría y la modalidad
  const filtered = voluntariados.filter(v => {
    const texto = query.toLowerCase();

    const coincideTexto =
      v.name.toLowerCase().includes(texto) ||
      v.desc.toLowerCase().includes(texto) ||
      v.ongName.toLowerCase().includes(texto);

    const coincideCategoria = activeCategory === 'Todas' || v.category === activeCategory;
    const coincideModalidad = activeModalidad === 'Todas' || v.modalidad === activeModalidad;

    return coincideTexto && coincideCategoria && coincideModalidad;
  });

  // Total de cupos libres sumando todos los voluntariados activos
  const totalCuposLibres = voluntariados
    .filter(v => v.badge === 'Activo')
    .reduce((suma, v) => suma + (v.cupos - v.cuposOcupados), 0);

  // Verifica si el usuario ya se postuló a un voluntariado específico
  function yaPostulado(vId) {
    return (user?.voluntariadosPostulados || []).some(p => p.voluntariadoId === vId);
  }

  return (
    <div className="fade-in vol-wrapper">

      {/* ── Cabecera: título, buscador y filtros ── */}
      <header className="donations-header">
        <h1 className="donations-title">Voluntariado</h1>
        <p className="donations-subtitle">
          Encuentra oportunidades para contribuir con tu tiempo y habilidades.
        </p>

        {/* Buscador de texto libre */}
        <div className="search-box-container" style={{ maxWidth: '560px', margin: '0 auto 20px auto' }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por actividad, ONG o descripción..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className="donations-filters">

          {/* Filtros por categoría (vienen del JSON) */}
          <div className="filter-tags">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filtros por modalidad */}
          <div className="donations-estado-tabs">
            {MODALIDADES.map(m => (
              <button
                key={m}
                className={`donations-estado-btn ${activeModalidad === m ? 'active' : ''}`}
                onClick={() => setActiveModalidad(m)}
              >
                {m === 'Todas' ? m : `${MODALIDAD_ICON[m]} ${m}`}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Barra de estadísticas ── */}
      <div className="donations-stats-bar">
        <span>
          🤝 <strong>{totalCuposLibres}</strong> cupos disponibles en voluntariados activos
        </span>
        <span>
          📋 <strong>{filtered.length}</strong>{' '}
          {filtered.length === 1 ? 'oportunidad encontrada' : 'oportunidades encontradas'}
        </span>
      </div>

      {/* ── Lista de voluntariados o mensaje vacío ── */}
      {filtered.length === 0 ? (

        <div className="donations-empty">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
          <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-dark)' }}>
            No hay voluntariados con ese criterio
          </p>
          <p style={{ fontSize: '0.9rem', marginTop: '6px', color: 'var(--text-light)' }}>
            Prueba con otra categoría o modalidad
          </p>
        </div>

      ) : (

        <div className="donations-grid">
          {filtered.map(v => {
            const cuposLibres   = v.cupos - v.cuposOcupados;
            const pctOcupado    = Math.round((v.cuposOcupados / v.cupos) * 100);
            const lleno         = v.badge === 'Lleno' || cuposLibres <= 0;
            const postulado     = yaPostulado(v.id);
            const fechaFormateada = new Date(v.fechaInicio).toLocaleDateString('es-PE', {
              day: 'numeric', month: 'long', year: 'numeric',
            });
            const textoCupos = cuposLibres === 1 ? '1 cupo libre' : `${cuposLibres} cupos libres`;

            return (
              // Click en la tarjeta abre el modal de detalles
              <div
                key={v.id}
                className={`donations-card card-clickable ${lleno ? 'donations-card--done' : ''}`}
                onClick={() => setSelectedVol(v)}
              >
                {/* Fila superior: badge, modalidad y categoría */}
                <div className="donations-card-top">
                  <div className="donations-card-tags">
                    <span className={`campaign-badge ${v.badgeClass}`}>{v.badge}</span>
                    <span className="vol-modalidad-tag">
                      {MODALIDAD_ICON[v.modalidad]} {v.modalidad}
                    </span>
                  </div>
                  <span className="donations-card-category">{v.category}</span>
                </div>

                <h3 className="donations-card-name">{v.name}</h3>
                <p className="donations-card-desc">{v.desc}</p>

                {/* Enlace a la ONG — stopPropagation evita que también abra el modal */}
                <button
                  className="donations-card-ong-link"
                  onClick={e => { e.stopPropagation(); navigate(`/perfil/${v.ongId}`); }}
                >
                  {v.ongName} · 📍 {v.location}
                </button>

                {/* Fecha de inicio y duración */}
                <div className="vol-meta-row">
                  <span className="vol-meta-item">📅 Inicio: <strong>{fechaFormateada}</strong></span>
                  <span className="vol-meta-item">⏱ Duración: <strong>{v.duracion}</strong></span>
                </div>

                {/* Barra de progreso de cupos ocupados */}
                <div className="donations-progress">
                  <div className="donations-progress-bar-bg">
                    <div
                      className="donations-progress-bar-fill"
                      style={{ width: `${pctOcupado}%`, backgroundColor: lleno ? 'var(--green-light)' : 'var(--teal)' }}
                    />
                  </div>
                  <div className="donations-progress-labels">
                    <span>{lleno ? 'Sin cupos disponibles' : textoCupos}</span>
                    <span className="donations-pct">{v.cuposOcupados}/{v.cupos}</span>
                  </div>
                </div>

                {/* Botón que abre el modal (el flujo de postulación está dentro del modal) */}
                <button
                  className={`donations-btn ${lleno || postulado ? 'donations-btn--done' : 'vol-btn-postular'}`}
                  disabled={lleno || postulado}
                  onClick={e => { e.stopPropagation(); setSelectedVol(v); }}
                >
                  {postulado ? '✓ Ya postulado' : lleno ? '✓ Sin cupos disponibles' : '🤝 Postularme'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de detalles — se muestra solo cuando hay un voluntariado seleccionado */}
      {selectedVol && (
        <VoluntariadoDetailModal
          key={selectedVol.id}
          voluntariado={selectedVol}
          user={user}
          onPostular={onPostular}
          onClose={() => setSelectedVol(null)}
        />
      )}
    </div>
  );
}
