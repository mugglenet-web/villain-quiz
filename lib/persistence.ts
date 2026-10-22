import { experience } from "@/data/config";
import { parseResult, scoreAnswers } from "@/lib/scoring";
import type { VillainKey } from "@/data/questions";

export type SavedQuiz = { answers: number[]; questionIndex: number; result: VillainKey | null };

export function validateSavedQuiz(value: unknown): SavedQuiz | null {
  if (!value || typeof value !== "object") return null;
  const state = value as Record<string, unknown>;
  if (!Array.isArray(state.answers) || state.answers.length > 8 ||
      !state.answers.every((answer) => Number.isInteger(answer) && answer >= 0 && answer < 4) ||
      !Number.isInteger(state.questionIndex) || (state.questionIndex as number) < 0 ||
      (state.questionIndex as number) > 7 || (state.questionIndex as number) > state.answers.length) return null;
  const result = parseResult(state.result);
  if (state.result !== null && !result) return null;
  if (result && (state.answers.length !== 8 || scoreAnswers(state.answers) !== result)) return null;
  return { answers: state.answers, questionIndex: state.questionIndex as number, result };
}

export function loadQuiz(): SavedQuiz | null {
  try {
    const raw = localStorage.getItem(experience.storageKey);
    return raw ? validateSavedQuiz(JSON.parse(raw)) : null;
  } catch { return null; }
}

export function saveQuiz(state: SavedQuiz) {
  try { localStorage.setItem(experience.storageKey, JSON.stringify(state)); } catch { /* Storage may be disabled in an iframe. */ }
}

export function clearQuiz() {
  try { localStorage.removeItem(experience.storageKey); } catch { /* The quiz still works without storage. */ }
}
