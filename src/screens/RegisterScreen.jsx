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
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [accountType, setAccountType] = useState('user');

function handleRegister() {
  setError('');
  setSuccess('');
  if (!nombre.trim() || !email.trim() || !password) {
    setError('Completa todos los campos.');
    return;
  }

  const emailValue = email.trim().toLowerCase();

  if (!emailValue.includes('@') || !emailValue.includes('.')) {
    setError('Correo inválido.');
    return;
  }

  // Validación de contraseña: mínimo 8 caracteres y al menos una mayúscula
  if (password.length < 8) {
    setError('La contraseña debe tener al menos 8 caracteres.');
    return;
  }

  if (!/[A-Z]/.test(password)) {
    setError('La contraseña debe contener al menos una letra mayúscula.');
    return;
  }

  const userData = {
    fullName: nombre.trim(),
    email: emailValue,
    password,
    role: accountType,
  };

  localStorage.setItem('registeredUser', JSON.stringify(userData));

  setSuccess(
    accountType === 'ong'
      ? 'Cuenta ONG creada correctamente.'
      : 'Cuenta creada correctamente.'
  );

  setTimeout(() => navigate('/login'), 1200);
}
//

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>

      {/* ↓↓↓ REEMPLAZA TODO ESTE BLOQUE CON TU DISEÑO ↓↓↓ */}
      <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minWidth: '320px' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🌱</div>
        <h2 style={{ marginBottom: '8px', color: '#1a6b4a' }}>Crear Cuenta</h2>
        <p style={{ color: '#7aab90', marginBottom: '24px', fontSize: '14px' }}>
          Registra tu usuario para acceder a la app.
        </p>

        {error && (
          <div style={{ marginBottom: '16px', color: '#b91c1c', fontWeight: 700 }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ marginBottom: '16px', color: '#047857', fontWeight: 700 }}>
            {success}
          </div>
        )}

        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          style={{ display: 'block', width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #c6eadb', fontFamily: 'inherit' }}
        />
        <div
  style={{
    display: 'flex',
    gap: '10px',
    marginBottom: '12px',
  }}
>

<button
  type="button"
  onClick={() => setAccountType('user')}
  style={{
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border:
      accountType === 'user'
        ? '2px solid #1a6b4a'
        : '1px solid #c6eadb',

    background:
      accountType === 'user'
        ? '#eaf5f0'
        : '#fff',

    fontWeight: 'bold',
    color: '#000', // ← NUEVO
    cursor: 'pointer',
  }}
>
  👤 Usuario
</button>

<button
  type="button"
  onClick={() => setAccountType('ong')}
  style={{
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border:
      accountType === 'ong'
        ? '2px solid #1a6b4a'
        : '1px solid #c6eadb',

    background:
      accountType === 'ong'
        ? '#eaf5f0'
        : '#fff',

    fontWeight: 'bold',
    color: '#000', // ← NUEVO
    cursor: 'pointer',
  }}
>
  🏢 Cuenta ONG
</button>

</div>
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