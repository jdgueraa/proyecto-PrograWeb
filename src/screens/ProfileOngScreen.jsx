import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../api';
import ProfilePhotoModal from '../components/ProfilePhotoModal.jsx';

export default function ProfileOngScreen({ user, onUpdateUser, onProfileSaved }) {

  const ongBase = user?.ong;

  function getDatosActuales() {
    return {
      name:     ongBase?.name     || '',
      location: ongBase?.location || '',
      desc:     ongBase?.desc     || '',
      mision:   ongBase?.mision   || '',
      email:    ongBase?.email    || user?.email || '',
      telefono: ongBase?.telefono || '',
      web:      ongBase?.web      || '',
      emoji:    ongBase?.emoji    || '🌿',
      color:    ongBase?.color    || '#d4f5e9',
    };
  }

  const [ongForm, setOngForm] = useState(getDatosActuales);
  const [editando, setEditando] = useState(false);
  const [fotoUrl, setFotoUrl] = useState(user?.photoUrl || '');
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  function handleInput(e) {
    const { name, value } = e.target;
    setOngForm(prev => ({ ...prev, [name]: value }));
  }

  function abrirEdicion() {
    setOngForm(getDatosActuales());
    setEditando(true);
  }

  function guardarFoto(url) {
    setFotoUrl(url);
    if (onUpdateUser) onUpdateUser({ photoUrl: url });
  }

  async function guardarPerfil() {
    await api.put('/ongs/' + user.ong.id, ongForm);
    if (onProfileSaved) await onProfileSaved();
    setEditando(false);
  }

  const datos = getDatosActuales();

  return (
    <div className="profile-dashboard">
      <h1 className="profile-page-title">Perfil ONG</h1>

      <div className="profile-hero">
        <div
          className="profile-banner"
          style={{ backgroundImage: `url("https://www.revista-ballesol.com/wp-content/uploads/2024/02/ONG-840x559.jpg")` }}
        />
        <div className="profile-info-strip">
          <div className="profile-avatar-container">
            {fotoUrl ? (
              <img src={fotoUrl} alt="Logo ONG" className="profile-avatar" />
            ) : (
              <div className="profile-avatar profile-avatar-empty" />
            )}
            <button
              className="profile-btn-edit-photo"
              title="Cambiar logo"
              onClick={() => setShowPhotoModal(true)}
            >
              +
            </button>
          </div>
          <div className="profile-text">
            <h2>{datos.name || 'Mi ONG'}</h2>
            {datos.location && <p>{datos.location}</p>}
          </div>
        </div>
      </div>

      <ProfilePhotoModal
        user={user}
        isOpen={showPhotoModal}
        initialUrl={fotoUrl}
        onClose={() => setShowPhotoModal(false)}
        onSave={(nombre, descripcion, url) => { guardarFoto(url); setShowPhotoModal(false); }}
      />

      <div className="dashboard-section">
        <h3>Información de la ONG</h3>

        {!editando && (
          <div className="ong-profile-card">

            <div className="ong-profile-header">
              <div className="ong-profile-emoji-badge" style={{ backgroundColor: datos.color }}>
                {datos.emoji}
              </div>
              <div>
                <p className="ong-profile-title">{datos.name || 'Nombre no registrado'}</p>
                <p className="ong-profile-location">📍 {datos.location || 'Ubicación no registrada'}</p>
              </div>
            </div>

            <div className="ong-profile-body">
              {datos.desc && (
                <div>
                  <p className="ong-profile-section-title">Descripción</p>
                  <p className="ong-profile-section-text">{datos.desc}</p>
                </div>
              )}
              {datos.mision && (
                <div>
                  <p className="ong-profile-section-title">Misión</p>
                  <p className="ong-profile-section-text">{datos.mision}</p>
                </div>
              )}
            </div>

            <div className="ong-profile-contacts">
              <div className="ong-profile-contact-item">
                <span className="ong-profile-contact-label">📧 Correo</span>
                <span className="ong-profile-contact-value">{datos.email || '—'}</span>
              </div>
              <div className="ong-profile-contact-item">
                <span className="ong-profile-contact-label">📞 Teléfono</span>
                <span className="ong-profile-contact-value">{datos.telefono || '—'}</span>
              </div>
              <div className="ong-profile-contact-item">
                <span className="ong-profile-contact-label">🌐 Web</span>
                <span className="ong-profile-contact-value">{datos.web || '—'}</span>
              </div>
            </div>

            <button className="ong-profile-edit-btn" onClick={abrirEdicion}>
              ✏️ Editar perfil ONG
            </button>
          </div>
        )}

        {editando && (
          <div className="ong-edit-form">

            <label>
              Nombre de la ONG
              <input
                type="text"
                name="name"
                value={ongForm.name}
                onChange={handleInput}
                placeholder="Ej: Tierra Verde Perú"
              />
            </label>

            <div className="ong-edit-form-row">
              <label>
                Ubicación
                <input
                  type="text"
                  name="location"
                  value={ongForm.location}
                  onChange={handleInput}
                  placeholder="Ej: Lima, Perú"
                />
              </label>
              <label>
                Emoji representativo
                <input
                  type="text"
                  name="emoji"
                  value={ongForm.emoji}
                  onChange={handleInput}
                  placeholder="🌿"
                />
              </label>
            </div>

            <label>
              Descripción breve
              <textarea
                name="desc"
                value={ongForm.desc}
                onChange={handleInput}
                rows="3"
                placeholder="¿Qué hace tu ONG? Escribe una descripción corta."
              />
            </label>

            <label>
              Misión
              <textarea
                name="mision"
                value={ongForm.mision}
                onChange={handleInput}
                rows="4"
                placeholder="¿Cuál es el propósito y los valores de tu organización?"
              />
            </label>

            <div className="ong-edit-form-row-3">
              <label>
                Correo
                <input
                  type="email"
                  name="email"
                  value={ongForm.email}
                  onChange={handleInput}
                  placeholder="correo@ong.com"
                />
              </label>
              <label>
                Teléfono
                <input
                  type="text"
                  name="telefono"
                  value={ongForm.telefono}
                  onChange={handleInput}
                  placeholder="+51 999 888 777"
                />
              </label>
              <label>
                Página web
                <input
                  type="text"
                  name="web"
                  value={ongForm.web}
                  onChange={handleInput}
                  placeholder="www.miong.org"
                />
              </label>
            </div>

            <div className="profile-action-row">
              <button className="action-btn-primary" onClick={guardarPerfil}>
                Guardar cambios
              </button>
              <button className="ver-perfil-link" onClick={() => setEditando(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
