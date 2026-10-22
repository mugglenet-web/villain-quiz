import { questions, type VillainKey } from "../data/questions";

const villainKeys: Record<VillainKey, true> = {
  voldemort: true,
  bellatrix: true,
  umbridge: true,
  lucius: true,
};

export function parseResult(value: unknown): VillainKey | null {
  return typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(villainKeys, value)
    ? (value as VillainKey)
    : null;
}

export function scoreAnswers(answers: number[]): VillainKey {
  if (
    !Array.isArray(answers) ||
    answers.length !== 8 ||
    Array.from(answers).some(
      (answer) => !Number.isInteger(answer) || answer < 0 || answer > 3,
    )
  ) {
    throw new Error("Expected exactly eight answer indexes between 0 and 3.");
  }

  const counts: Record<VillainKey, number> = {
    voldemort: 0,
    bellatrix: 0,
    umbridge: 0,
    lucius: 0,
  };
  const selected = answers.map(
    (answer, index) => questions[index].choices[answer].key,
  );
  for (const key of selected) counts[key] += 1;

  const highest = Math.max(...Object.values(counts));
  for (let index = selected.length - 1; index >= 0; index -= 1) {
    const key = selected[index];
    if (counts[key] === highest) return key;
  }

  throw new Error("Unable to score answers.");
}
