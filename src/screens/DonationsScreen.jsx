// ─────────────────────────────────────────────────────────────
// DonationsScreen.jsx  —  Pantalla "Donaciones"
//
// COMPONENTE USADO:
//   • CampaignDetailModal  →  popup con detalles de la campaña
//                             y el flujo para realizar una donación
//
// PROPS QUE RECIBE (vienen de App.jsx):
//   • campañas   →  lista de campañas desde el estado de App
//   • user       →  usuario logueado (para mostrar saldo y donar)
//   • onDonate   →  función que descuenta créditos y actualiza la campaña
//
// DATOS (data.json):
//   • categories →  categorías para los botones de filtro
//
// TODO(backend): esta pantalla NO necesita casi cambios — `campañas`,
// `user` y `onDonate` ya llegan como props desde App.jsx, que ya está
// conectado al backend (GET /api/campanas y POST /api/donaciones). El
// import de `categories` puede quedarse tal cual: es una lista fija que
// nunca cambia, no necesita venir del backend.
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data.json';
import CampaignDetailModal from '../components/CampaignDetailModal';

// Opciones del filtro de estado
const ESTADOS = ['Todas', 'Activas', 'Logradas'];

export default function DonationsScreen({ campañas = [], user, onDonate }) {
  const navigate = useNavigate();

  // Texto libre del buscador
  const [query, setQuery] = useState('');

  // Categoría activa en los filtros (Medio Ambiente, Educación, etc.)
  const [activeCategory, setActiveCategory] = useState('Todas');

  // Estado activo: Todas / Activas / Logradas
  const [activeEstado, setActiveEstado] = useState('Todas');

  // Campaña seleccionada para abrir el modal de detalles
  const [selectedCampaña, setSelectedCampaña] = useState(null);

  // ── Filtrado ──────────────────────────────────────────────
  // Una campaña aparece si coincide con el texto, la categoría y el estado
  const filtered = campañas.filter(c => {
    const texto = query.toLowerCase();

    const coincideTexto =
      c.name.toLowerCase().includes(texto) ||
      c.desc.toLowerCase().includes(texto) ||
      c.ongName.toLowerCase().includes(texto);

    const coincideCategoria = activeCategory === 'Todas' || c.category === activeCategory;

    const coincideEstado =
      activeEstado === 'Todas' ||
      (activeEstado === 'Activas'  && c.badge === 'Activa') ||
      (activeEstado === 'Logradas' && c.badge === '¡Lograda!');

    return coincideTexto && coincideCategoria && coincideEstado;
  });

  // Total recaudado sumando solo las campañas activas
  const totalRecaudado = campañas
    .filter(c => c.badge === 'Activa')
    .reduce((suma, c) => suma + c.actual, 0);

  return (
    <div className="fade-in donations-wrapper">

      {/* ── Cabecera: título, saldo, buscador y filtros ── */}
      <header className="donations-header">
        <h1 className="donations-title">Donaciones</h1>
        <p className="donations-subtitle">
          Elige una campaña y contribuye directamente a quienes más lo necesitan.
        </p>

        {/* Muestra el saldo solo si el usuario es persona (no ONG) */}
        {user && user.role !== 'ong' && (
          <div className="donations-saldo-badge">
            💰 Tu saldo: S/. {(user.creditos || 0).toLocaleString()}
          </div>
        )}

        {/* Buscador de texto libre */}
        <div className="search-box-container" style={{ maxWidth: '560px', margin: '0 auto 20px auto' }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por campaña, ONG o descripción..."
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

          {/* Filtros por estado: Todas / Activas / Logradas */}
          <div className="donations-estado-tabs">
            {ESTADOS.map(estado => (
              <button
                key={estado}
                className={`donations-estado-btn ${activeEstado === estado ? 'active' : ''}`}
                onClick={() => setActiveEstado(estado)}
              >
                {estado}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Barra de estadísticas ── */}
      <div className="donations-stats-bar">
        <span>
          💰 <strong>S/. {totalRecaudado.toLocaleString()}</strong> recaudados en campañas activas
        </span>
        <span>
          📋 <strong>{filtered.length}</strong>{' '}
          {filtered.length === 1 ? 'campaña encontrada' : 'campañas encontradas'}
        </span>
      </div>

      {/* ── Lista de campañas o mensaje vacío ── */}
      {filtered.length === 0 ? (

        <div className="donations-empty">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
          <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-dark)' }}>
            No hay campañas con ese criterio
          </p>
          <p style={{ fontSize: '0.9rem', marginTop: '6px', color: 'var(--text-light)' }}>
            Prueba con otra categoría o quita el filtro de estado
          </p>
        </div>

      ) : (

        <div className="donations-grid">
          {filtered.map(c => {
            // Porcentaje recaudado respecto a la meta (máximo 100%)
            const pct = Math.min(100, Math.round((c.actual / c.meta) * 100));
            const lograda = c.badge === '¡Lograda!';

            return (
              // Click en la tarjeta abre el modal de detalles
              <div
                key={c.id}
                className={`donations-card card-clickable ${lograda ? 'donations-card--done' : ''}`}
                onClick={() => setSelectedCampaña(c)}
              >
                {/* Fila superior: badge de estado, urgencia y categoría */}
                <div className="donations-card-top">
                  <div className="donations-card-tags">
                    <span className={`campaign-badge ${c.badgeClass}`}>{c.badge}</span>
                    {c.urgent && <span className="donations-urgent-tag">🔥 Urgente</span>}
                  </div>
                  <span className="donations-card-category">{c.category}</span>
                </div>

                <h3 className="donations-card-name">{c.name}</h3>
                <p className="donations-card-desc">{c.desc}</p>

                {/* Enlace a la ONG — stopPropagation evita que también abra el modal */}
                <button
                  className="donations-card-ong-link"
                  onClick={e => { e.stopPropagation(); navigate(`/perfil/${c.ongId}`); }}
                >
                  {c.ongName} · 📍 {c.location}
                </button>

                {/* Barra de progreso de recaudación */}
                <div className="donations-progress">
                  <div className="donations-progress-bar-bg">
                    <div
                      className="donations-progress-bar-fill"
                      style={{ width: `${pct}%`, backgroundColor: lograda ? 'var(--green-light)' : 'var(--green-mid)' }}
                    />
                  </div>
                  <div className="donations-progress-labels">
                    <span>S/. {c.actual.toLocaleString()} recaudados</span>
                    <span className="donations-pct">{pct}%</span>
                  </div>
                  <div className="donations-meta-label">
                    Meta: <strong>S/. {c.meta.toLocaleString()}</strong>
                  </div>
                </div>

                {/* Botón que abre el modal (el flujo de donación está dentro del modal) */}
                <button
                  className={`donations-btn ${lograda ? 'donations-btn--done' : ''}`}
                  disabled={lograda}
                  onClick={e => { e.stopPropagation(); setSelectedCampaña(c); }}
                >
                  {lograda ? '✓ Meta alcanzada' : '❤️ Donar ahora'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de detalles — se muestra solo cuando hay una campaña seleccionada */}
      {selectedCampaña && (
        <CampaignDetailModal
          key={selectedCampaña.id}
          campaña={selectedCampaña}
          user={user}
          onDonate={onDonate}
          onClose={() => setSelectedCampaña(null)}
        />
      )}
    </div>
  );
}
