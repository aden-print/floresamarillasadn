export interface FlowerData {
  id: string;
  type: 'girasol' | 'ramillete' | 'margarita_dorada' | 'flor_estelar';
  title: string;
  message: string;
  subtitle?: string;
  hasSpecialButton?: boolean;
  specialButtonText?: string;
  actionType?: 'finale' | 'hug' | 'sunflowers' | 'petals' | 'shooting_star' | 'starlight' | 'sun_dawn' | 'butterflies' | 'light_burst' | 'cosmic_sparks' | 'hearts' | 'breeze' | 'celebration' | 'meteor' | 'infinite_love';
  x: number;
  y: number;
  z: number;
  scale: number;
  rotationSpeed: number;
  isCentral?: boolean;
  constellationGroup?: string;
}

export interface ConstellationData {
  id: string;
  name: string;
  flowerIds: string[];
  label: string;
  labelPosition: { x: number; y: number };
}

export const FLOWERS_DATA: FlowerData[] = [
  // ----------------------------------------------------
  // FLOR CENTRAL DEL UNIVERSO (Gran Final)
  // ----------------------------------------------------
  {
    id: "central",
    type: "girasol",
    title: "Flor del Universo 🌻",
    message: "Estas flores amarillas son como tú: brillantes, radiantes y llenas de alegría. Gracias por iluminar cada uno de mis días. Eres simplemente hermosa.",
    subtitle: "Para Mi Persona Favorita",
    hasSpecialButton: true,
    specialButtonText: "Descubrir el Secreto Cósmico 🚀✨",
    actionType: "finale",
    x: 0,
    y: 0,
    z: 1.25,
    scale: 1.45,
    rotationSpeed: 0.003,
    isCentral: true,
  },

  // ----------------------------------------------------
  // CONSTELACIÓN AMOR (Noroeste)
  // ----------------------------------------------------
  {
    id: "c1_f1",
    type: "girasol",
    title: "Mi Amor 💛",
    message: "Entre tantas estrellas y flores en cualquier universo, siempre terminaría encontrándote a ti. Tu presencia hace que todo a mi alrededor florezca.",
    subtitle: "Constelación Amor",
    hasSpecialButton: true,
    specialButtonText: "Recibir Abrazo Cálido 🤗",
    actionType: "hug",
    x: -0.45,
    y: -0.38,
    z: 0.95,
    scale: 0.95,
    rotationSpeed: 0.004,
    constellationGroup: "amor",
  },
  {
    id: "c1_f2",
    type: "ramillete",
    title: "Eres mi Alegría",
    message: "Tienes una luz cálida y bonita que llena de paz cualquier día. Gracias por ser tan dulce y por regalarme tu linda sonrisa.",
    subtitle: "Constelación Amor",
    hasSpecialButton: true,
    specialButtonText: "Lluvia de Girasoles 🌻",
    actionType: "sunflowers",
    x: -0.68,
    y: -0.22,
    z: 0.88,
    scale: 0.88,
    rotationSpeed: -0.003,
    constellationGroup: "amor",
  },
  {
    id: "c1_f3",
    type: "margarita_dorada",
    title: "Luz de mi Vida",
    message: "Que este 21 de septiembre sea solo una excusa para recordarte lo brillante, hermosa e importante que eres para mí.",
    subtitle: "Constelación Amor",
    hasSpecialButton: true,
    specialButtonText: "Lluvia de Pétalos Dorados 🍂",
    actionType: "petals",
    x: -0.32,
    y: -0.65,
    z: 1.05,
    scale: 1.0,
    rotationSpeed: 0.005,
    constellationGroup: "amor",
  },
  {
    id: "c1_f4",
    type: "flor_estelar",
    title: "Gracias por Existir",
    message: "Hay personas que hacen que el mundo sea un lugar más bonito simplemente existiendo. Tú eres sin duda mi favorita.",
    subtitle: "Constelación Amor",
    hasSpecialButton: true,
    specialButtonText: "Enviar una Estrella Fugaz 💫",
    actionType: "shooting_star",
    x: -0.58,
    y: -0.60,
    z: 0.82,
    scale: 0.82,
    rotationSpeed: -0.004,
    constellationGroup: "amor",
  },

  // ----------------------------------------------------
  // CONSTELACIÓN DESTINO (Noreste)
  // ----------------------------------------------------
  {
    id: "c2_f1",
    type: "girasol",
    title: "Coincidencia Mágica ✨",
    message: "Haberte conocido es de las cosas más bonitas que me han pasado. Cada momento a tu lado me regala una sonrisa sincera.",
    subtitle: "Constelación Destino",
    hasSpecialButton: true,
    specialButtonText: "Destello de Luces Mágicas 🌟",
    actionType: "starlight",
    x: 0.48,
    y: -0.40,
    z: 0.92,
    scale: 0.95,
    rotationSpeed: -0.004,
    constellationGroup: "destino",
  },
  {
    id: "c2_f2",
    type: "flor_estelar",
    title: "Un Sol para Ti 🌻",
    message: "Regalarte flores es lindo, pero regalarte un universo entero de flores amarillas es solo una muestra de cuánto te valoro.",
    subtitle: "Constelación Destino",
    hasSpecialButton: true,
    specialButtonText: "Amanecer Radiante ☀️",
    actionType: "sun_dawn",
    x: 0.72,
    y: -0.18,
    z: 0.82,
    scale: 0.85,
    rotationSpeed: 0.003,
    constellationGroup: "destino",
  },
  {
    id: "c2_f3",
    type: "ramillete",
    title: "Sonrisa de Primavera",
    message: "Tu risa tiene ese toque mágico que ilumina hasta el día más nublado. Nunca dejes de brillar así.",
    subtitle: "Constelación Destino",
    hasSpecialButton: true,
    specialButtonText: "Ráfaga de Mariposas Doradas 🦋",
    actionType: "butterflies",
    x: 0.35,
    y: -0.68,
    z: 1.0,
    scale: 0.9,
    rotationSpeed: -0.005,
    constellationGroup: "destino",
  },
  {
    id: "c2_f4",
    type: "margarita_dorada",
    title: "Siempre Radiante",
    message: "El color amarillo te queda hermoso porque combina exactamente con la calidez de tu corazón.",
    subtitle: "Constelación Destino",
    hasSpecialButton: true,
    specialButtonText: "Destello de Luz y Cariño ✨",
    actionType: "light_burst",
    x: 0.62,
    y: -0.62,
    z: 0.85,
    scale: 0.88,
    rotationSpeed: 0.004,
    constellationGroup: "destino",
  },

  // ----------------------------------------------------
  // CONSTELACIÓN REFUGIO (Suroeste)
  // ----------------------------------------------------
  {
    id: "c3_f1",
    type: "margarita_dorada",
    title: "Mi Lugar Favorito 🏡",
    message: "No importa dónde estemos en el mundo, estar contigo siempre transmite esa bonita sensación de estar en casa.",
    subtitle: "Constelación Refugio",
    hasSpecialButton: true,
    specialButtonText: "Sinfonía de Chispas Cósmicas 🎇",
    actionType: "cosmic_sparks",
    x: -0.55,
    y: 0.42,
    z: 0.92,
    scale: 0.92,
    rotationSpeed: 0.004,
    constellationGroup: "lugar_favorito",
  },
  {
    id: "c3_f2",
    type: "girasol",
    title: "Recuerdos Dorados",
    message: "Cada pétalo en este universo flotante lleva guardado un detalle lindo y un recuerdo especial a tu lado.",
    subtitle: "Constelación Refugio",
    hasSpecialButton: true,
    specialButtonText: "Nube de Corazones de Amor 💕",
    actionType: "hearts",
    x: -0.32,
    y: 0.68,
    z: 0.88,
    scale: 0.88,
    rotationSpeed: -0.002,
    constellationGroup: "lugar_favorito",
  },
  {
    id: "c3_f3",
    type: "flor_estelar",
    title: "Calma y Dulzura",
    message: "Tu dulzura le da una paz inmensa a mi vida. Gracias por ser tan linda y auténtica.",
    subtitle: "Constelación Refugio",
    hasSpecialButton: true,
    specialButtonText: "Brisa de Flores y Amor 🌸",
    actionType: "breeze",
    x: -0.75,
    y: 0.30,
    z: 0.78,
    scale: 0.8,
    rotationSpeed: 0.006,
    constellationGroup: "lugar_favorito",
  },

  // ----------------------------------------------------
  // CONSTELACIÓN SEPTIEMBRE (Sureste)
  // ----------------------------------------------------
  {
    id: "c4_f1",
    type: "girasol",
    title: "Feliz 21 de Septiembre 🌻",
    message: "Hoy el mundo celebra regalar flores amarillas, pero yo celebro tener la dicha de compartir la vida contigo.",
    subtitle: "Constelación Septiembre",
    hasSpecialButton: true,
    specialButtonText: "Celebración de Flores Amarillas 🎉",
    actionType: "celebration",
    x: 0.52,
    y: 0.45,
    z: 0.95,
    scale: 0.92,
    rotationSpeed: -0.003,
    constellationGroup: "septiembre",
  },
  {
    id: "c4_f2",
    type: "ramillete",
    title: "Flores para Ti",
    message: "Que la vida te devuelva multiplicado todo el amor, alegría y buena vibra que siempre le das a los demás.",
    subtitle: "Constelación Septiembre",
    hasSpecialButton: true,
    specialButtonText: "Pedir un Deseo al Cosmos 🌠",
    actionType: "meteor",
    x: 0.75,
    y: 0.32,
    z: 0.82,
    scale: 0.84,
    rotationSpeed: 0.005,
    constellationGroup: "septiembre",
  },
  {
    id: "c4_f3",
    type: "margarita_dorada",
    title: "Siempre Tú 💛",
    message: "De todas las flores en cualquier galaxia, siempre volvería a elegirte una y mil veces.",
    subtitle: "Constelación Septiembre",
    hasSpecialButton: true,
    specialButtonText: "Amor Infinito por Ti 💖",
    actionType: "infinite_love",
    x: 0.30,
    y: 0.70,
    z: 1.05,
    scale: 0.98,
    rotationSpeed: -0.004,
    constellationGroup: "septiembre",
  }
];

export const CONSTELLATIONS_DATA: ConstellationData[] = [
  {
    id: "amor",
    name: "Constelación Amor 💛",
    flowerIds: ["c1_f1", "c1_f2", "c1_f4", "c1_f3", "c1_f1"],
    label: "Constelación Amor 💛",
    labelPosition: { x: -0.50, y: -0.45 },
  },
  {
    id: "destino",
    name: "Constelación Destino ✨",
    flowerIds: ["c2_f1", "c2_f2", "c2_f4", "c2_f3", "c2_f1"],
    label: "Constelación Destino ✨",
    labelPosition: { x: 0.52, y: -0.45 },
  },
  {
    id: "lugar_favorito",
    name: "Constelación Refugio 🏡",
    flowerIds: ["c3_f1", "c3_f3", "c3_f2", "c3_f1"],
    label: "Mi Lugar Favorito 🏡",
    labelPosition: { x: -0.55, y: 0.50 },
  },
  {
    id: "septiembre",
    name: "Constelación 21.09 🌻",
    flowerIds: ["c4_f1", "c4_f2", "c4_f3", "c4_f1"],
    label: "21 de Septiembre 🌻",
    labelPosition: { x: 0.55, y: 0.52 },
  }
];
