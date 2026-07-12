import React, { useState, useEffect } from 'react';
import { categories } from '../data.json';
import { api } from '../api';
import OngCard from '../components/OngCard';

export default function SearchScreen() {

  const [ongs, setOngs] = useState([]);

  useEffect(() => {
    api.get('/ongs').then(function (respuesta) {
      setOngs(respuesta);
    });
  }, []);

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todas');

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

      <header className="search-header">
        <h1 className="search-title">Descubre Organizaciones</h1>
        <p className="search-subtitle">Encuentra iniciativas alineadas a tus valores.</p>

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

      {filtered.length === 0 ? (

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

        <div className="cards-grid">
          {filtered.map(o => (
            <OngCard key={o.id} o={o} />
          ))}
        </div>

      )}
    </div>
  );
}
