import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data.json';
import CampaignDetailModal from '../components/CampaignDetailModal';

const ESTADOS = ['Todas', 'Activas', 'Logradas'];

export default function DonationsScreen({ campañas = [], user, onDonate }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [activeEstado, setActiveEstado] = useState('Todas');
  const [selectedCampaña, setSelectedCampaña] = useState(null);

  const filtered = campañas.filter(function(c) {
    const textoBuscado = query.toLowerCase();
    const coincideTexto =
      c.name.toLowerCase().includes(textoBuscado) ||
      c.desc.toLowerCase().includes(textoBuscado) ||
      c.ongName.toLowerCase().includes(textoBuscado);

    const coincideCategoria = activeCategory === 'Todas' || c.category === activeCategory;

    let coincideEstado = false;
    if (activeEstado === 'Todas') {
      coincideEstado = true;
    } else if (activeEstado === 'Activas' && c.badge === 'Activa') {
      coincideEstado = true;
    } else if (activeEstado === 'Logradas' && c.badge === '¡Lograda!') {
      coincideEstado = true;
    }

    return coincideTexto && coincideCategoria && coincideEstado;
  });

  let totalRecaudado = 0;
  const campanasActivas = campañas.filter(c => c.badge === 'Activa');
  for (let i = 0; i < campanasActivas.length; i++) {
    totalRecaudado += campanasActivas[i].actual;
  }

  return (
    <div className="fade-in donations-wrapper">

      <header className="donations-header">
        <h1 className="donations-title">Donaciones</h1>
        <p className="donations-subtitle">
          Elige una campaña y contribuye directamente a quienes más lo necesitan.
        </p>

        {user && user.role !== 'ong' && (
          <div className="donations-saldo-badge">
            💰 Tu saldo: S/. {(user.creditos || 0).toLocaleString()}
          </div>
        )}

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

      <div className="donations-stats-bar">
        <span>
          💰 <strong>S/. {totalRecaudado.toLocaleString()}</strong> recaudados en campañas activas
        </span>
        <span>
          📋 <strong>{filtered.length}</strong>{' '}
          {filtered.length === 1 ? 'campaña encontrada' : 'campañas encontradas'}
        </span>
      </div>

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
            const pct = Math.min(100, Math.round((c.actual / c.meta) * 100));
            const lograda = c.badge === '¡Lograda!';

            return (
              <div
                key={c.id}
                className={`donations-card card-clickable ${lograda ? 'donations-card--done' : ''}`}
                onClick={() => setSelectedCampaña(c)}
              >
                <div className="donations-card-top">
                  <div className="donations-card-tags">
                    <span className={`campaign-badge ${c.badgeClass}`}>{c.badge}</span>
                    {c.urgent && <span className="donations-urgent-tag">🔥 Urgente</span>}
                  </div>
                  <span className="donations-card-category">{c.category}</span>
                </div>

                <h3 className="donations-card-name">{c.name}</h3>
                <p className="donations-card-desc">{c.desc}</p>

                <button
                  className="donations-card-ong-link"
                  onClick={e => { e.stopPropagation(); navigate(`/perfil/${c.ongId}`); }}
                >
                  {c.ongName} · 📍 {c.location}
                </button>

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
