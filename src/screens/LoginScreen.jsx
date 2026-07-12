import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginScreen({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin() {
    setError('');
    const errorMessage = onLogin(email, password);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    navigate('/home');
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      
      <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minWidth: '320px' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🌿</div>
        <h2 style={{ marginBottom: '8px', color: '#1a6b4a' }}>Iniciar Sesión</h2>
        <p style={{ color: '#7aab90', marginBottom: '24px', fontSize: '14px' }}>
          Ingresa tus datos para continuar.
        </p>

        {error && (
          <div style={{ marginBottom: '16px', color: '#b91c1c', fontWeight: 700 }}>
            {error}
          </div>
        )}

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
          onClick={handleLogin}
          style={{ width: '100%', padding: '14px', background: '#1a6b4a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', marginBottom: '12px' }}
        >
          Entrar
        </button>

        <button
          onClick={() => navigate('/registro')}
          style={{ background: 'none', border: 'none', color: '#2d9b6f', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </div>

    </div>
  );
}