import React, { useEffect, useState } from 'react';

export default function ProfilePhotoModal({ user, isOpen, initialUrl = '', onClose, onSave }) {
  const [url, setUrl] = useState(initialUrl);
  const [name, setName] = useState(user.fullName);
  const [bio, setBio] = useState(user.biografia);
  const [valid, setValid] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl || '');
      setName(user?.fullName || '');
      setBio(user?.biografia || '');
      setValid(true);
    }
  }, [initialUrl, isOpen, user]);

  if (!isOpen) return null;

  function handleSave() {
    const nombre = (name || '').trim();
    const descrip = (bio || '').trim();
    const trimmedUrl = (url || '').trim();
    
    if (!trimmedUrl) return; 
        
    if (!/^https?:\/\//i.test(trimmedUrl)) {
      setValid(false);
      return;
    }        
    onSave(nombre, descrip, trimmedUrl);
    onClose();
  }

  const isOnlyUrlMode = Number(user?.id) === 2;

  return (
    <div className="modal-overlay">
      <div className="modal-card photo-modal-card">
        <button 
          className="photo-modal-close-btn" 
          onClick={onClose}
        >
          ✕
        </button>

        <div className="photo-modal-header">
          <h2> 📝 Configurar perfil</h2>
          <p>
            {isOnlyUrlMode 
              ? "Actualiza la foto de tu perfil" 
              : "Puedes actualizar diferentes secciones de tu perfil"}
          </p>
        </div>
        
        {!isOnlyUrlMode && (
          <>
            <div className="photo-modal-form-group">
              <label className="photo-modal-label">
                Nombre de perfil
              </label>
              <input
                className={`photo-modal-input ${!valid ? 'invalid' : ''}`}
                type="text"
                placeholder="Dale un nuevo nombre a tu perfil"
                value={name}
                onChange={e => { setName(e.target.value); setValid(true); }}
              />
            </div>

            <div className="photo-modal-form-group">
              <label className="photo-modal-label">
                Descripción
              </label>
              <input
                className={`photo-modal-input ${!valid ? 'invalid' : ''}`}
                type="text"
                placeholder="Expresa lo que quieras"
                value={bio}
                onChange={e => { setBio(e.target.value); setValid(true); }}
              />
            </div>
          </>
        )}
        
        <div className="photo-modal-form-group">
          <label className="photo-modal-label">
            URL de la imagen
          </label>
          <input
            className={`photo-modal-input ${!valid ? 'invalid' : ''}`}
            type="text"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={url}
            onChange={e => { setUrl(e.target.value); setValid(true); }}
          />
        </div>

        {!valid && (
          <div className="photo-modal-error">
            <strong>⚠️ URL no válida</strong>
            <p>La URL debe empezar con <code>http://</code> o <code>https://</code></p>
          </div>
        )}

        <div className="photo-modal-tips">
          <strong>💡 Consejos:</strong>
          <ul>
            <li>Usa una imagen cuadrada para mejor resultado</li>
            <li>La URL debe ser accesible en internet</li>
          </ul>
        </div>

        <div className="photo-modal-actions">
          <button 
            className="photo-modal-btn-cancel" 
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            className="photo-modal-btn-save" 
            onClick={handleSave}
          >
            Guardar foto
          </button>
        </div>
      </div>
    </div>
  );
}
