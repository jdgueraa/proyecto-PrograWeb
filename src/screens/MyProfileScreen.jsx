import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import ProfilePhotoModal from '../components/ProfilePhotoModal.jsx';
import SeguimientoScreen from '../components/SeguimientoScreen.jsx';
import NewCredits from '../components/NewCredits.jsx';

// user y onUpdateUser vienen de App.jsx:
//   • user           → el usuario logueado, ya resuelto por GET /api/me
//                       (incluye ongsSeguidas, donaciones e historialVoluntariados
//                       de verdad, para CUALQUIER usuario, no solo el de demo).
//   • onUpdateUser    → función que guarda cambios propios con PUT /api/me
//                       (la usamos para la foto de perfil).
export default function MyProfileScreen({ user, onUpdateUser }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('actividad');

    // La foto ahora vive en la base de datos (user.photoUrl), no en
    // localStorage — si el usuario nunca subió una, arranca vacía.
    const [fotoUrl, setFotoUrl] = useState(user?.photoUrl || '');
    const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [photoInput, setPhotoInput] = useState('');

    // Guarda la foto nueva: la mostramos de inmediato (setFotoUrl) y
    // además le pedimos al backend que la guarde de verdad con PUT /api/me.
    function saveProfilePhoto(url) {
        setFotoUrl(url);
        onUpdateUser({ photoUrl: url });
    }

    function saveNewCredits(credits) {        
        onUpdateUser({ creditos: user.creditos + credits });
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Datos básicos del usuario logueado, ya reales (antes esto era un
    // objeto armado a mano solo para el usuario demo "gatitos55").
    const usuarioLogueado = {
        fullName: user.fullName || user.username || (user.email || '').split('@')[0],
        biografia: user.biografia || '',
        bannerUrl: "https://www.revista-ballesol.com/wp-content/uploads/2024/02/ONG-840x559.jpg",
    };

    // ONGs que el usuario sigue. GET /api/me ya devuelve esta lista
    // filtrada desde el backend (tabla OngSeguidores) — no hay que
    // buscar ni filtrar nada aquí.
    const misOngsAyudadas = user.ongsSeguidas || [];

    // Campaña más reciente: la campaña de la última donación que hizo
    // el usuario (ordenamos sus donaciones por fecha, la más nueva primero).
    const donacionesOrdenadas = [...(user.donaciones || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const campañaReciente = donacionesOrdenadas[0]?.campana || null;
    // ¿Ya alcanzó la meta? Lo calculamos aquí mismo porque el backend
    // no guarda un campo "badge" fijo — se recalcula siempre a partir
    // de actual vs meta (así nunca queda desactualizado).
    const campañaRecienteLograda = campañaReciente
        ? campañaReciente.actual >= campañaReciente.meta
        : false;

    // Historial de voluntariado (horas ya cumplidas). Cada item ya
    // incluye su ONG completa (item.ong: name, location, mision).
    const misvoluntariado = user.historialVoluntariados || [];

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

                    { activeTab !== 'seguimiento' ? (
                        <div className="tarjeta-creditos">
                            <p className="tarjeta-creditos-titulo">
                                Mis Créditos Disponibles
                            </p>
                            <h2 className="tarjeta-creditos-monto">
                                S/. {user.creditos}
                            </h2>

                            {/* El botón posicionado */}
                            <button 
                                className="btn-aumentar-creditos"
                                onClick={() => {
                                setIsCreditsModalOpen(true);
                                }}
                                title="Aumentar créditos"
                            >
                                +
                            </button>
                        </div> 
                    ) : (
                        <button 
                            className="btn-solo-aumentar"
                            onClick={() => setIsCreditsModalOpen(true)}
                            >
                            Aumentar créditos
                        </button>
                        ) 
                    }
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

            <NewCredits                
                isOpen={isCreditsModalOpen} 
                onClose={() => setIsCreditsModalOpen(false)} 
                onSave={(credits) => {
                    saveNewCredits(credits);
                    setIsCreditsModalOpen(false);
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
                        {misOngsAyudadas.length > 0 ? (
                            <div>
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
                            </div>) : (
                            <div className="dashboard-section empty-state">
                                <h3>Aún no has apoyado a ninguna ONG</h3>
                                <p>Para poder demostrar que ONG sigues, haz click en el siguiente botón para encontrar a quién ayudar</p>
                                <button className="home-screen-principal-btn" onClick={() => navigate('/buscar')}>
                                    ✨ ¡Busca ahora!
                                </button>
                            </div>
                        )}


                    </div>

                    {/* BLOQUE DERECHO: Campaña más reciente*/}
                    {campañaReciente ? (
                        <div className="dashboard-section campaña-reciente-box">
                            <span className="section-subtitle">Campaña más reciente:</span>
                            <h3>{campañaReciente.name}</h3>
                            <div className="campaña-preview-card">
                                <div className="campaña-image-placeholder">
                                    <img
                                        src={campañaReciente.imagen || "https://www.rcrperu.com/wp-content/uploads/2024/10/200-ARBOLES-FUERON-PLANTADOS-EN-CARABAYLLO-GRACIAS-A-CAMPANA-DE-REFORESTACION-DE-LENOVO-Y-ONG-RECICLA-LATAM.png"}
                                        alt="Imagen de la campaña"
                                    />
                                </div>

                                <div className="campaña-stats-summary">
                                    <span className={`badge ${campañaRecienteLograda ? 'badge-success' : 'badge-active'}`}>
                                        {campañaRecienteLograda ? '¡Lograda!' : 'Activa'}
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
                                <button className="ver-mas-btn" onClick={() => navigate(`/perfil/${campañaReciente.ongId}`)}>Ver más</button>
                            </div>
                        </div>) : (
                        <div className="dashboard-section empty-state">
                            <h3>Aún no participas en ninguna campaña</h3>
                            <p>Para poder visualizar tu campaña más reciente, debes adentrarte en la comunidad</p>
                            <button className="home-screen-principal-btn" onClick={() => navigate('/voluntariado')}>
                                ✨ ¡Súmate a una causa ahora!
                            </button>
                        </div>
                    )
                    }

                </div>
            )}

            {activeTab === 'seguimiento' && (
                <SeguimientoScreen user={user} />
            )}

            {activeTab === 'voluntariados' && (
                misvoluntariado.length > 0 ? (
                    <div className="dashboard-section voluntariado-box">
                        {misvoluntariado.map((item) => (
                            <div key={item.id} className="tarjeta-cv">
                                <div className="tarjeta-cv-header">
                                    <h3 className="tarjeta-cv-title">🏢 {item.ong?.name}</h3>
                                </div>
                                <div className="tarjeta-cv-body">
                                    <p className="tarjeta-cv-info">
                                        <strong> Locación:</strong> {item.ong?.location || "No especificada"}
                                    </p>
                                    <p className="tarjeta-cv-info tarjeta-cv-mision">
                                        <strong> Misión:</strong> {item.ong?.mision || "No especificada"}
                                    </p>
                                    <p className="tarjeta-cv-info">
                                        <strong> Fecha de participación:</strong> {item.fechaParticipacion}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="dashboard-section empty-state">
                        <h3>Aún no cuentas con un historial de voluntariado</h3>
                        <p>Ve a la página principal de voluntariados</p>
                        <button className="home-screen-principal-btn" onClick={() => navigate('/voluntariado')}>
                            ✨ ¡Postúlate!
                        </button>
                    </div>
                )
            )}
        </div>
    );
}
