export const assets = {
  logo: "https://mugglenet.com/wp-content/uploads/2026/04/MuggleNet-Logo-Orange-1-scaled.png",
  intro: "https://mugglenet.com/wp-content/uploads/2026/10/intro-background.png",
  panorama: "https://mugglenet.com/wp-content/uploads/2026/10/questions-background-scaled.png",
  results: "https://mugglenet.com/wp-content/uploads/2026/10/villain-results-background.png",
  voldemort: "https://mugglenet.com/wp-content/uploads/2026/10/Voldemort-Unleashes-Emerald-Magic.png",
  bellatrix: "https://mugglenet.com/wp-content/uploads/2026/10/Bellatrix-Inspired-Dark-Witch-with-Teal-Magic.png",
  umbridge: "https://mugglenet.com/wp-content/uploads/2026/10/Pink-Aristocrat-Casting-Spells.png",
  lucius: "https://mugglenet.com/wp-content/uploads/2026/10/Aristocratic-Wizard-with-Serpentine-Magic.png",
  selectionAudio: "https://mugglenet.com/wp-content/uploads/2026/10/selection-noise.mp3",
  revealAudio: "https://mugglenet.com/wp-content/uploads/2026/10/results-noise.mp3",
  ambientAudio: "https://mugglenet.com/wp-content/uploads/2026/10/ambient-background-music-villain-quiz.mp3",
  social: "https://mugglenet.com/wp-content/uploads/2026/10/villain-quiz-feature.png",
} as const;

export const destinations = {
  brand: "https://mugglenet.com/",
  share: "https://mugglenet.com/games/villain-quiz",
} as const;

export const sources = {
  assets: "https://mugglenet.com",
  fontStyles: "https://fonts.googleapis.com",
  fontFiles: "https://fonts.gstatic.com",
  fontStylesheet: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap",
} as const;

export const embed = {
  allowedOrigins: ["https://mugglenet.com", "https://www.mugglenet.com"],
  resizeEvent: "mugglenet-quiz:resize",
  analyticsEvent: "mugglenet-quiz:analytics",
  forwardAnalytics: false,
} as const;

export const experience = {
  storageKey: "mugglenet-villain-quiz:v1",
  panorama: { minimumWidth: "180vw", aspectRatio: 2.8, duration: 1.05 },
  timing: {
    answer: 360, halfway: 1400, calculation: 2800, reveal: 1800,
    crossfade: 1.1, question: 0.2, intro: 0.5, portal: 1, portrait: 0.5, result: 0.7,
  },
  calculation: [
    "Consulting the Dark Arts...",
    "Examining your questionable decisions...",
    "Searching the Ministry's records...",
    "Your true nature has been revealed.",
  ],
  colors: {
    ink: "#0D2232", plum: "#3D1336", green: "#0B5137", gold: "#F4D659",
    pink: "#E2A0C4", orange: "#E84E28", parchment: "#E8E8DD",
  },
  resultShadows: {
    voldemort: "#04180e",
    bellatrix: "#180c25",
    umbridge: "#280f21",
    lucius: "#08241d",
  },
} as const;
