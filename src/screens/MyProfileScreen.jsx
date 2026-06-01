import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ongs, campañas } from '../data.json';
import ProfilePhotoModal from '../components/ProfilePhotoModal.jsx';
import SeguimientoScreen from '../components/SeguimientoScreen.jsx';

export default function MyProfileScreen({ user }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('actividad');

    // Estado para la foto y el modal 
    const defaultFotoUrl = user?.email?.toLowerCase() === 'amante.de.gatitos55@example.com'
        ? "https://img.buzzfeed.com/buzzfeed-static/static/2025-03/13/18/subbuzz/UjLcjUoUE0.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto"
        : '';


    let initialFoto = defaultFotoUrl;

    try {
        const stored = JSON.parse(localStorage.getItem('registeredUser'));
        if (stored && stored.email && user?.email && stored.email.toLowerCase() === user.email.toLowerCase() && stored.photoUrl) {
            initialFoto = stored.photoUrl;
        }
    } catch (e) {

    }

    const [fotoUrl, setFotoUrl] = useState(initialFoto);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [photoInput, setPhotoInput] = useState('');

    function saveProfilePhoto(url) {
        setFotoUrl(url);

        try {
            const stored = JSON.parse(localStorage.getItem('registeredUser')) || null;
            if (stored && stored.email && user?.email && stored.email.toLowerCase() === user.email.toLowerCase()) {
                stored.photoUrl = url;
                localStorage.setItem('registeredUser', JSON.stringify(stored));
            }
        } catch (e) {

        }
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Datos de gatito55
    const isDefaultProfile = user.email?.toLowerCase() === 'amante.de.gatitos55@example.com'; 

    const usuarioLogueado = {
        fullName: user.fullName || user.username || (user.email || '').split('@')[0],
        username: user.username || (user.email || '').split('@')[0],
        biografia: isDefaultProfile ? "Lo que disfruto es poder ayudar a la gente" : '',        
        fotoUrl: isDefaultProfile ? defaultFotoUrl : '',
        bannerUrl: "https://www.revista-ballesol.com/wp-content/uploads/2024/02/ONG-840x559.jpg", // Imagen de fondo para el banner
        ongsSeguidasIds: [1, 3],             
    };



    // Filtracion de las ONGs
    const misOngsAyudadas = ongs.filter(ong => usuarioLogueado.ongsSeguidasIds.includes(ong.id));

    // Campaña reciente de user
    const campañaReciente = campañas[0];

    return (
        <div className="profile-dashboard">
            <h1 className="profile-page-title">Mi perfil</h1>
            {/* BANNER DE USUARIO */}
            <div className="profile-hero">
                <div className="profile-banner" style={{ backgroundImage: `url(${usuarioLogueado.bannerUrl})` }}></div>

                <div className="profile-info-strip">
                    <div className="profile-avatar-container">
                        {fotoUrl ? (
                            <img src={fotoUrl} alt="Avatar" className="profile-avatar" />
                        ) : (
                            <div className="profile-avatar profile-avatar-empty" aria-label="Avatar vacío"></div>
                        )}

                        <button
                            className="profile-btn-edit-photo"
                            title="Cambiar foto de perfil"
                            onClick={() => {
                                setPhotoInput(fotoUrl || '');
                                setShowPhotoModal(true);
                            }}
                        >
                            +
                        </button>
                    </div>

                    <div className="profile-text">
                        <h2>{usuarioLogueado.fullName}</h2>
                        {usuarioLogueado.biografia ? (
                            <p>"{usuarioLogueado.biografia}"</p>
                        ) : null}
                    </div>
                </div>
            </div>

            <ProfilePhotoModal
                isOpen={showPhotoModal}
                initialUrl={photoInput}
                onClose={() => setShowPhotoModal(false)}
                onSave={(url) => {
                    saveProfilePhoto(url);
                    setShowPhotoModal(false);
                }}
            />

            {/* uso de useState */}
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

            {/* Segmentos */}
            {activeTab === 'actividad' && (
                <div className="dashboard-grid">

                    {/* BLOQUE IZQUIERDO: ONGs Ayudadas*/}
                    <div className="dashboard-section ongs-ayudadas-box">
                        <h3>ONG ayudadas:</h3>

                        <div className="ongs-list">
                            {misOngsAyudadas.map((ong) => (
                                <div key={ong.id} className="ong-row-item">
                                    <div className="ong-row-left">                                        
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

                    {/* BLOQUE DERECHO: Campaña más reciente*/}
                    {campañaReciente && (
                        <div className="dashboard-section campaña-reciente-box">
                            <span className="section-subtitle">Campaña más reciente:</span>
                            <h3>{campañaReciente.name}</h3>
                            
                            <div className="campaña-preview-card">
                                <div className="campaña-image-placeholder">
                                    <img
                                        src="https://www.rcrperu.com/wp-content/uploads/2024/10/200-ARBOLES-FUERON-PLANTADOS-EN-CARABAYLLO-GRACIAS-A-CAMPANA-DE-REFORESTACION-DE-LENOVO-Y-ONG-RECICLA-LATAM.png"
                                        alt="Equipo reunido para la campaña"
                                    />
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
                <SeguimientoScreen user={user} />
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