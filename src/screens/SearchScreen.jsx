// ─────────────────────────────────────────────────────────────
// SearchScreen.jsx  —  Pantalla "Buscar ONGs"
//
// COMPONENTE USADO:
//   • OngCard  →  muestra la tarjeta visual de cada ONG
//
// DATOS (data.json):
//   • ongs       →  lista de todas las organizaciones
//   • categories →  categorías para los botones de filtro
// ─────────────────────────────────────────────────────────────

// CONECTADO AL BACKEND:
// Antes las ONGs venían fijas de data.json. Ahora se piden al backend
// (a la API) apenas se abre esta pantalla, para que siempre se vea la
// lista real que hay guardada en la base de datos.
import React, { useState, useEffect } from 'react';
import { categories } from '../data.json';
import { api } from '../api';
import OngCard from '../components/OngCard';

export default function SearchScreen() {

  // Aquí vamos a guardar la lista de ONGs que nos responda el backend.
  // Arranca vacía porque todavía no hemos recibido la respuesta.
  const [ongs, setOngs] = useState([]);

  // useEffect con [] vacío al final = "ejecuta esto una sola vez,
  // apenas se muestra la pantalla". Le pedimos al backend la lista
  // de ONGs (GET /api/ongs) y la guardamos con setOngs.
  useEffect(() => {
    api.get('/ongs').then(function (respuesta) {
      setOngs(respuesta);
    });
  }, []);

  // Texto que el usuario escribe en el buscador
  const [query, setQuery] = useState('');

  // Categoría seleccionada en los botones de filtro
  const [activeFilter, setActiveFilter] = useState('Todas');

  // ── Filtrado ──────────────────────────────────────────────
  // Una ONG aparece en los resultados si:
  //   1. Coincide con el texto buscado (nombre, descripción o etiquetas)
  //   2. Pertenece a la categoría seleccionada (o se eligió "Todas")
  const filtered = ongs.filter(o => {
    const texto = query.toLowerCase();

    const coincideTexto =
      o.name.toLowerCase().includes(texto) ||
      o.desc.toLowerCase().includes(texto) ||
      o.tags.some(t => t.toLowerCase().includes(texto));

    const coincideCategoria =
      activeFilter === 'Todas' ||
      o.tags.some(t => t.toLowerCase() === activeFilter.toLowerCase());

    return coincideTexto && coincideCategoria;
  });

  return (
    <div className="fade-in">

      {/* ── Cabecera: título + buscador + filtros ── */}
      <header className="search-header">
        <h1 className="search-title">Descubre Organizaciones</h1>
        <p className="search-subtitle">Encuentra iniciativas alineadas a tus valores.</p>

        {/* Campo de búsqueda libre */}
        <div className="search-box-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre, causa o palabra clave..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Botones de filtro por categoría (vienen del JSON) */}
        <div className="filter-tags">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* ── Resultados ── */}
      {filtered.length === 0 ? (

        // Mensaje cuando no hay resultados
        <div className="donations-empty">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
          <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-dark)' }}>
            No encontramos ONGs con ese criterio
          </p>
          <p style={{ fontSize: '0.9rem', marginTop: '6px', color: 'var(--text-light)' }}>
            Intenta con otra palabra clave o cambia de categoría
          </p>
        </div>

      ) : (

        // Grilla de tarjetas — cada tarjeta es el componente OngCard
        <div className="cards-grid">
          {filtered.map(o => (
            <OngCard key={o.id} o={o} />
          ))}
        </div>

      )}
    </div>
  );
}
