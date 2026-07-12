import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import SearchScreen from './screens/SearchScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import MyProfileScreen from './screens/MyProfileScreen.jsx';
import AdminScreen from './screens/AdminScreen';
import DonationsScreen from './screens/DonationsScreen';
import VoluntariadoScreen from './screens/VoluntariadoScreen';
import ProfileOngScreen from './screens/ProfileOngScreen.jsx';
import { api } from './api';

function AppLayout({ children, user, onLogout }) {
  return (
    <div className="app-layout">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [campañas, setCampañas] = useState([]);
  const [voluntariados, setVoluntariados] = useState([]);

  useEffect(() => {
    api.get('/campanas').then(setCampañas).catch(() => setCampañas([]));
    api.get('/voluntariados').then(setVoluntariados).catch(() => setVoluntariados([]));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCargandoSesion(false);
      return;
    }
    api.get('/me')
      .then(setAuthUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setCargandoSesion(false));
  }, []);

  async function handleLogin(email, password) {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) return 'Ingresa correo y contraseña.';

    try {
      const { token, user } = await api.post('/auth/login', { email: trimmedEmail, password });
      localStorage.setItem('token', token);
      setAuthUser(user);
      return '';
    } catch (err) {
      return err.message;
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setAuthUser(null);
  }

  async function handleUpdateUser(camposActualizados) {
    const user = await api.put('/me', camposActualizados);
    setAuthUser(user);
    await refreshUser();
    return user;
  }

  async function refreshUser() {
    const user = await api.get('/me');
    setAuthUser(user);
  }

  async function handleDonate(campañaId, amount) {
    const { user, campana } = await api.post('/donaciones', {
      campanaId: campañaId,
      monto: amount,
    });
    setAuthUser(user);
    setCampañas(prev => prev.map(c => (c.id === campana.id ? campana : c)));
  }

  async function handlePostular(voluntariadoId) {
    const { voluntariado } = await api.post('/postulaciones', { voluntariadoId });
    setVoluntariados(prev => prev.map(v => (v.id === voluntariado.id ? voluntariado : v)));
    await refreshUser();
  }

  async function handleCreateCampaña(datosFormulario) {
    const nuevaCampaña = await api.post('/campanas', datosFormulario);
    setCampañas(prev => [...prev, nuevaCampaña]);
  }

  async function handleCreateVoluntariado(datosFormulario) {
    const nuevoVol = await api.post('/voluntariados', datosFormulario);
    setVoluntariados(prev => [...prev, nuevoVol]);
  }

  if (cargandoSesion) return null;

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/"         element={<LoginScreen onLogin={handleLogin} />} />
        <Route path="/login"    element={<LoginScreen onLogin={handleLogin} />} />
        <Route path="/registro" element={<RegisterScreen />} />
        <Route path="/home" element={
        authUser?.role === 'ong'
        ? <Navigate to="/admin" replace />
        : <AppLayout user={authUser} onLogout={handleLogout}>
          <HomeScreen
          user={authUser}
          onDonate={handleDonate}
          /></AppLayout>
        } />
        <Route path="/buscar" element={
          <AppLayout user={authUser} onLogout={handleLogout}><SearchScreen /></AppLayout>
        } />
        <Route path="/perfil/:id" element={
          <AppLayout user={authUser} onLogout={handleLogout}>
            <ProfileScreen
              user={authUser}
              campañas={campañas}
              voluntariados={voluntariados}
              onFollowChange={refreshUser}
            />
          </AppLayout>
        } />

        <Route path="/MiPerfil" element={authUser
          ? <AppLayout user={authUser} onLogout={handleLogout}>
              {authUser?.role === 'ong'
                ? <ProfileOngScreen user={authUser} onUpdateUser={handleUpdateUser} />
                : <MyProfileScreen user={authUser} onUpdateUser={handleUpdateUser} onCreditsChange={refreshUser} />}
            </AppLayout>
          : <Navigate to="/login" replace />
        } />

        <Route path="/donaciones" element={
          <AppLayout user={authUser} onLogout={handleLogout}>
            <DonationsScreen campañas={campañas} user={authUser} onDonate={handleDonate} />
          </AppLayout>
        } />
        <Route path="/voluntariado" element={
          <AppLayout user={authUser} onLogout={handleLogout}>
            <VoluntariadoScreen voluntariados={voluntariados} user={authUser} onPostular={handlePostular} />
          </AppLayout>
        } />
        <Route path="/admin" element={
          authUser?.role === 'ong'
            ? <AppLayout user={authUser} onLogout={handleLogout}>
                <AdminScreen
                  user={authUser}
                  campañas={campañas}
                  voluntariados={voluntariados}
                  onCreateCampaña={handleCreateCampaña}
                  onCreateVoluntariado={handleCreateVoluntariado}
                />
              </AppLayout>
            : <Navigate to="/home" replace />
        } />

      </Routes>
    </BrowserRouter>
  );
}
