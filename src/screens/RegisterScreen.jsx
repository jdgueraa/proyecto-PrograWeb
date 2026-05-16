// src/screens/RegisterScreen.jsx
// ═══════════════════════════════════════════════════════════════
//  RESPONSABLE: [Nombre del Amigo 1]
//  RUTA:        /registro
//  DESCRIPCIÓN: Pantalla de creación de cuenta.
//
//  Para navegar usa useNavigate():
//    navigate('/login') → vuelve al login tras registrarse
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [nombre, setNombre]       = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');

  function handleRegister() {
    // TODO: agregar validación y lógica de registro aquí
    navigate('/login');
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>

      {/* ↓↓↓ REEMPLAZA TODO ESTE BLOQUE CON TU DISEÑO ↓↓↓ */}
      <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minWidth: '320px' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🌱</div>
        <h2 style={{ marginBottom: '8px', color: '#1a6b4a' }}>Crear Cuenta</h2>
        <p style={{ color: '#7aab90', marginBottom: '24px', fontSize: '14px' }}>
          [Pantalla pendiente — Amigo 1]
        </p>

        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          style={{ display: 'block', width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #c6eadb', fontFamily: 'inherit' }}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ display: 'block', width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #c6eadb', fontFamily: 'inherit' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #c6eadb', fontFamily: 'inherit' }}
        />

        <button
          onClick={handleRegister}
          style={{ width: '100%', padding: '14px', background: '#1a6b4a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', marginBottom: '12px' }}
        >
          Registrarme
        </button>

        <button
          onClick={() => navigate('/login')}
          style={{ background: 'none', border: 'none', color: '#2d9b6f', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
      {/* ↑↑↑ HASTA AQUÍ ↑↑↑ */}

    </div>
  );
}