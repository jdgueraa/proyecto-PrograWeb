import React from 'react';
import './App.css'; 

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importamos el componente fijo
import Sidebar from './components/Sidebar';

// Importamos las pantallas completas
import SearchScreen from './screens/SearchScreen';
import ProfileScreen from './screens/ProfileScreen';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* El menú se queda siempre pintado a la izquierda */}
        <Sidebar />
        
        {/* El contenedor derecho cambia de PANTALLA según la URL */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<SearchScreen />} />
            <Route path="/perfil/:id" element={<ProfileScreen />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}