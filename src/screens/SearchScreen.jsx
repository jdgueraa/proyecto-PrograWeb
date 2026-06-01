// src/screens/SearchScreen.jsx
import React, { useState } from 'react';
import { ongs, categories } from '../data.json';
import OngCard from '../components/OngCard'; 

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todas");

  // Lógica de filtrado por buscador y por botones de categorías
  const filtered = ongs.filter(o => {
    const matchQ = o.name.toLowerCase().includes(query.toLowerCase()) ||
                  o.desc.toLowerCase().includes(query.toLowerCase()) ||
                  o.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
                  
    const matchF = activeFilter === "Todas" || o.tags.some(t => t.toLowerCase() === activeFilter.toLowerCase());
    
    return matchQ && matchF;
  });

  return (
    <div className="fade-in">
      {/* Cabecera de la pantalla */}
      <header className="search-header">
        <h1 className="search-title">Descubre Organizaciones</h1>
        <p className="search-subtitle">Encuentra iniciativas alineadas a tus valores.</p>
        
        {/* Input del buscador */}
        <div className="search-box-container">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Buscar por nombre, causa o palabra clave..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Botones de Filtros por Categoría */}
        <div className="filter-tags">
          {categories.map(c => (
            <button 
              key={c} 
              className={`filter-btn ${activeFilter === c ? "active" : ""}`}
              onClick={() => setActiveFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      {/* Grilla de resultados que renderiza los cuadros que se repiten */}
      <div className="cards-grid">
        {filtered.map(o => (
          <OngCard key={o.id} o={o} />
        ))}
      </div>

      {/* Mensaje de alerta si la búsqueda queda vacía */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-light)" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🌿</div>
          <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-dark)" }}>
            No encontramos ONGs con ese criterio
          </p>
          <p style={{ fontSize: "0.9rem", marginTop: "6px" }}>
            Intenta con otra palabra clave o cambia de categoría
          </p>
        </div>
      )}
    </div>
  );
}