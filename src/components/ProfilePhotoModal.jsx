import React, { useEffect, useState } from 'react';

export default function ProfilePhotoModal({ isOpen, initialUrl = '', onClose, onSave }) {
  const [url, setUrl] = useState(initialUrl);
  const [valid, setValid] = useState(true);

  useEffect(() => {
    setUrl(initialUrl || '');
    setValid(true);
  }, [initialUrl, isOpen]);

  if (!isOpen) return null;

  function handleSave() {
    const trimmed = (url || '').trim();
    if (!trimmed) return;
    if (!/^https?:\/\//i.test(trimmed)) {
      setValid(false);
      return;
    }
    onSave(trimmed);
    onClose();
  }

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
          <h2>📷 Cambiar foto de perfil</h2>
          <p>Sube una nueva imagen para tu perfil</p>
        </div>

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
