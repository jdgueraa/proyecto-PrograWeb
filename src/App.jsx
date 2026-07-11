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

// ANTES: import dataJson from './data.json';
// AHORA: ya no leemos datos fijos de un archivo. Usamos api.js, que
// centraliza las llamadas al backend (ver src/api.js).
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

  // Mientras intentamos restaurar la sesión (useEffect de abajo), no
  // queremos que las rutas protegidas redirijan a /login antes de tiempo
  // solo porque authUser todavía es null momentáneamente.
  const [cargandoSesion, setCargandoSesion] = useState(true);

  // ANTES: useState(() => dataJson.campañas) — arrancaban con el arreglo
  // fijo del archivo (o lo guardado en localStorage).
  // AHORA: arrancan vacíos y se llenan pidiéndoselos al backend (ver
  // el primer useEffect de abajo).
  const [campañas, setCampañas] = useState([]);
  const [voluntariados, setVoluntariados] = useState([]);

  // ── Cargar campañas y voluntariados desde el backend ──
  // El arreglo [] al final significa "ejecuta esto una sola vez, apenas
  // se abre la app" (no en cada re-render).
  useEffect(() => {
    api.get('/campanas').then(setCampañas).catch(() => setCampañas([]));
    api.get('/voluntariados').then(setVoluntariados).catch(() => setVoluntariados([]));
  }, []);

  // ── Restaurar sesión al recargar la página ──
  // Si ya había un token guardado de una sesión anterior, le preguntamos
  // al backend "¿de quién es este token?" (GET /api/me) en vez de asumir
  // que no hay nadie logueado.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCargandoSesion(false);
      return;
    }
    api.get('/me')
      .then(setAuthUser)
      .catch(() => localStorage.removeItem('token')) // token vencido o inválido
      .finally(() => setCargandoSesion(false));
  }, []);

  // ANTES: buscaba el correo/contraseña dentro de dataJson.usuarios.
  // AHORA: se los manda al backend, que los revisa contra la base de
  // datos real y devuelve un token + los datos del usuario.
  async function handleLogin(email, password) {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) return 'Ingresa correo y contraseña.';

    try {
      const { token, user } = await api.post('/auth/login', { email: trimmedEmail, password });
      localStorage.setItem('token', token); // el "pase" para las siguientes peticiones
      setAuthUser(user);
      return '';
    } catch (err) {
      return err.message; // ej: "Usuario o contraseña incorrectos."
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setAuthUser(null);
  }

  // ANTES: guardaba el usuario actualizado directo en localStorage.
  // AHORA: le pide al backend que guarde los cambios (PUT /api/me) y
  // actualiza el estado con lo que el backend confirma que quedó guardado.
  // Las pantallas que llaman a esta función (MyProfileScreen,
  // ProfileOngScreen) pueden seguir mandando el objeto que ya arman hoy;
  // el backend solo toma los campos que reconoce (fullName, username,
  // photoUrl, biografia) e ignora el resto.
  async function handleUpdateUser(camposActualizados) {
    const user = await api.put('/me', camposActualizados);
    setAuthUser(user);
    return user;
  }

  // Vuelve a pedir el perfil completo al backend. Útil después de una
  // acción que el backend maneja por su cuenta (por ejemplo seguir una
  // ONG), para refrescar authUser con los datos más recientes.
  async function refreshUser() {
    const user = await api.get('/me');
    setAuthUser(user);
  }

  // ANTES: esta función hacía tres cosas "a mano" en el navegador: sumaba
  // el monto a la campaña, restaba los créditos al usuario, y guardaba un
  // log en localStorage para que el admin viera quién donó.
  // AHORA: todo eso lo hace el backend en una sola operación seguem
  // (POST /api/donaciones), y nos devuelve la campaña y el usuario ya
  // actualizados — no hay que calcular nada aquí.
  async function handleDonate(campañaId, amount) {
    const { user, campana } = await api.post('/donaciones', {
      campanaId: campañaId,
      monto: amount,
    });
    setAuthUser(user);
    setCampañas(prev => prev.map(c => (c.id === campana.id ? campana : c)));
  }

  // ANTES: sumaba 1 cupo ocupado "a mano" sin validar nada.
  // AHORA: el backend valida que haya cupos y que no estés ya postulado
  // (POST /api/postulaciones) antes de aceptar la postulación.
  async function handlePostular(voluntariadoId) {
    const { voluntariado } = await api.post('/postulaciones', { voluntariadoId });
    setVoluntariados(prev => prev.map(v => (v.id === voluntariado.id ? voluntariado : v)));
    await refreshUser(); // para que el listado de postulaciones del usuario quede al día
  }

  // ANTES: AdminScreen armaba el objeto de campaña completo (id, badge,
  // donantes, etc.) y App.jsx solo lo metía en el arreglo.
  // AHORA: solo mandamos los datos del formulario (POST /api/campanas) y
  // el backend arma el resto (id real de la base de datos, badge según
  // el avance, etc.). AdminScreen.jsx debe actualizarse para mandar solo
  // los campos del formulario, no el objeto completo (ver comentario allá).
  async function handleCreateCampaña(datosFormulario) {
    const nuevaCampaña = await api.post('/campanas', datosFormulario);
    setCampañas(prev => [...prev, nuevaCampaña]);
  }

  async function handleCreateVoluntariado(datosFormulario) {
    const nuevoVol = await api.post('/voluntariados', datosFormulario);
    setVoluntariados(prev => [...prev, nuevoVol]);
  }

  // Evita parpadear a /login antes de terminar de comprobar si había una
  // sesión guardada.
  if (cargandoSesion) return null;

  return (
    <BrowserRouter>
      <Routes>


        <Route path="/"         element={<LoginScreen onLogin={handleLogin} />} />
        <Route path="/login"    element={<LoginScreen onLogin={handleLogin} />} />
        <Route path="/registro" element={<RegisterScreen />} />
        <Route path="/home" element={
          !authUser 
          ? <Navigate to="/login" replace />
          : authUser.role === 'ong'
          ? <Navigate to="/admin" replace />
          : (
        <AppLayout user={authUser} onLogout={handleLogout}>
          <HomeScreen user={authUser} onDonate={handleDonate} />
        </AppLayout>
            )
        } />
        <Route path="/buscar" element={
          <AppLayout user={authUser} onLogout={handleLogout}><SearchScreen /></AppLayout>
        } />
        <Route path="/perfil/:id" element={
          <AppLayout user={authUser} onLogout={handleLogout}>
            <ProfileScreen user={authUser} onUpdateUser={handleUpdateUser} />
          </AppLayout>
        } />

        <Route path="/MiPerfil" element={authUser
          ? <AppLayout user={authUser} onLogout={handleLogout}>
              {authUser?.role === 'ong'
                ? <ProfileOngScreen user={authUser} onUpdateUser={handleUpdateUser} />
                // onUpdateUser: se la pasamos para que MyProfileScreen pueda
                // guardar la foto de perfil con PUT /api/me (antes no la recibía).
                : <MyProfileScreen user={authUser} onUpdateUser={handleUpdateUser} />}
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
