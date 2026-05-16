import { useState } from "react";

// ─── Global Styles ───────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Instrument+Serif:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green-deep:   #1a6b4a;
    --green-mid:    #2d9b6f;
    --green-light:  #4ec994;
    --green-pale:   #d4f5e9;
    --teal:         #0f9f8a;
    --amber:        #f59e0b;
    --amber-light:  #fef3c7;
    --coral:        #f97316;
    --bg:           #f0faf5;
    --surface:      #ffffff;
    --border:       #c6eadb;
    --text-dark:    #0f2d1f;
    --text-mid:     #3d6b55;
    --text-light:   #7aab90;
    --shadow-sm:    0 2px 8px rgba(26,107,74,0.08);
    --shadow-md:    0 6px 24px rgba(26,107,74,0.14);
    --shadow-lg:    0 16px 48px rgba(26,107,74,0.18);
    --radius:       16px;
    --radius-sm:    10px;
  }

  body {
    font-family: 'Nunito', sans-serif;
    background: var(--bg);
    color: var(--text-dark);
    min-height: 100vh;
  }

  /* Sidebar */
  .sidebar {
    width: 72px;
    background: var(--green-deep);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    gap: 8px;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
    box-shadow: 4px 0 20px rgba(0,0,0,0.12);
  }
  .sidebar-logo {
    width: 42px; height: 42px;
    background: var(--green-light);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    margin-bottom: 12px;
  }
  .sidebar-item {
    width: 48px; height: 48px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    cursor: pointer;
    color: rgba(255,255,255,0.55);
    transition: all 0.2s;
    position: relative;
  }
  .sidebar-item:hover, .sidebar-item.active {
    background: rgba(255,255,255,0.14);
    color: #fff;
  }
  .sidebar-item.active::before {
    content: '';
    position: absolute;
    left: -3px;
    width: 4px; height: 28px;
    background: var(--green-light);
    border-radius: 0 4px 4px 0;
  }

  /* Layout */
  .app-layout {
    display: flex;
    min-height: 100vh;
  }
  .main-content {
    margin-left: 72px;
    flex: 1;
    padding: 32px 36px;
    max-width: 1100px;
  }

  /* Page header */
  .page-header {
    margin-bottom: 28px;
  }
  .page-title {
    font-family: 'Instrument Serif', serif;
    font-size: 2.1rem;
    color: var(--green-deep);
    line-height: 1.1;
  }
  .page-title span {
    color: var(--green-mid);
    font-style: italic;
  }
  .page-subtitle {
    color: var(--text-mid);
    margin-top: 4px;
    font-size: 0.95rem;
    font-weight: 600;
  }

  /* Search bar */
  .search-wrap {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
  }
  .search-input-wrap {
    flex: 1;
    position: relative;
  }
  .search-icon {
    position: absolute;
    left: 16px; top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: var(--text-light);
  }
  .search-input {
    width: 100%;
    padding: 14px 16px 14px 46px;
    border: 2px solid var(--border);
    border-radius: var(--radius);
    font-family: 'Nunito', sans-serif;
    font-size: 0.97rem;
    font-weight: 600;
    color: var(--text-dark);
    background: var(--surface);
    outline: none;
    transition: border 0.2s, box-shadow 0.2s;
  }
  .search-input:focus {
    border-color: var(--green-mid);
    box-shadow: 0 0 0 4px rgba(45,155,111,0.12);
  }
  .search-btn {
    padding: 0 28px;
    background: var(--green-deep);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-family: 'Nunito', sans-serif;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    letter-spacing: 0.3px;
  }
  .search-btn:hover { background: var(--green-mid); transform: translateY(-1px); }

  /* Filters */
  .filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 28px;
  }
  .filter-chip {
    padding: 7px 16px;
    border-radius: 999px;
    border: 2px solid var(--border);
    background: var(--surface);
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    color: var(--text-mid);
    cursor: pointer;
    transition: all 0.18s;
  }
  .filter-chip:hover { border-color: var(--green-mid); color: var(--green-mid); }
  .filter-chip.active {
    background: var(--green-deep);
    border-color: var(--green-deep);
    color: #fff;
  }

  /* Results info */
  .results-info {
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--text-light);
    margin-bottom: 18px;
  }
  .results-info strong { color: var(--green-deep); }

  /* ONG Cards Grid */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  /* ONG Card */
  .ong-card {
    background: var(--surface);
    border-radius: var(--radius);
    border: 2px solid var(--border);
    overflow: hidden;
    transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
    cursor: pointer;
  }
  .ong-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-3px);
    border-color: var(--green-light);
  }
  .ong-card-banner {
    height: 90px;
    position: relative;
    overflow: hidden;
  }
  .ong-card-avatar {
    width: 56px; height: 56px;
    border-radius: 14px;
    border: 3px solid var(--surface);
    position: absolute;
    bottom: -20px; left: 18px;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
    box-shadow: var(--shadow-sm);
  }
  .ong-card-body {
    padding: 28px 18px 18px;
  }
  .ong-card-name {
    font-weight: 800;
    font-size: 1.05rem;
    color: var(--text-dark);
    margin-bottom: 3px;
  }
  .ong-card-location {
    font-size: 0.82rem;
    color: var(--text-light);
    font-weight: 600;
    display: flex; align-items: center; gap: 4px;
    margin-bottom: 10px;
  }
  .ong-card-desc {
    font-size: 0.88rem;
    color: var(--text-mid);
    line-height: 1.55;
    margin-bottom: 14px;
    font-weight: 600;
  }
  .ong-tags {
    display: flex; flex-wrap: wrap; gap: 6px;
    margin-bottom: 14px;
  }
  .ong-tag {
    padding: 3px 10px;
    background: var(--green-pale);
    color: var(--green-deep);
    border-radius: 999px;
    font-size: 0.76rem;
    font-weight: 800;
  }
  .ong-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--border);
    padding-top: 12px;
  }
  .ong-stat {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.82rem; font-weight: 700; color: var(--text-mid);
  }
  .btn-ver {
    padding: 7px 18px;
    background: var(--green-pale);
    color: var(--green-deep);
    border: none;
    border-radius: 999px;
    font-family: 'Nunito', sans-serif;
    font-weight: 800;
    font-size: 0.83rem;
    cursor: pointer;
    transition: all 0.18s;
  }
  .btn-ver:hover {
    background: var(--green-mid);
    color: #fff;
  }

  /* ─── PROFILE SCREEN ─── */
  .profile-header-banner {
    border-radius: var(--radius);
    height: 200px;
    position: relative;
    overflow: hidden;
    margin-bottom: 0;
  }
  .profile-header-banner-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(15,159,138,0.85), rgba(26,107,74,0.9));
  }
  .profile-header-content {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 24px 28px 0;
    display: flex; align-items: flex-end; gap: 20px;
  }
  .profile-avatar {
    width: 90px; height: 90px;
    background: var(--surface);
    border-radius: 20px;
    border: 4px solid var(--surface);
    display: flex; align-items: center; justify-content: center;
    font-size: 44px;
    box-shadow: var(--shadow-md);
    flex-shrink: 0;
    transform: translateY(20px);
  }
  .profile-header-text {
    padding-bottom: 12px;
    color: #fff;
  }
  .profile-name {
    font-family: 'Instrument Serif', serif;
    font-size: 1.9rem;
    line-height: 1.1;
  }
  .profile-location-row {
    display: flex; align-items: center; gap: 14px; margin-top: 5px;
    font-size: 0.88rem; font-weight: 700; opacity: 0.85;
  }
  .profile-body {
    background: var(--surface);
    border: 2px solid var(--border);
    border-top: none;
    border-radius: 0 0 var(--radius) var(--radius);
    padding: 36px 28px 28px;
  }
  .profile-actions {
    display: flex; gap: 10px; justify-content: flex-end;
    margin-bottom: 24px;
  }
  .btn-primary {
    padding: 10px 24px;
    background: var(--green-deep);
    color: #fff;
    border: none;
    border-radius: var(--radius-sm);
    font-family: 'Nunito', sans-serif;
    font-weight: 800; font-size: 0.92rem;
    cursor: pointer;
    transition: background 0.18s;
    display: flex; align-items: center; gap: 6px;
  }
  .btn-primary:hover { background: var(--green-mid); }
  .btn-secondary {
    padding: 10px 24px;
    background: var(--surface);
    color: var(--green-deep);
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    font-family: 'Nunito', sans-serif;
    font-weight: 800; font-size: 0.92rem;
    cursor: pointer;
    transition: all 0.18s;
    display: flex; align-items: center; gap: 6px;
  }
  .btn-secondary:hover { border-color: var(--green-mid); }

  .profile-stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 28px;
  }
  .profile-stat-card {
    background: var(--bg);
    border-radius: var(--radius-sm);
    padding: 16px;
    text-align: center;
    border: 1.5px solid var(--border);
  }
  .profile-stat-num {
    font-size: 1.7rem;
    font-weight: 900;
    color: var(--green-deep);
    line-height: 1;
  }
  .profile-stat-label {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--text-light);
    margin-top: 4px;
  }

  .profile-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 24px;
  }

  .section-title {
    font-family: 'Instrument Serif', serif;
    font-size: 1.25rem;
    color: var(--green-deep);
    margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }

  /* Campaigns */
  .campaign-card {
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 16px;
    margin-bottom: 12px;
    transition: box-shadow 0.18s;
    background: var(--surface);
  }
  .campaign-card:hover { box-shadow: var(--shadow-sm); }
  .campaign-top {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 8px;
  }
  .campaign-name {
    font-weight: 800; font-size: 0.97rem; color: var(--text-dark);
  }
  .campaign-badge {
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 0.74rem;
    font-weight: 800;
  }
  .badge-active { background: var(--green-pale); color: var(--green-deep); }
  .badge-urgent { background: #fef3c7; color: #92400e; }
  .progress-bar-wrap {
    background: var(--bg);
    border-radius: 999px;
    height: 8px;
    margin: 10px 0 6px;
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--green-mid), var(--green-light));
  }
  .progress-meta {
    display: flex; justify-content: space-between;
    font-size: 0.78rem; font-weight: 700; color: var(--text-light);
  }

  /* Sidebar right */
  .info-box {
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 18px;
    margin-bottom: 16px;
  }
  .info-row {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
    font-size: 0.88rem; font-weight: 700; color: var(--text-mid);
  }
  .info-row:last-child { border-bottom: none; }
  .info-icon { font-size: 16px; }

  .post-card {
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 14px;
    margin-bottom: 10px;
    background: var(--surface);
  }
  .post-meta {
    font-size: 0.78rem; font-weight: 700; color: var(--text-light);
    margin-bottom: 6px; display: flex; align-items: center; gap: 6px;
  }
  .post-text {
    font-size: 0.88rem; font-weight: 600; color: var(--text-dark);
    line-height: 1.5;
  }

  /* Nav between screens */
  .demo-nav {
    display: flex; gap: 0;
    margin-bottom: 28px;
    background: var(--surface);
    border-radius: var(--radius-sm);
    border: 2px solid var(--border);
    overflow: hidden;
    width: fit-content;
  }
  .demo-nav-btn {
    padding: 10px 22px;
    border: none;
    background: transparent;
    font-family: 'Nunito', sans-serif;
    font-weight: 800; font-size: 0.88rem;
    color: var(--text-mid);
    cursor: pointer;
    transition: all 0.18s;
    display: flex; align-items: center; gap: 7px;
  }
  .demo-nav-btn.active {
    background: var(--green-deep);
    color: #fff;
  }

  .fade-in {
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ─── Data ────────────────────────────────────────────────────────────────────
const ongs = [
  { id: 1, emoji: "🌱", name: "Tierra Verde Perú", location: "Lima, Perú", desc: "Reforestación y conservación de ecosistemas en zonas vulnerables de la Amazonía peruana.", tags: ["Medio Ambiente", "ODS 15", "Voluntariado"], seguidores: 1240, campañas: 3, color: "#d4f5e9", banner: "linear-gradient(135deg,#2d9b6f,#0f9f8a)" },
  { id: 2, emoji: "📚", name: "Educa Contigo", location: "Cusco, Perú", desc: "Acceso a educación de calidad para niños en comunidades rurales de la sierra peruana.", tags: ["Educación", "ODS 4", "Donaciones"], seguidores: 870, campañas: 5, color: "#e0f2fe", banner: "linear-gradient(135deg,#0284c7,#0ea5e9)" },
  { id: 3, emoji: "🏥", name: "Salud Para Todos", location: "Arequipa, Perú", desc: "Brigadas médicas gratuitas y campañas de salud preventiva en zonas sin acceso a centros de salud.", tags: ["Salud", "ODS 3", "Voluntariado"], seguidores: 2100, campañas: 8, color: "#fce7f3", banner: "linear-gradient(135deg,#db2777,#f43f5e)" },
  { id: 4, emoji: "💧", name: "Agua Limpia Ya", location: "Piura, Perú", desc: "Instalación de sistemas de agua potable y saneamiento en comunidades rurales del norte.", tags: ["Agua", "ODS 6", "Infraestructura"], seguidores: 530, campañas: 2, color: "#e0f2fe", banner: "linear-gradient(135deg,#0369a1,#0ea5e9)" },
  { id: 5, emoji: "🤝", name: "Juntos Podemos", location: "Lima, Perú", desc: "Apoyo integral a familias en situación de vulnerabilidad extrema: alimentación, empleo y vivienda.", tags: ["Pobreza", "ODS 1", "Donaciones"], seguidores: 3400, campañas: 12, color: "#fef3c7", banner: "linear-gradient(135deg,#d97706,#f59e0b)" },
  { id: 6, emoji: "🌊", name: "Océanos Vivos", location: "Trujillo, Perú", desc: "Limpieza de playas, conservación marina y educación ambiental costera en el litoral peruano.", tags: ["Medio Ambiente", "ODS 14"], seguidores: 680, campañas: 4, color: "#d4f5e9", banner: "linear-gradient(135deg,#0891b2,#06b6d4)" },
];

const categories = ["Todas", "Medio Ambiente", "Educación", "Salud", "Agua", "Pobreza"];

const campañas = [
  { name: "Plantemos 10,000 árboles en Loreto", meta: 15000, actual: 11200, badge: "Activa", badgeClass: "badge-active", desc: "Reforestación urgente de zonas deforestadas por minería ilegal." },
  { name: "Kits escolares para 300 niños", meta: 8000, actual: 7400, badge: "¡Urgente!", badgeClass: "badge-urgent", desc: "Útiles y uniformes para inicio del año escolar 2025." },
  { name: "Huertos comunitarios en Ucayali", meta: 5000, actual: 2100, badge: "Activa", badgeClass: "badge-active", desc: "Seguridad alimentaria para 50 familias indígenas." },
];

// ─── Search Screen ────────────────────────────────────────────────────────────
function SearchScreen({ onVerPerfil }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todas");

  const filtered = ongs.filter(o => {
    const matchQ = o.name.toLowerCase().includes(query.toLowerCase()) ||
                   o.desc.toLowerCase().includes(query.toLowerCase()) ||
                   o.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
    const matchF = activeFilter === "Todas" || o.tags.some(t => t.includes(activeFilter));
    return matchQ && matchF;
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Buscar <span>ONGs</span></h1>
        <p className="page-subtitle">Encuentra organizaciones que comparten tu causa 🌿</p>
      </div>

      <div className="search-wrap">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Busca por nombre, causa o ubicación..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <button className="search-btn">Buscar</button>
      </div>

      <div className="filters">
        {categories.map(c => (
          <button
            key={c}
            className={`filter-chip ${activeFilter === c ? "active" : ""}`}
            onClick={() => setActiveFilter(c)}
          >{c}</button>
        ))}
      </div>

      <p className="results-info">
        Mostrando <strong>{filtered.length}</strong> organizaciones{activeFilter !== "Todas" ? ` en "${activeFilter}"` : ""}
        {query && ` para "${query}"`}
      </p>

      <div className="cards-grid">
        {filtered.map(ong => (
          <div className="ong-card" key={ong.id} onClick={() => onVerPerfil(ong)}>
            <div className="ong-card-banner" style={{ background: ong.banner }} />
            <div className="ong-card-avatar" style={{ background: ong.color }}>{ong.emoji}</div>
            <div className="ong-card-body">
              <div className="ong-card-name">{ong.name}</div>
              <div className="ong-card-location">📍 {ong.location}</div>
              <div className="ong-card-desc">{ong.desc}</div>
              <div className="ong-tags">
                {ong.tags.map(t => <span className="ong-tag" key={t}>{t}</span>)}
              </div>
              <div className="ong-card-footer">
                <div style={{ display: "flex", gap: 14 }}>
                  <span className="ong-stat">👥 {ong.seguidores.toLocaleString()}</span>
                  <span className="ong-stat">🎯 {ong.campañas} campañas</span>
                </div>
                <button className="btn-ver">Ver perfil →</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-light)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
          <p style={{ fontWeight: 800, fontSize: "1.1rem" }}>No encontramos ONGs con ese criterio</p>
          <p style={{ fontSize: "0.9rem", marginTop: 4 }}>Intenta con otra palabra clave o categoría</p>
        </div>
      )}
    </div>
  );
}

// ─── Profile Screen ───────────────────────────────────────────────────────────
function ProfileScreen({ ong, onBack }) {
  const [seguido, setSeguido] = useState(false);

  return (
    <div className="fade-in">
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--green-deep)", fontWeight: 800, fontSize: "0.92rem", marginBottom: 20, display: "flex", alignItems: "center", gap: 6, fontFamily: "Nunito, sans-serif" }}
      >
        ← Volver a búsqueda
      </button>

      {/* Banner + avatar */}
      <div className="profile-header-banner" style={{ background: ong.banner }}>
        <div className="profile-header-overlay" />
        <div className="profile-header-content">
          <div className="profile-avatar">{ong.emoji}</div>
          <div className="profile-header-text">
            <div className="profile-name">{ong.name}</div>
            <div className="profile-location-row">
              <span>📍 {ong.location}</span>
              <span>✅ ONG Verificada</span>
              <span>🕐 Miembro desde 2021</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-body">
        {/* Action buttons */}
        <div className="profile-actions">
          <button className="btn-secondary">💬 Contactar</button>
          <button className="btn-secondary">🔗 Compartir</button>
          <button className="btn-primary" onClick={() => setSeguido(!seguido)}>
            {seguido ? "✅ Siguiendo" : "➕ Seguir ONG"}
          </button>
          <button className="btn-primary" style={{ background: "var(--amber)" }}>
            ❤️ Donar ahora
          </button>
        </div>

        {/* Stats */}
        <div className="profile-stats-row">
          {[
            { num: (ong.seguidores).toLocaleString(), label: "Seguidores" },
            { num: ong.campañas, label: "Campañas activas" },
            { num: "1,240", label: "Voluntarios" },
            { num: "S/ 84K", label: "Recaudado" },
          ].map(s => (
            <div className="profile-stat-card" key={s.label}>
              <div className="profile-stat-num">{s.num}</div>
              <div className="profile-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Two column layout */}
        <div className="profile-grid">
          <div>
            {/* About */}
            <div className="info-box" style={{ marginBottom: 20 }}>
              <div className="section-title">🌿 Sobre nosotros</div>
              <p style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--text-mid)", lineHeight: 1.65 }}>
                {ong.desc} Trabajamos de la mano con comunidades locales y aliados estratégicos para generar un impacto duradero y sostenible. Nuestros proyectos están alineados con los Objetivos de Desarrollo Sostenible (ODS) de la ONU.
              </p>
              <div className="ong-tags" style={{ marginTop: 14 }}>
                {ong.tags.map(t => <span className="ong-tag" key={t}>{t}</span>)}
              </div>
            </div>

            {/* Active campaigns */}
            <div className="section-title">🎯 Campañas activas</div>
            {campañas.map(c => (
              <div className="campaign-card" key={c.name}>
                <div className="campaign-top">
                  <div className="campaign-name">{c.name}</div>
                  <span className={`campaign-badge ${c.badgeClass}`}>{c.badge}</span>
                </div>
                <p style={{ fontSize: "0.83rem", color: "var(--text-light)", fontWeight: 600 }}>{c.desc}</p>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${(c.actual / c.meta) * 100}%` }} />
                </div>
                <div className="progress-meta">
                  <span>S/ {c.actual.toLocaleString()} recaudados</span>
                  <span>Meta: S/ {c.meta.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right sidebar */}
          <div>
            <div className="info-box" style={{ marginBottom: 16 }}>
              <div className="section-title">ℹ️ Información</div>
              {[
                { icon: "📍", label: ong.location },
                { icon: "🌐", label: "www." + ong.name.toLowerCase().replace(/ /g, "") + ".org" },
                { icon: "📧", label: "contacto@ong.pe" },
                { icon: "📱", label: "+51 999 123 456" },
                { icon: "🏛️", label: "RUC: 20123456789" },
              ].map(r => (
                <div className="info-row" key={r.label}>
                  <span className="info-icon">{r.icon}</span>
                  <span>{r.label}</span>
                </div>
              ))}
            </div>

            <div className="section-title">📢 Publicaciones recientes</div>
            {[
              { time: "Hace 2 días", text: "¡Gracias a todos por apoyar nuestra última campaña de reforestación! 🌳 Superamos la meta en un 30%." },
              { time: "Hace 1 semana", text: "Buscamos voluntarios para nuestra brigada del próximo sábado en San Juan de Lurigancho. ¡Únete!" },
            ].map(p => (
              <div className="post-card" key={p.time}>
                <div className="post-meta">📌 {p.time}</div>
                <div className="post-text">{p.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────
function Sidebar({ screen }) {
  const items = [
    { icon: "🏠", label: "Inicio" },
    { icon: "🔍", label: "Buscar", id: "search" },
    { icon: "❤️", label: "Donaciones" },
    { icon: "🤝", label: "Voluntariado" },
    { icon: "👤", label: "Mi perfil" },
  ];
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">🌿</div>
      {items.map(i => (
        <div key={i.icon} className={`sidebar-item ${screen === "search" && i.id === "search" ? "active" : screen === "profile" && i.id === "search" ? "active" : ""}`} title={i.label}>
          {i.icon}
        </div>
      ))}
    </nav>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("search");
  const [selectedOng, setSelectedOng] = useState(null);

  const handleVerPerfil = (ong) => {
    setSelectedOng(ong);
    setScreen("profile");
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div className="app-layout">
        <Sidebar screen={screen} />
        <main className="main-content">
          <div className="demo-nav">
            <button className={`demo-nav-btn ${screen === "search" ? "active" : ""}`} onClick={() => setScreen("search")}>
              🔍 Pantalla: Buscar ONG
            </button>
            <button className={`demo-nav-btn ${screen === "profile" ? "active" : ""}`} onClick={() => { setSelectedOng(ongs[0]); setScreen("profile"); }}>
              🏛️ Pantalla: Perfil ONG
            </button>
          </div>

          {screen === "search" && <SearchScreen onVerPerfil={handleVerPerfil} />}
          {screen === "profile" && <ProfileScreen ong={selectedOng || ongs[0]} onBack={() => setScreen("search")} />}
        </main>
      </div>
    </>
  );
}
