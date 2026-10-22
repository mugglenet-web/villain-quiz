import type { VillainKey } from "./questions";
import type { products } from "./products";

export const results: Record<
  VillainKey,
  {
    name: string;
    subtitle: string;
    description: string;
    observation: string;
    theme: string;
    portrait: VillainKey;
    book: keyof typeof products;
    headline: string;
    copy: string;
    cta: string;
  }
> = {
  voldemort: {
    name: "Lord Voldemort",
    subtitle: "You have big plans. Possibly concerningly big plans.",
    description: "You're ambitious, fiercely independent, and not particularly interested in doing things just because everyone else does. You value intelligence, competence, and people who can keep up with you.",
    observation: "Your five-year plan probably requires a prophecy.",
    theme: "#84cba2",
    portrait: "voldemort",
    book: "voldemort",
    headline: "Think You Understand the Dark Lord?",
    copy: "There's much more to Tom Riddle than even his most devoted followers knew. Explore the life, ambition, and dark legacy of the wizard who became Lord Voldemort.",
    cta: "EXPLORE VOLDEMORT'S STORY",
  },
  bellatrix: {
    name: "Bellatrix Lestrange",
    subtitle: "Subtlety has never really been your thing.",
    description: "You feel everything intensely, from excitement and affection to frustration and disappointment. Your biggest weakness? Sometimes your emotions get the better of your judgment. But at least nobody will ever accuse you of lacking personality. Or volume.",
    observation: "Your indoor voice has never been located.",
    theme: "#c2a0ed",
    portrait: "bellatrix",
    book: "spellbook",
    headline: "Every Witch Needs a Few Good Spells",
    copy: "From everyday charms to the darker corners of magical history, discover more than 240 spells, charms, curses, hexes, and jinxes in this beautifully crafted spellbook.",
    cta: "EXPLORE THE SPELLBOOK",
  },
  umbridge: {
    name: "Dolores Umbridge",
    subtitle: "You just want everyone to follow a few very reasonable rules. Is that so much to ask?",
    description: "You appreciate structure, good manners, and knowing exactly what to expect. Your biggest weakness? You can sometimes mistake your personal preferences for universal standards. Still, there's nothing wrong with wanting a little order.",
    observation: "Even your spontaneous plans have a filing system.",
    theme: "#E2A0C4",
    portrait: "umbridge",
    book: "spellbook",
    headline: "A Little More Magical Education",
    copy: "Expand your magical knowledge with a beautifully crafted collection of more than 240 spells, charms, curses, hexes, and jinxes. Educational Decrees not included.",
    cta: "EXPLORE THE SPELLBOOK",
  },
  lucius: {
    name: "Lucius Malfoy",
    subtitle: "You have excellent taste, impeccable timing, and a suspiciously impressive contact list.",
    description: "You're sophisticated, observant, and remarkably good at reading a room. Your biggest weakness? You care a little too much about what other people think, especially people you consider important. Still, you know how to make an entrance.",
    observation: "Your networking strategy comes with a matching cane.",
    theme: "#aed2bc",
    portrait: "lucius",
    book: "malfoy",
    headline: "A Family Name Worth Investigating",
    copy: "Old money, powerful connections, and a family history full of secrets. Discover the complicated legacy of the Malfoys in this unofficial exploration.",
    cta: "DISCOVER THE MALFOY LEGACY",
  },
};
