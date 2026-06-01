import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ongs } from '../data.json';
import ProfilePhotoModal from '../components/ProfilePhotoModal.jsx';

export default function ProfileOngScreen({ user, onUpdateUser }) {

  // Buscamos la ONG base en el JSON usando el ongId del usuario logueado
  const ongBase = ongs.find(ong => ong.id === user?.ongId);

  // Función auxiliar para obtener los datos más recientes del perfil
  function getDatosActuales() {
    return {
      name:     user?.ongProfile?.name     || ongBase?.name     || '',
      location: user?.ongProfile?.location || ongBase?.location || '',
      desc:     user?.ongProfile?.desc     || ongBase?.desc     || '',
      mision:   user?.ongProfile?.mision   || ongBase?.mision   || '',
      email:    user?.ongProfile?.email    || user?.email       || '',
      telefono: user?.ongProfile?.telefono || '',
      web:      user?.ongProfile?.web      || '',
      emoji:    user?.ongProfile?.emoji    || ongBase?.emoji    || '🌿',
      color:    user?.ongProfile?.color    || ongBase?.color    || '#d4f5e9',
    };
  }

  // Estado del formulario de edición
  const [ongForm, setOngForm] = useState(getDatosActuales);

  // Controla si estamos en modo vista (false) o modo edición (true)
  const [editando, setEditando] = useState(false);

  // URL de la foto/logo de la ONG
  const [fotoUrl, setFotoUrl] = useState(user?.photoUrl || '');

  // Controla el modal para cambiar la foto
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Si no hay usuario logueado, redirigir al login
  if (!user) return <Navigate to="/login" replace />;

  // Actualiza un campo del formulario cuando el usuario escribe
  function handleInput(e) {
    const { name, value } = e.target;
    setOngForm(prev => ({ ...prev, [name]: value }));
  }

  // Abre el modo edición cargando los datos más recientes (por si hubo cambios externos)
  function abrirEdicion() {
    setOngForm(getDatosActuales());
    setEditando(true);
  }

  // Guarda la foto y actualiza el usuario
  function guardarFoto(url) {
    setFotoUrl(url);
    if (onUpdateUser) onUpdateUser({ ...user, photoUrl: url });
  }

  // Guarda los cambios del formulario
  function guardarPerfil() {
    const updatedUser = {
      ...user,
      fullName: ongForm.name,
      ongProfile: { ...ongForm },
    };
    if (onUpdateUser) onUpdateUser(updatedUser);
    setEditando(false);
  }

  // Datos que se muestran en modo vista (los del formulario si está editando, o los guardados)
  const datos = getDatosActuales();

  return (
    <div className="profile-dashboard">
      <h1 className="profile-page-title">Perfil ONG</h1>

      {/* ── Banner y avatar ── */}
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

      {/* Modal para cambiar la foto */}
      <ProfilePhotoModal
        isOpen={showPhotoModal}
        initialUrl={fotoUrl}
        onClose={() => setShowPhotoModal(false)}
        onSave={(url) => { guardarFoto(url); setShowPhotoModal(false); }}
      />

      {/* ── Sección de información ── */}
      <div className="dashboard-section">
        <h3>Información de la ONG</h3>

        {/* MODO VISTA */}
        {!editando && (
          <div className="ong-profile-card">

            {/* Cabecera: emoji + nombre + ubicación */}
            <div className="ong-profile-header">
              <div className="ong-profile-emoji-badge" style={{ backgroundColor: datos.color }}>
                {datos.emoji}
              </div>
              <div>
                <p className="ong-profile-title">{datos.name || 'Nombre no registrado'}</p>
                <p className="ong-profile-location">📍 {datos.location || 'Ubicación no registrada'}</p>
              </div>
            </div>

            {/* Cuerpo: descripción y misión */}
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

            {/* Contacto: correo, teléfono, web */}
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

            {/* Botón de editar al fondo */}
            <button className="ong-profile-edit-btn" onClick={abrirEdicion}>
              ✏️ Editar perfil ONG
            </button>
          </div>
        )}

        {/* MODO EDICIÓN */}
        {editando && (
          <div className="ong-edit-form">

            {/* Nombre (campo completo) */}
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

            {/* Ubicación y Emoji en la misma fila */}
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

            {/* Descripción */}
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

            {/* Misión */}
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

            {/* Correo, Teléfono y Web en la misma fila */}
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

            {/* Botones */}
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
