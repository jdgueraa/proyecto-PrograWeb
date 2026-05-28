import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campañas, categories } from '../data.json';
import CampaignDetailModal from '../components/CampaignDetailModal';

// Opciones para el filtro de estado de la campaña
const ESTADOS = ['Todas', 'Activas', 'Logradas'];

export default function DonationsScreen() {
  const navigate = useNavigate();

  // Estado del buscador de texto libre
  const [query, setQuery] = useState('');
  // Categoría activa en los filtros (ej: Salud, Educación, etc.)
  const [activeCategory, setActiveCategory] = useState('Todas');
  // Estado activo: Todas / Activas / Logradas
  const [activeEstado, setActiveEstado] = useState('Todas');
  // Campaña seleccionada para mostrar el popup de detalles
  const [selectedCampaña, setSelectedCampaña] = useState(null);

  // Filtramos las campañas según búsqueda, categoría y estado
  const filtered = campañas.filter(function(c) {
    // Texto buscado en minúsculas para comparar sin importar mayúsculas
    const textoBuscado = query.toLowerCase();
    const coincideTexto =
      c.name.toLowerCase().includes(textoBuscado) ||
      c.desc.toLowerCase().includes(textoBuscado) ||
      c.ongName.toLowerCase().includes(textoBuscado);

    // Verificamos si la categoría del filtro coincide con la de la campaña
    const coincideCategoria = activeCategory === 'Todas' || c.category === activeCategory;

    // Verificamos si el estado del filtro coincide con el badge de la campaña
    let coincideEstado = false;
    if (activeEstado === 'Todas') {
      coincideEstado = true;
    } else if (activeEstado === 'Activas' && c.badge === 'Activa') {
      coincideEstado = true;
    } else if (activeEstado === 'Logradas' && c.badge === '¡Lograda!') {
      coincideEstado = true;
    }

    // La campaña aparece solo si pasa los tres filtros a la vez
    return coincideTexto && coincideCategoria && coincideEstado;
  });

  // Calculamos el total recaudado sumando solo las campañas activas
  let totalRecaudado = 0;
  const campanasActivas = campañas.filter(c => c.badge === 'Activa');
  for (let i = 0; i < campanasActivas.length; i++) {
    totalRecaudado += campanasActivas[i].actual;
  }

  return (
    <div className="fade-in donations-wrapper">

      {/* ── Cabecera: título, buscador y filtros ── */}
      <header className="donations-header">
        <h1 className="donations-title">Donaciones</h1>
        <p className="donations-subtitle">
          Elige una campaña y contribuye directamente a quienes más lo necesitan.
        </p>

        {/* Buscador de texto */}
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

        {/* Filtros: botones de categoría y de estado */}
        <div className="donations-filters">

          {/* Botones de categoría (vienen del archivo data.json) */}
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

          {/* Botones de estado: Todas / Activas / Logradas */}
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

      {/* ── Grilla de tarjetas (o mensaje vacío si no hay resultados) ── */}
      {filtered.length === 0 ? (
        // Mensaje cuando no hay campañas que coincidan con el filtro
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
            // true si la campaña ya alcanzó su meta
            const lograda = c.badge === '¡Lograda!';

            return (
              // Al hacer clic en la tarjeta se abre el popup de detalles
              <div
                key={c.id}
                className={`donations-card card-clickable ${lograda ? 'donations-card--done' : ''}`}
                onClick={() => setSelectedCampaña(c)}
              >

                {/* Parte superior: badge de estado, urgencia y categoría */}
                <div className="donations-card-top">
                  <div className="donations-card-tags">
                    <span className={`campaign-badge ${c.badgeClass}`}>{c.badge}</span>
                    {/* El tag "Urgente" solo aparece si la campaña tiene urgent: true */}
                    {c.urgent && <span className="donations-urgent-tag">🔥 Urgente</span>}
                  </div>
                  <span className="donations-card-category">{c.category}</span>
                </div>

                {/* Nombre y descripción breve */}
                <h3 className="donations-card-name">{c.name}</h3>
                <p className="donations-card-desc">{c.desc}</p>

                {/* Enlace a la ONG — stopPropagation evita que también se abra el popup */}
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

                {/* Botón de donar — se desactiva si la campaña ya fue lograda */}
                <button
                  className={`donations-btn ${lograda ? 'donations-btn--done' : ''}`}
                  disabled={lograda}
                  onClick={e => e.stopPropagation()}
                >
                  {lograda ? '✓ Meta alcanzada' : '❤️ Donar ahora'}
                </button>

              </div>
            );
          })}
        </div>
      )}

      {/* Popup de detalles — solo se muestra cuando el usuario selecciona una campaña */}
      {selectedCampaña && (
        <CampaignDetailModal
          campaña={selectedCampaña}
          onClose={() => setSelectedCampaña(null)}
        />
      )}
    </div>
  );
}
