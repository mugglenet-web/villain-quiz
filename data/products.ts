export const products: Record<
  "voldemort" | "malfoy" | "spellbook",
  { title: string; image: string; url: string }
> = {
  voldemort: {
    title: "Voldemort: An Unofficial Exploration",
    image: "https://mugglenet.com/wp-content/uploads/2026/08/voldemort-cover.webp",
    url: "https://link.amazon/B06JVLEKr",
  },
  malfoy: {
    title: "Malfoy: The Fall and the Fate of the Wizarding World's Most Treacherous Family",
    image: "https://mugglenet.com/wp-content/uploads/2026/08/malfoy-cover-scaled.webp",
    url: "https://link.amazon/B04DhdAbk",
  },
  spellbook: {
    title: "The Ultimate Wizarding World Spellbook – Headmaster's Edition",
    image: "https://mugglenet.com/wp-content/uploads/2026/09/81nsp3DIIhL._SL1500_.avif",
    url: "https://link.amazon/B008btzWe",
  },
};
