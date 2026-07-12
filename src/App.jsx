import React, { useState } from 'react';
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

import dataJson from './data.json';

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

  const [campañas, setCampañas] = useState(() => {
    const saved = localStorage.getItem('campañas_state');
    return saved ? JSON.parse(saved) : dataJson.campañas;
  });

  const [voluntariados, setVoluntariados] = useState(() => {
    const saved = localStorage.getItem('voluntariados_state');
    return saved ? JSON.parse(saved) : dataJson.voluntariados;
  });

  function handleLogin(email, password) {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) return 'Ingresa correo y contraseña.';

    const jsonUser = dataJson.usuarios.find(
      u => u.email === trimmedEmail && u.password === password
    );
    if (jsonUser) {
      const savedUpdates = JSON.parse(localStorage.getItem(`user_${jsonUser.id}`) || 'null');
      setAuthUser(savedUpdates || { ...jsonUser });
      return '';
    }

    const storedUser = JSON.parse(localStorage.getItem('registeredUser') || 'null');
    if (storedUser && trimmedEmail === storedUser.email && password === storedUser.password) {
      setAuthUser(storedUser);
      return '';
    }

    return 'Usuario o contraseña incorrectos.';
  }

  function handleLogout() {
    setAuthUser(null);
  }

  function handleUpdateUser(updatedUser) {
    setAuthUser(updatedUser);
    if (updatedUser.id) {
      localStorage.setItem(`user_${updatedUser.id}`, JSON.stringify(updatedUser));
    } else {
      localStorage.setItem('registeredUser', JSON.stringify(updatedUser));
    }
  }

  function handleDonate(campañaId, amount) {
    const updatedCampañas = campañas.map(c =>
      c.id === campañaId
        ? { ...c, actual: c.actual + amount, donantes: (c.donantes || 0) + 1 }
        : c
    );
    setCampañas(updatedCampañas);
    localStorage.setItem('campañas_state', JSON.stringify(updatedCampañas));

    const updatedUser = {
      ...authUser,
      creditos: (authUser.creditos || 0) - amount,
      donaciones: [
        ...(authUser.donaciones || []),
        { campañaId, amount, fecha: new Date().toISOString() },
      ],
    };
    handleUpdateUser(updatedUser);

    const log = JSON.parse(localStorage.getItem('donacionesLog') || '[]');
    log.push({
      userId: authUser.id || authUser.email,
      userName: authUser.fullName,
      campañaId,
      amount,
      fecha: new Date().toISOString(),
    });
    localStorage.setItem('donacionesLog', JSON.stringify(log));
  }

  function handlePostular(voluntariadoId) {
    const updatedVols = voluntariados.map(v =>
      v.id === voluntariadoId
        ? { ...v, cuposOcupados: v.cuposOcupados + 1 }
        : v
    );
    setVoluntariados(updatedVols);
    localStorage.setItem('voluntariados_state', JSON.stringify(updatedVols));

    const updatedUser = {
      ...authUser,
      voluntariadosPostulados: [
        ...(authUser.voluntariadosPostulados || []),
        { voluntariadoId, fecha: new Date().toISOString() },
      ],
    };
    handleUpdateUser(updatedUser);

    const log = JSON.parse(localStorage.getItem('postulaciones') || '[]');
    log.push({
      userId: authUser.id || authUser.email,
      userName: authUser.fullName,
      userEmail: authUser.email,
      voluntariadoId,
      fecha: new Date().toISOString(),
    });
    localStorage.setItem('postulaciones', JSON.stringify(log));
  }

  function handleCreateCampaña(nuevaCampaña) {
    const updated = [...campañas, nuevaCampaña];
    setCampañas(updated);
    localStorage.setItem('campañas_state', JSON.stringify(updated));
  }

  function handleCreateVoluntariado(nuevoVol) {
    const updated = [...voluntariados, nuevoVol];
    setVoluntariados(updated);
    localStorage.setItem('voluntariados_state', JSON.stringify(updated));
  }

  return (
    <BrowserRouter>
      <Routes>


        <Route path="/"         element={<LoginScreen onLogin={handleLogin} />} />
        <Route path="/login"    element={<LoginScreen onLogin={handleLogin} />} />
        <Route path="/registro" element={<RegisterScreen />} />
        <Route path="/home" element={
        authUser?.role === 'ong'
        ? <Navigate to="/admin" replace />
        : <AppLayout user={authUser} onLogout={handleLogout}><HomeScreen /></AppLayout>
        } />
        <Route path="/buscar" element={
          <AppLayout user={authUser} onLogout={handleLogout}><SearchScreen /></AppLayout>
        } />
        <Route path="/perfil/:id" element={
          <AppLayout user={authUser} onLogout={handleLogout}><ProfileScreen /></AppLayout>
        } />
    
        <Route path="/MiPerfil" element={authUser
<<<<<<< HEAD
      ? <AppLayout user={authUser} onLogout={handleLogout}>
        {authUser?.role === 'ong'
          ? <ProfileOngScreen user={authUser} onUpdateUser={handleUpdateUser} />
          : <MyProfileScreen user={authUser} />}
        </AppLayout>: <Navigate to="/login" replace />} />
=======
        ? <AppLayout user={authUser} onLogout={handleLogout}>
        <MyProfileScreen user={authUser} onUpdateUser={handleUpdateUser} />
        </AppLayout>
        : <Navigate to="/login" replace />
        } />
>>>>>>> main

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
