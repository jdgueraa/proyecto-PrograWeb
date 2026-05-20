import React from 'react';
import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componente fijo
import Sidebar from './components/Sidebar';

// Pantallas existentes (Jose)
import SearchScreen from './screens/SearchScreen';
import ProfileScreen from './screens/ProfileScreen';

// ─── PANTALLAS NUEVAS ───────────────────────────────────────────
// Amigo 1: Login y Registro → trabajar en src/screens/LoginScreen.jsx
//                                         y src/screens/RegisterScreen.jsx
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';

// Amigo 2: Pantalla principal (Home) → trabajar en src/screens/HomeScreen.jsx
import HomeScreen from './screens/HomeScreen.jsx';
import MyProfileScreen from './screens/MyProfileScreen.jsx'; // Tu pantalla de perfil personal
// ────────────────────────────────────────────────────────────────


// Layout con sidebar para las pantallas internas
function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── SIN SIDEBAR ── */}
        <Route path="/"         element={<LoginScreen />} />
        <Route path="/login"    element={<LoginScreen />} />
        <Route path="/registro" element={<RegisterScreen />} />

        {/* ── CON SIDEBAR ── */}
        <Route path="/home"       element={<AppLayout><HomeScreen /></AppLayout>} />
        <Route path="/buscar"     element={<AppLayout><SearchScreen /></AppLayout>} />
        <Route path="/perfil/:id" element={<AppLayout><ProfileScreen /></AppLayout>} />
        <Route path="/MiPerfil"   element={<AppLayout><MyProfileScreen /></AppLayout>} />

      </Routes>
    </BrowserRouter>
  );
}