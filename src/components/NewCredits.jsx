import React, { useState } from 'react';

export default function NewCredits({isOpen, onClose, onSave }) {
    // Estado local para manejar el monto ingresado en el input
const [monto, setMonto] = useState('');

// Si el modal no está abierto, no renderizamos nada (retorna null)
if (!isOpen) return null;

const handleSave = () => {
    // Validamos que se haya ingresado un número válido mayor a 0
    const montoNumerico = parseFloat(monto);
    if (!isNaN(montoNumerico) && montoNumerico > 0) {
        onSave(montoNumerico);
        setMonto(''); // Limpiamos el input después de guardar
    } else {
        // Opcional: Aquí podrías manejar un estado de error visual
        console.error("Por favor ingresa un monto válido");
    }
};

return (
    <>                        
        <div className="credits-modal-overlay" onClick={onClose}>
            {/* Usamos e.stopPropagation() para que al hacer clic dentro de la caja no se cierre el modal */}
            <div className="credits-modal-content" onClick={(e) => e.stopPropagation()}>

                <div className="credits-modal-header">
                    <span role="img" aria-label="money" style={{ fontSize: '24px' }}>💳</span>
                    <h3>Aumentar Créditos</h3>
                </div>
                <p className="credits-modal-subtitle">Ingresa el monto que deseas recargar a tu monedero.</p>

                <div className="credits-input-group">
                    <label className="credits-input-label">Monto a recargar</label>
                    <div className="credits-input-wrapper">
                        <span className="credits-currency-symbol">S/.</span>
                        <input
                            type="number"
                            className="credits-modal-input"
                            placeholder="0.00"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            min="1"
                            step="0.10"
                        />
                    </div>
                </div>

                <div className="credits-tips-box">
                    <p className="credits-tips-title">💡 Información de recarga:</p>
                    <ul className="credits-tips-list">
                        <li>El monto ingresado se sumará inmediatamente a tu saldo disponible.</li>
                        <li>Puedes usar tus créditos para apoyar cualquier campaña de voluntariado.</li>                        
                    </ul>
                </div>

                <div className="credits-modal-actions">
                    <button className="credits-btn credits-btn-cancel" onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        className="credits-btn credits-btn-save"
                        onClick={handleSave}
                        disabled={!monto || parseFloat(monto) <= 0} // Deshabilitar si está vacío o es 0
                    >
                        Confirmar Recarga
                    </button>
                </div>

            </div>
        </div>
    </>
);
}