import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data.json';
import VoluntariadoDetailModal from '../components/VoluntariadoDetailModal';

const MODALIDADES = ['Todas', 'Presencial', 'Virtual', 'Híbrido'];

const MODALIDAD_ICON = {
  Presencial: '📍',
  Virtual:    '💻',
  Híbrido:    '🔄',
};

export default function VoluntariadoScreen({ voluntariados = [], user, onPostular }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [activeModalidad, setActiveModalidad] = useState('Todas');
  const [selectedVol, setSelectedVol] = useState(null);

  const filtered = voluntariados.filter(function(v) {
    const textoBuscado = query.toLowerCase();
    const coincideTexto =
      v.name.toLowerCase().includes(textoBuscado) ||
      v.desc.toLowerCase().includes(textoBuscado) ||
      v.ongName.toLowerCase().includes(textoBuscado);

    const coincideCategoria = activeCategory === 'Todas' || v.category === activeCategory;
    const coincideModalidad = activeModalidad === 'Todas' || v.modalidad === activeModalidad;

    return coincideTexto && coincideCategoria && coincideModalidad;
  });

  let totalCuposLibres = 0;
  const voluntariadosActivos = voluntariados.filter(v => v.badge === 'Activo');
  for (let i = 0; i < voluntariadosActivos.length; i++) {
    totalCuposLibres += voluntariadosActivos[i].cupos - voluntariadosActivos[i].cuposOcupados;
  }

  function yaPostulado(vId) {
    if (!user?.voluntariadosPostulados) return false;
    return user.voluntariadosPostulados.some(p => p.voluntariadoId === vId);
  }

  return (
    <div className="fade-in vol-wrapper">

      <header className="donations-header">
        <h1 className="donations-title">Voluntariado</h1>
        <p className="donations-subtitle">
          Encuentra oportunidades para contribuir con tu tiempo y habilidades.
        </p>

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

      <div className="donations-stats-bar">
        <span>
          🤝 <strong>{totalCuposLibres}</strong> cupos disponibles en voluntariados activos
        </span>
        <span>
          📋 <strong>{filtered.length}</strong>{' '}
          {filtered.length === 1 ? 'oportunidad encontrada' : 'oportunidades encontradas'}
        </span>
      </div>

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
            const cuposLibres = v.cupos - v.cuposOcupados;
            const pctOcupado = Math.round((v.cuposOcupados / v.cupos) * 100);
            const lleno = v.badge === 'Lleno' || cuposLibres <= 0;
            const postulado = yaPostulado(v.id);
            const fechaFormateada = new Date(v.fechaInicio).toLocaleDateString('es-PE', {
              day: 'numeric', month: 'long', year: 'numeric',
            });
            const textoCupos = cuposLibres === 1 ? '1 cupo libre' : `${cuposLibres} cupos libres`;

            return (
              <div
                key={v.id}
                className={`donations-card card-clickable ${lleno ? 'donations-card--done' : ''}`}
                onClick={() => setSelectedVol(v)}
              >
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

                <button
                  className="donations-card-ong-link"
                  onClick={e => { e.stopPropagation(); navigate(`/perfil/${v.ongId}`); }}
                >
                  {v.ongName} · 📍 {v.location}
                </button>

                <div className="vol-meta-row">
                  <span className="vol-meta-item">📅 Inicio: <strong>{fechaFormateada}</strong></span>
                  <span className="vol-meta-item">⏱ Duración: <strong>{v.duracion}</strong></span>
                </div>

                <div className="donations-progress">
                  <div className="donations-progress-bar-bg">
                    <div
                      className="donations-progress-bar-fill"
                      style={{
                        width: `${pctOcupado}%`,
                        backgroundColor: lleno ? 'var(--green-light)' : 'var(--teal)',
                      }}
                    />
                  </div>
                  <div className="donations-progress-labels">
                    <span>{lleno ? 'Sin cupos disponibles' : textoCupos}</span>
                    <span className="donations-pct">{v.cuposOcupados}/{v.cupos}</span>
                  </div>
                </div>

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
