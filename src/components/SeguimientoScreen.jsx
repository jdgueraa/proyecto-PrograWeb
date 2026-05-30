import React from 'react';
import { campañas } from '../data.json'; // Importamos las campañas globales para el progreso

export default function SeguimientoScreen({ user }) {

    // 1. OBTENER HISTORIALES DESDE EL USUARIO LOGUEADO
    // Si por alguna razón el JSON no tiene los arreglos, usamos un arreglo vacío `[]` por defecto
    const historialVoluntariados = user?.historialVoluntariados || [];
    const historialDonaciones = user?.historialDonaciones || [];

    // 2. CÁLCULOS DINÁMICOS MEDIANTE MÉTODOS DE JAVASCRIPT (.reduce)

    // Sumamos todas las horas aportadas en el historial de voluntariados
    const totalHorasDonadas = historialVoluntariados.reduce((suma, item) => suma + item.horasAportadas, 0);

    // Sumamos todos los montos de dinero aportados en el historial de donaciones
    const misDonacionesTotales = historialDonaciones.reduce((suma, item) => suma + item.monto, 0);

    // 3. PROCESAR HORAS POR ONG PARA EL GRÁFICO 1
    // Filtramos y sumamos las horas específicamente para Tierra Verde (ID 1) y Salud Para Todos (ID 3)
    const horasTierraVerde = historialVoluntariados
        .filter(item => item.ongId === 1)
        .reduce((suma, item) => suma + item.horasAportadas, 0);

    const horasSaludParaTodos = historialVoluntariados
        .filter(item => item.ongId === 3)
        .reduce((suma, item) => suma + item.horasAportadas, 0);

    // Calculamos los porcentajes de las barras (evitando dividir entre 0 si no hay horas)
    const porcentajeBarraVerde = totalHorasDonadas > 0 ? (horasTierraVerde / totalHorasDonadas) * 100 : 0;
    const porcentajeBarraRoja = totalHorasDonadas > 0 ? (horasSaludParaTodos / totalHorasDonadas) * 100 : 0;


    return (
        <div className="dashboard-section seguimiento-container animate-fade">
            <h3>📈 Mi Panel de Impacto Social (Dinámico)</h3>
            <p className="section-desc">Aquí puedes ver el seguimiento estadístico generado automáticamente desde tu historial de aportes.</p>

            {/* TARJETAS DE RESUMEN AUTOMÁTICAS */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <span className="kpi-title">Mis Créditos Disponibles</span>
                    <span className="kpi-value">S/. {user.creditos || 0}</span>
                </div>
                <div className="kpi-card">
                    <span className="kpi-title">Total Horas Donadas</span>
                    <span className="kpi-value">{totalHorasDonadas} hrs</span>
                </div>
                <div className="kpi-card">
                    <span className="kpi-title">Mis Donaciones Totales</span>
                    <span className="kpi-value">S/. {misDonacionesTotales.toFixed(2)}</span>
                </div>
            </div>

            <div className="graphics-layout">

                {/* GRÁFICO 1: HORAS INDIVIDUALES POR ORGANIZACIÓN */}
                <div className="chart-box">
                    <h4>⏱️ Mis Horas de Voluntariado por ONG</h4>
                    <p className="chart-subtitle">Distribución real de tus {totalHorasDonadas} horas aportadas en campo.</p>

                    <div className="bar-chart-pure">
                        {/* Barra para Tierra Verde (Id 1) */}
                        <div className="bar-group">
                            <span className="bar-label">🌱 Tierra Verde Perú</span>
                            <div className="bar-track">
                                <div className="bar-fill-color color-verde" style={{ width: `${porcentajeBarraVerde}%` }}>
                                    <span className="bar-percentage">{horasTierraVerde} hrs</span>
                                </div>
                            </div>
                        </div>

                        {/* Barra para Salud Para Todos (Id 3) */}
                        <div className="bar-group">
                            <span className="bar-label">🏥 Salud Para Todos</span>
                            <div className="bar-track">
                                <div className="bar-fill-color color-rojo" style={{ width: `${porcentajeBarraRoja}%` }}>
                                    <span className="bar-percentage">{horasSaludParaTodos} hrs</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GRÁFICO 2: MI APORTE INDIVIDUAL VS PROGRESO GLOBAL DE LAS CAMPAÑAS */}
                <div className="chart-box">
                    <h4>💰 Mis Donaciones vs. Progreso Global</h4>
                    <p className="chart-subtitle">Tu colaboración cruzada con el estado actual de las campañas en las que participas.</p>

                    <div className="campaign-compare-list">

                        {historialDonaciones.map((donacion, index) => {
                            // BUSQUEDA DINÁMICA: Buscamos en el arreglo global de campañas la que coincida con el id del historial
                            const globalCamp = campañas.find(c => c.id === donacion.campañaId);

                            // Si no encuentra la campaña en el JSON por seguridad, no renderizamos nada roto
                            if (!globalCamp) return null;

                            // Calculamos el porcentaje global de recaudación de la campaña
                            const porcentajeGlobal = (globalCamp.actual / globalCamp.meta) * 100;
                            // Calculamos qué porcentaje representa el dinero de este usuario frente al pozo actual
                            const porcentajeUsuario = (donacion.monto / globalCamp.actual) * 100;

                            return (
                                <div key={index} className="campaign-compare-item">
                                    <h5>{globalCamp.name}</h5>
                                    <div className="comparison-badges">
                                        <span className="badge-user">Tú donaste: <strong>S/. {donacion.monto.toFixed(2)}</strong></span>
                                        <span className="badge-global">Total Campaña: <strong>S/. {globalCamp.actual} / S/. {globalCamp.meta}</strong></span>
                                    </div>
                                    <div className="progress-bar-container">
                                        {/* La barra se pinta usando el color dinámico correspondiente a la ONG */}
                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                width: `${porcentajeGlobal}%`,
                                                backgroundColor: donacion.ongId === 3 ? '#3498db' : '#2ecc71'
                                            }}
                                        ></div>
                                    </div>
                                    <p className="comparison-footer">
                                        Tu granito de arena representa el {porcentajeUsuario.toFixed(2)}% del fondo recolectado hasta hoy.
                                    </p>
                                </div>
                            );
                        })}

                        {historialDonaciones.length === 0 && (
                            <p className="empty-row">No registras aportes económicos en campañas todavía.</p>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}