// src/screens/HomeScreen.jsx
// ═══════════════════════════════════════════════════════════════
//  RESPONSABLE: [Nombre del Amigo 2]
//  RUTA:        /home
//  DESCRIPCIÓN: Pantalla principal que ve el usuario al entrar.
//               Puede mostrar ONGs destacadas, campañas recientes,
//               estadísticas, etc.
//
//  Datos disponibles en src/data.jsx:
//    import { ongs, campañas, categories } from '../data';
//
//  Para navegar usa useNavigate():
//    navigate('/buscar')      → va al buscador
//    navigate('/perfil/1')    → va al perfil de una ONG
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ongs, campañas } from '../data';

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="fade-in">

      {/* ↓↓↓ REEMPLAZA TODO ESTE BLOQUE CON TU DISEÑO ↓↓↓ */}
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏠</div>
        <h1 style={{ fontSize: '32px', color: '#1a6b4a', marginBottom: '8px' }}>
          Pantalla Principal
        </h1>
        <p style={{ color: '#7aab90', marginBottom: '32px' }}>
          [Pantalla pendiente — Amigo 2] <br/>
          Aquí va lo que ve el usuario al entrar: ONGs destacadas, campañas, novedades, etc.
        </p>

        {/* Botón de ejemplo para probar navegación */}
        <button
          onClick={() => navigate('/buscar')}
          style={{ padding: '14px 28px', background: '#1a6b4a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}
        >
          🔍 Ir al buscador
        </button>

        {/* Datos disponibles para usar — puedes borrar esto */}
        <div style={{ marginTop: '48px', textAlign: 'left', maxWidth: '600px', margin: '48px auto 0' }}>
          <p style={{ fontWeight: '700', color: '#3d6b55', marginBottom: '12px' }}>
            Datos que puedes usar (importados de data.jsx):
          </p>
          <pre style={{ background: '#f0faf5', padding: '16px', borderRadius: '8px', fontSize: '13px', color: '#0f2d1f', overflowX: 'auto' }}>
{`ongs (${ongs.length} organizaciones):
${ongs.map(o => `  • ${o.name} — ${o.location}`).join('\n')}

campañas (${campañas.length} campañas):
${campañas.map(c => `  • ${c.name}`).join('\n')}`}
          </pre>
        </div>
      </div>
      {/* ↑↑↑ HASTA AQUÍ ↑↑↑ */}

    </div>
  );
}