import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ongs, campañas } from '../data'; // Asegúrate de que la ruta a tu data.jsx sea correcta

export default function MyProfileScreen() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('actividad');

    // Datos simulados del perfil del usuario actual (puedes cambiarlos luego)
    const usuarioLogueado = {
        username: "AmanteDeGatitos55",
        biografia: "Lo que disfruto es poder ayudar a la gente",
        fotoUrl: "https://img.buzzfeed.com/buzzfeed-static/static/2025-03/13/18/subbuzz/UjLcjUoUE0.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto", // Un lindo gatito temporal para tu diseño
        bannerUrl: "https://www.revista-ballesol.com/wp-content/uploads/2024/02/ONG-840x559.jpg", // Imagen de fondo para el banner
        // Simulamos que el usuario sigue a las ONGs con ID 1 y 3 de tu data.jsx
        ongsSeguidasIds: [1, 3],
    };

    // Filtramos las ONGs reales que coinciden con las que el usuario ayuda
    const misOngsAyudadas = ongs.filter(ong => usuarioLogueado.ongsSeguidasIds.includes(ong.id));

    // Tomamos la campaña más reciente (la primera de tu arreglo en data.jsx)
    const campañaReciente = campañas[0];

    return (
        <div className="profile-dashboard">
            <h1>Mi perfil</h1>
            {/* BANNER Y DETALLES DE USUARIO */}
            <div className="profile-hero">
                <div className="profile-banner" style={{ backgroundImage: `url(${usuarioLogueado.bannerUrl})` }}></div>
                <div className="profile-info-strip">
                    <div className="profile-avatar-container">
                        <img src={usuarioLogueado.fotoUrl} alt="Avatar" className="profile-avatar" />
                        <button className="profile-btn-edit-photo" title="Cambiar foto de perfil">
                            +
                        </button>
                    </div>
                    <div className="profile-text">
                        <h2>{usuarioLogueado.username}</h2>
                        <p>"{usuarioLogueado.biografia}"</p>
                    </div>
                </div>
            </div>

            {/* MENÚ DE APARTADOS TIPO DASHBOARD */}
            <div className="dashboard-tabs">
                <button className={`tab-btn ${activeTab === 'actividad' ? 'active' : ''}`} onClick={() => setActiveTab('actividad')}>
                    Mi Actividad
                </button>
                <button className={`tab-btn ${activeTab === 'seguimiento' ? 'active' : ''}`} onClick={() => setActiveTab('seguimiento')}>
                    Seguimiento
                </button>
                <button className={`tab-btn ${activeTab === 'voluntariados' ? 'active' : ''}`} onClick={() => setActiveTab('voluntariados')}>
                    Mis Voluntariados
                </button>
            </div>

            {/* CONTENIDO DINÁMICO SEGÚN LA PESTAÑA */}
            {activeTab === 'actividad' && (
                <div className="dashboard-grid">

                    {/* BLOQUE IZQUIERDO: ONGs Ayudadas (Tu Boceto) */}
                    <div className="dashboard-section ongs-ayudadas-box">
                        <h3>ONG ayudadas:</h3>
                        <div className="ongs-list">
                            {misOngsAyudadas.map((ong) => (
                                <div key={ong.id} className="ong-row-item">
                                    <div className="ong-row-left">
                                        {/* Usamos el emoji que definieron en su base de datos */}
                                        <div className="ong-row-emoji" style={{ backgroundColor: ong.color }}>
                                            {ong.emoji}
                                        </div>
                                        <div className="ong-row-details">
                                            <h4>{ong.name}</h4>
                                            <p>{ong.location}</p>
                                        </div>
                                    </div>
                                    <button className="ver-perfil-link" onClick={() => navigate(`/perfil/${ong.id}`)}>
                                        Ver perfil
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BLOQUE DERECHO: Campaña más reciente (Tu Boceto) */}
                    {campañaReciente && (
                        <div className="dashboard-section campaña-reciente-box">
                            <span className="section-subtitle">Campaña más reciente:</span>
                            <h3>{campañaReciente.name}</h3>

                            {/* Card o bloque visual de la campaña */}
                            <div className="campaña-preview-card">
                                <div className="campaña-image-placeholder">
                                    <img src="https://www.rcrperu.com/wp-content/uploads/2024/10/200-ARBOLES-FUERON-PLANTADOS-EN-CARABAYLLO-GRACIAS-A-CAMPANA-DE-REFORESTACION-DE-LENOVO-Y-ONG-RECICLA-LATAM.png" alt="Equipo reunida para la campaña 🌱" />
                                </div>
                                <div className="campaña-stats-summary">
                                    <span className={`badge ${campañaReciente.badgeClass}`}>
                                        {campañaReciente.badge}
                                    </span>
                                    <p>{campañaReciente.desc}</p>
                                    <div className="progress-bar-container">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${Math.min((campañaReciente.actual / campañaReciente.meta) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="progress-text">
                                        Recaudado: <strong>S/. {campañaReciente.actual}</strong> de S/. {campañaReciente.meta}
                                    </p>
                                </div>
                                <button className="ver-mas-btn">Ver más</button>
                            </div>
                        </div>
                    )}

                </div>
            )}

            {activeTab === 'seguimiento' && (
                <div className="dashboard-section empty-state">
                    <h3>Gráficos y Seguimiento de impacto</h3>
                    <p>Aquí verás estadísticas de cuántas horas de voluntariado o apoyo has aportado este mes.</p>
                </div>
            )}

            {activeTab === 'voluntariados' && (
                <div className="dashboard-section empty-state">
                    <h3>Mis Voluntariados Activos</h3>
                    <p>No tienes voluntariados agendados por el momento o solicitudes pendientes de cancelación.</p>
                </div>
            )}

        </div>
    );
}