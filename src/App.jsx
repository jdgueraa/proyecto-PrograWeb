import React, { useState } from 'react';
import './App.css';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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

// SCREEN ONG  (Santiago)
import AdminScreen from './screens/AdminScreen';

// Layout con sidebar para las pantallas internas
function AppLayout({ children, user }) {
  return (
    <div className="app-layout">
  <Sidebar user={user} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  const [authUser, setAuthUser] = useState(null);

  const defaultUser = {
    email: 'amante.de.gatitos55@example.com',
    password: 'gatitos55',
    fullName: 'Amante de Gatitos 55',
    username: 'amante de gatitos55',
  };

function handleLogin(email, password) {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail || !password) {
    return 'Ingresa correo y contraseña.';
  }

  const storedUser =
    JSON.parse(localStorage.getItem('registeredUser'));

  if (
    storedUser &&
    trimmedEmail === storedUser.email &&
    password === storedUser.password
  ) {
    setAuthUser(storedUser);
    return '';
  }

  return 'Usuario o contraseña incorrectos.';
}

  return (
    <BrowserRouter>
      <Routes>

        {/* ── SIN SIDEBAR ── */}
        <Route path="/"         element={<LoginScreen onLogin={handleLogin} />} />
        <Route path="/login"    element={<LoginScreen onLogin={handleLogin} />} />
        <Route path="/registro" element={<RegisterScreen />} />

        {/* ── CON SIDEBAR ── */}
        <Route path="/home" element={ <AppLayout user={authUser}> <HomeScreen /></AppLayout>}/>
        <Route path="/buscar"     element={<AppLayout><SearchScreen /></AppLayout>} />
        <Route path="/perfil/:id" element={<AppLayout><ProfileScreen /></AppLayout>} />
        <Route path="/MiPerfil" element={ authUser ? (<AppLayout><MyProfileScreen user={authUser} /></AppLayout>) : (<Navigate to="/login" replace />)}/>
        <Route path="/admin" element= {authUser?.role === 'ong' ? (<AppLayout user={authUser}><AdminScreen /></AppLayout>) : (<Navigate to="/home" replace />)}/>
      </Routes>
    </BrowserRouter>
  );
}