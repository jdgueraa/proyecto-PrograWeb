import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ongs, campañas } from '../data.json';
import ProfilePhotoModal from '../components/ProfilePhotoModal.jsx';
import SeguimientoScreen from '../components/SeguimientoScreen.jsx';

export default function MyProfileScreen({ user, onUpdateUser }) {
    const navigate = useNavigate();

    const esOng = user?.role === 'ong';

    const ongBase = ongs.find(ong => ong.id === user?.ongId);

    const [activeTab, setActiveTab] = useState(esOng ? 'perfil-ong' : 'actividad');
    const [editandoOng, setEditandoOng] = useState(false);

    const [ongForm, setOngForm] = useState({
        name: user?.ongProfile?.name || ongBase?.name || user?.fullName || '',
        location: user?.ongProfile?.location || ongBase?.location || '',
        desc: user?.ongProfile?.desc || ongBase?.desc || '',
        mision: user?.ongProfile?.mision || ongBase?.mision || '',
        email: user?.ongProfile?.email || user?.email || '',
        telefono: user?.ongProfile?.telefono || '',
        web: user?.ongProfile?.web || '',
        emoji: user?.ongProfile?.emoji || ongBase?.emoji || '🌿',
        color: user?.ongProfile?.color || ongBase?.color || '#d4f5e9',
    });

    const defaultFotoUrl = user?.email?.toLowerCase() === 'amante.de.gatitos55@example.com'
        ? "https://img.buzzfeed.com/buzzfeed-static/static/2025-03/13/18/subbuzz/UjLcjUoUE0.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto"
        : '';

    let initialFoto = user?.photoUrl || defaultFotoUrl;

    try {
        const stored = JSON.parse(localStorage.getItem('registeredUser'));
        if (
            stored &&
            stored.email &&
            user?.email &&
            stored.email.toLowerCase() === user.email.toLowerCase() &&
            stored.photoUrl
        ) {
            initialFoto = stored.photoUrl;
        }
    } catch (e) {}

    const [fotoUrl, setFotoUrl] = useState(initialFoto);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [photoInput, setPhotoInput] = useState('');

    function saveProfilePhoto(url) {
        setFotoUrl(url);

        const updatedUser = {
            ...user,
            photoUrl: url,
        };

        if (onUpdateUser) {
            onUpdateUser(updatedUser);
        }

        try {
            const stored = JSON.parse(localStorage.getItem('registeredUser')) || null;
            if (
                stored &&
                stored.email &&
                user?.email &&
                stored.email.toLowerCase() === user.email.toLowerCase()
            ) {
                stored.photoUrl = url;
                localStorage.setItem('registeredUser', JSON.stringify(stored));
            }
        } catch (e) {}
    }

    function handleOngInput(e) {
        const { name, value } = e.target;

        setOngForm(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    function guardarPerfilOng() {
        const updatedUser = {
            ...user,
            fullName: ongForm.name,
            ongProfile: {
                ...ongForm,
            },
        };

        if (onUpdateUser) {
            onUpdateUser(updatedUser);
        }

        if (updatedUser.id) {
            localStorage.setItem(`user_${updatedUser.id}`, JSON.stringify(updatedUser));
        } else {
            localStorage.setItem('registeredUser', JSON.stringify(updatedUser));
        }

        setEditandoOng(false);
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const isDefaultProfile = user.email?.toLowerCase() === 'amante.de.gatitos55@example.com';

    const usuarioLogueado = {
        fullName: esOng
            ? ongForm.name
            : user.fullName || user.username || (user.email || '').split('@')[0],
        username: user.username || (user.email || '').split('@')[0],
        biografia: esOng
            ? ongForm.desc
            : isDefaultProfile
                ? "Lo que disfruto es poder ayudar a la gente"
                : '',
        fotoUrl: isDefaultProfile ? defaultFotoUrl : '',
        bannerUrl: "https://www.revista-ballesol.com/wp-content/uploads/2024/02/ONG-840x559.jpg",
        ongsSeguidasIds: [1, 3],
    };

    const misOngsAyudadas = ongs.filter(ong =>
        usuarioLogueado.ongsSeguidasIds.includes(ong.id)
    );

    const campañaReciente = campañas[0];

    return (
        <div className="profile-dashboard">
            <h1 className="profile-page-title">
                {esOng ? 'Perfil ONG' : 'Mi perfil'}
            </h1>

            <div className="profile-hero">
                <div
                    className="profile-banner"
                    style={{ backgroundImage: `url(${usuarioLogueado.bannerUrl})` }}
                ></div>

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
                        {usuarioLogueado.biografia && (
                            <p>"{usuarioLogueado.biografia}"</p>
                        )}
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

            {esOng ? (
                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'perfil-ong' ? 'active' : ''}`}
                        onClick={() => setActiveTab('perfil-ong')}
                    >
                        Perfil ONG
                    </button>
                </div>
            ) : (
                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'actividad' ? 'active' : ''}`}
                        onClick={() => setActiveTab('actividad')}
                    >
                        Mi Actividad
                    </button>

                    <button
                        className={`tab-btn ${activeTab === 'seguimiento' ? 'active' : ''}`}
                        onClick={() => setActiveTab('seguimiento')}
                    >
                        Seguimiento
                    </button>

                    <button
                        className={`tab-btn ${activeTab === 'voluntariados' ? 'active' : ''}`}
                        onClick={() => setActiveTab('voluntariados')}
                    >
                        Mis Voluntariados
                    </button>
                </div>
            )}

            {esOng && activeTab === 'perfil-ong' && (
                <div className="dashboard-section">
                    <h3>Información de la ONG</h3>

                    {!editandoOng ? (
                        <>
                            <div className="ong-row-item">
                                <div className="ong-row-left">
                                    <div
                                        className="ong-row-emoji"
                                        style={{ backgroundColor: ongForm.color }}
                                    >
                                        {ongForm.emoji || '🌿'}
                                    </div>

                                    <div className="ong-row-details">
                                        <h4>{ongForm.name || 'Nombre de la ONG'}</h4>
                                        <p>{ongForm.location || 'Ubicación no registrada'}</p>
                                        <p>{ongForm.desc || 'Descripción no registrada.'}</p>
                                        <p><strong>Misión:</strong> {ongForm.mision || 'No registrada'}</p>
                                        <p><strong>Correo:</strong> {ongForm.email || 'No registrado'}</p>
                                        <p><strong>Teléfono:</strong> {ongForm.telefono || 'No registrado'}</p>
                                        <p><strong>Web:</strong> {ongForm.web || 'No registrada'}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                className="ver-mas-btn"
                                onClick={() => setEditandoOng(true)}
                            >
                                Editar perfil ONG
                            </button>
                        </>
                    ) : (
                        <div className="ong-edit-form">
                            <label>
                                Nombre de la ONG
                                <input
                                    type="text"
                                    name="name"
                                    value={ongForm.name}
                                    onChange={handleOngInput}
                                />
                            </label>

                            <label>
                                Ubicación
                                <input
                                    type="text"
                                    name="location"
                                    value={ongForm.location}
                                    onChange={handleOngInput}
                                />
                            </label>

                            <label>
                                Descripción
                                <textarea
                                    name="desc"
                                    value={ongForm.desc}
                                    onChange={handleOngInput}
                                    rows="3"
                                />
                            </label>

                            <label>
                                Misión
                                <textarea
                                    name="mision"
                                    value={ongForm.mision}
                                    onChange={handleOngInput}
                                    rows="4"
                                />
                            </label>

                            <label>
                                Correo
                                <input
                                    type="email"
                                    name="email"
                                    value={ongForm.email}
                                    onChange={handleOngInput}
                                />
                            </label>

                            <label>
                                Teléfono
                                <input
                                    type="text"
                                    name="telefono"
                                    value={ongForm.telefono}
                                    onChange={handleOngInput}
                                />
                            </label>

                            <label>
                                Página web o red social
                                <input
                                    type="text"
                                    name="web"
                                    value={ongForm.web}
                                    onChange={handleOngInput}
                                />
                            </label>

                            <label>
                                Emoji
                                <input
                                    type="text"
                                    name="emoji"
                                    value={ongForm.emoji}
                                    onChange={handleOngInput}
                                />
                            </label>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button
                                    className="ver-mas-btn"
                                    onClick={guardarPerfilOng}
                                >
                                    Guardar cambios
                                </button>

                                <button
                                    className="ver-perfil-link"
                                    onClick={() => setEditandoOng(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!esOng && activeTab === 'actividad' && (
                <div className="dashboard-grid">
                    <div className="dashboard-section ongs-ayudadas-box">
                        <h3>ONG ayudadas:</h3>

                        <div className="ongs-list">
                            {misOngsAyudadas.map((ong) => (
                                <div key={ong.id} className="ong-row-item">
                                    <div className="ong-row-left">
                                        <div
                                            className="ong-row-emoji"
                                            style={{ backgroundColor: ong.color }}
                                        >
                                            {ong.emoji}
                                        </div>

                                        <div className="ong-row-details">
                                            <h4>{ong.name}</h4>
                                            <p>{ong.location}</p>
                                        </div>
                                    </div>

                                    <button
                                        className="ver-perfil-link"
                                        onClick={() => navigate(`/perfil/${ong.id}`)}
                                    >
                                        Ver perfil
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

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
                                            style={{
                                                width: `${Math.min(
                                                    (campañaReciente.actual / campañaReciente.meta) * 100,
                                                    100
                                                )}%`
                                            }}
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

            {!esOng && activeTab === 'seguimiento' && (
                <SeguimientoScreen user={user} />
            )}

            {!esOng && activeTab === 'voluntariados' && (
                <div className="dashboard-section empty-state">
                    <h3>Mis Voluntariados Activos</h3>
                    <p>No tienes voluntariados agendados por el momento o solicitudes pendientes de cancelación.</p>
                </div>
            )}
        </div>
    );
}