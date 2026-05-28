import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { voluntariados, categories } from '../data.json';
import VoluntariadoDetailModal from '../components/VoluntariadoDetailModal';

// Opciones para el filtro de modalidad
const MODALIDADES = ['Todas', 'Presencial', 'Virtual', 'Híbrido'];

// Iconos asociados a cada modalidad
const MODALIDAD_ICON = {
  Presencial: '📍',
  Virtual:    '💻',
  Híbrido:    '🔄',
};

export default function VoluntariadoScreen() {
  const navigate = useNavigate();

  // Estado del buscador de texto libre
  const [query, setQuery] = useState('');
  // Categoría activa en los filtros (ej: Educación, Medio ambiente, etc.)
  const [activeCategory, setActiveCategory] = useState('Todas');
  // Modalidad activa: Todas / Presencial / Virtual / Híbrido
  const [activeModalidad, setActiveModalidad] = useState('Todas');
  // Voluntariado seleccionado para mostrar el popup de detalles
  const [selectedVol, setSelectedVol] = useState(null);

  // Filtramos los voluntariados según búsqueda, categoría y modalidad
  const filtered = voluntariados.filter(function(v) {
    // Texto buscado en minúsculas para no depender de mayúsculas
    const textoBuscado = query.toLowerCase();
    const coincideTexto =
      v.name.toLowerCase().includes(textoBuscado) ||
      v.desc.toLowerCase().includes(textoBuscado) ||
      v.ongName.toLowerCase().includes(textoBuscado);

    // Verificamos si la categoría del filtro coincide
    const coincideCategoria = activeCategory === 'Todas' || v.category === activeCategory;

    // Verificamos si la modalidad del filtro coincide
    const coincideModalidad = activeModalidad === 'Todas' || v.modalidad === activeModalidad;

    // El voluntariado aparece solo si pasa los tres filtros
    return coincideTexto && coincideCategoria && coincideModalidad;
  });

  // Calculamos los cupos disponibles sumando todos los voluntariados activos
  let totalCuposLibres = 0;
  const voluntariadosActivos = voluntariados.filter(v => v.badge === 'Activo');
  for (let i = 0; i < voluntariadosActivos.length; i++) {
    totalCuposLibres += voluntariadosActivos[i].cupos - voluntariadosActivos[i].cuposOcupados;
  }

  return (
    <div className="fade-in vol-wrapper">

      {/* ── Cabecera: título, buscador y filtros ── */}
      <header className="donations-header">
        <h1 className="donations-title">Voluntariado</h1>
        <p className="donations-subtitle">
          Encuentra oportunidades para contribuir con tu tiempo y habilidades.
        </p>

        {/* Buscador de texto */}
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

        {/* Filtros: botones de categoría y de modalidad */}
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

          {/* Botones de modalidad: Todas / Presencial / Virtual / Híbrido */}
          <div className="donations-estado-tabs">
            {MODALIDADES.map(m => (
              <button
                key={m}
                className={`donations-estado-btn ${activeModalidad === m ? 'active' : ''}`}
                onClick={() => setActiveModalidad(m)}
              >
                {/* Si es "Todas" no mostramos ícono, si no, añadimos el ícono delante */}
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

      {/* ── Grilla de tarjetas (o mensaje vacío si no hay resultados) ── */}
      {filtered.length === 0 ? (
        // Mensaje cuando no hay voluntariados que coincidan con el filtro
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
            // Cupos que aún no han sido ocupados
            const cuposLibres = v.cupos - v.cuposOcupados;
            // Porcentaje de cupos ya ocupados (para la barra de progreso)
            const pctOcupado = Math.round((v.cuposOcupados / v.cupos) * 100);
            // true si el voluntariado no tiene más cupos disponibles
            const lleno = v.badge === 'Lleno' || cuposLibres <= 0;
            // Fecha formateada en español (ej: "3 de junio de 2025")
            const fechaFormateada = new Date(v.fechaInicio).toLocaleDateString('es-PE', {
              day: 'numeric', month: 'long', year: 'numeric',
            });
            // Texto que muestra cuántos cupos hay libres (en singular o plural)
            const textoCupos = cuposLibres === 1 ? '1 cupo libre' : `${cuposLibres} cupos libres`;

            return (
              // Al hacer clic en la tarjeta se abre el popup de detalles
              <div
                key={v.id}
                className={`donations-card card-clickable ${lleno ? 'donations-card--done' : ''}`}
                onClick={() => setSelectedVol(v)}
              >

                {/* Parte superior: badge de estado, modalidad y categoría */}
                <div className="donations-card-top">
                  <div className="donations-card-tags">
                    <span className={`campaign-badge ${v.badgeClass}`}>{v.badge}</span>
                    <span className="vol-modalidad-tag">
                      {MODALIDAD_ICON[v.modalidad]} {v.modalidad}
                    </span>
                  </div>
                  <span className="donations-card-category">{v.category}</span>
                </div>

                {/* Nombre y descripción breve */}
                <h3 className="donations-card-name">{v.name}</h3>
                <p className="donations-card-desc">{v.desc}</p>

                {/* Enlace a la ONG — stopPropagation evita que también se abra el popup */}
                <button
                  className="donations-card-ong-link"
                  onClick={e => { e.stopPropagation(); navigate(`/perfil/${v.ongId}`); }}
                >
                  {v.ongName} · 📍 {v.location}
                </button>

                {/* Fecha de inicio y duración del voluntariado */}
                <div className="vol-meta-row">
                  <span className="vol-meta-item">📅 Inicio: <strong>{fechaFormateada}</strong></span>
                  <span className="vol-meta-item">⏱ Duración: <strong>{v.duracion}</strong></span>
                </div>

                {/* Barra de progreso de cupos ocupados */}
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

                {/* Botón de postulación — se desactiva si el voluntariado está lleno */}
                <button
                  className={`donations-btn ${lleno ? 'donations-btn--done' : 'vol-btn-postular'}`}
                  disabled={lleno}
                  onClick={e => e.stopPropagation()}
                >
                  {lleno ? '✓ Sin cupos disponibles' : '🤝 Postularme'}
                </button>

              </div>
            );
          })}
        </div>
      )}

      {/* Popup de detalles — solo se muestra cuando el usuario selecciona un voluntariado */}
      {selectedVol && (
        <VoluntariadoDetailModal
          voluntariado={selectedVol}
          onClose={() => setSelectedVol(null)}
        />
      )}
    </div>
  );
}
