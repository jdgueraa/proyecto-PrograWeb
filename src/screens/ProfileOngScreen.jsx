import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ongs } from '../data.json';
import ProfilePhotoModal from '../components/ProfilePhotoModal.jsx';

export default function ProfileOngScreen({ user, onUpdateUser }) {
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const ongBase = ongs.find(ong => ong.id === user?.ongId);

    const [editandoOng, setEditandoOng] = useState(false);

    const [ongForm, setOngForm] = useState({
        name: user?.ongProfile?.name || ongBase?.name || user?.fullName || '',
        location: user?.ongProfile?.location || ongBase?.location || '',
        desc: user?.ongProfile?.desc || ongBase?.desc || 'Organización comprometida con el cambio social.',
        mision: user?.ongProfile?.mision || ongBase?.mision || '',
        email: user?.ongProfile?.email || user?.email || '',
        telefono: user?.ongProfile?.telefono || '',
        web: user?.ongProfile?.web || '',
        emoji: user?.ongProfile?.emoji || ongBase?.emoji || '🌿',
        color: user?.ongProfile?.color || ongBase?.color || '#d4f5e9',
    });

    let initialFoto = user?.photoUrl || '';

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

    function handleOngInput(e) {
        const { name, value } = e.target;

        setOngForm(prev => ({
            ...prev,
            [name]: value,
        }));
    }

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

    return (
        <div className="profile-dashboard">
            <h1 className="profile-page-title">Perfil ONG</h1>

            <div className="profile-hero">
                <div
                    className="profile-banner"
                    style={{
                        backgroundImage: `url("https://www.revista-ballesol.com/wp-content/uploads/2024/02/ONG-840x559.jpg")`
                    }}
                ></div>

                <div className="profile-info-strip">
                    <div className="profile-avatar-container">
                        {fotoUrl ? (
                            <img src={fotoUrl} alt="Logo ONG" className="profile-avatar" />
                        ) : (
                            <div className="profile-avatar profile-avatar-empty" aria-label="Logo vacío"></div>
                        )}

                        <button
                            className="profile-btn-edit-photo"
                            title="Cambiar logo de ONG"
                            onClick={() => {
                                setPhotoInput(fotoUrl || '');
                                setShowPhotoModal(true);
                            }}
                        >
                            +
                        </button>
                    </div>

                    <div className="profile-text">
                        <h2>{ongForm.name}</h2>
                        {ongForm.desc && <p>"{ongForm.desc}"</p>}
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
        </div>
    );
}