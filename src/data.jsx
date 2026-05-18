// src/data.js

export const ongs = [
  {
    id: 1,
    emoji: "🌱",
    name: "Tierra Verde Perú",
    location: "Lima, Perú",
    desc: "Reforestación y conservación de ecosistemas en zonas vulnerables de la Amazonía peruana.",
    tags: ["Medio Ambiente", "ODS 15", "Voluntariado"],
    seguidores: 1240,
    campañas: 3,
    color: "#d4f5e9",
    banner: "linear-gradient(135deg, #2d9b6f, #0f9f8a)",
    featured: false // Estado destacado para HomeScreen
  },
  {
    id: 2,
    emoji: "📚",
    name: "Educa Contigo",
    location: "Cusco, Perú",
    desc: "Acceso a educación de calidad para niños en comunidades rurales de la sierra peruana.",
    tags: ["Educación", "ODS 4", "Donaciones"],
    seguidores: 870,
    campañas: 5,
    color: "#e0f2fe",
    banner: "linear-gradient(135deg, #0284c7, #0ea5e9)",
    featured: false // Estado destacado para HomeScreen
  },
  {
    id: 3,
    emoji: "🏥",
    name: "Salud Para Todos",
    location: "Arequipa, Perú",
    desc: "Campañas médicas itinerantes y entrega de medicamentos esenciales en zonas de friaje.",
    tags: ["Salud", "ODS 3", "Campañas"],
    seguidores: 1950,
    campañas: 2,
    color: "#fee2e2",
    banner: "linear-gradient(135deg, #ef4444, #f43f5e)",
    featured: true // Estado destacado para HomeScreen
  }
];

export const categories = ["Todas", "Medio Ambiente", "Educación", "Salud", "Agua", "Pobreza"];

export const campañas = [
  {
    name: "Plantemos 10,000 árboles en Loreto",
    meta: 15000,
    actual: 11200,
    badge: "Activa",
    badgeClass: "badge-active",
    desc: "Reforestación urgente de zonas deforestadas por minería ilegal.",
    urgent: true // Estado urgente para HomeScreen
  },
  {
    name: "Biblioteca comunitaria en Ollantaytambo",
    meta: 8000,
    actual: 8300,
    badge: "¡Lograda!",
    badgeClass: "badge-success",
    desc: "Implementación de estanterías, libros y computadoras para niños de la zona.",
    urgent: false // Estado urgente para HomeScreen
  }
];