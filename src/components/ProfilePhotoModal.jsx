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
      <div className="modal-card">
        <h3>Nueva URL de foto</h3>
        <input
          className="modal-input"
          type="text"
          placeholder="Pega la URL de la imagen"
          value={url}
          onChange={e => { setUrl(e.target.value); setValid(true); }}
          style={{ border: valid ? undefined : '1px solid #e11' }}
        />

        {!valid && (
          <div className="modal-error">Introduce una URL válida que empiece por http:// o https://</div>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-save" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
