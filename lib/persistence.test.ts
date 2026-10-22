import assert from "node:assert/strict";
import { test } from "node:test";
import { experience } from "../data/config";
import { clearQuiz, loadQuiz, saveQuiz, validateSavedQuiz } from "./persistence";
import { scoreAnswers } from "./scoring";

test("saved progress validates and preserves previously answered questions", () => {
  const state = { answers: [0, 1, 2, 3], questionIndex: 1, result: null };
  assert.deepEqual(validateSavedQuiz(state), state);
  assert.deepEqual(validateSavedQuiz({ answers: [], questionIndex: 0, result: null }), { answers: [], questionIndex: 0, result: null });
});

test("completed saves must match deterministic scoring", () => {
  const answers = [0, 1, 2, 3, 0, 1, 2, 3];
  const result = scoreAnswers(answers);
  assert.deepEqual(validateSavedQuiz({ answers, questionIndex: 7, result }), { answers, questionIndex: 7, result });
  const wrong = result === "voldemort" ? "bellatrix" : "voldemort";
  assert.equal(validateSavedQuiz({ answers, questionIndex: 7, result: wrong }), null);
});

test("reject malformed state, invalid results, and impossible progress", () => {
  for (const value of [
    null, "state", {}, { answers: [], questionIndex: 7, result: null },
    { answers: [-1], questionIndex: 0, result: null },
    { answers: [4], questionIndex: 0, result: null },
    { answers: [1.5], questionIndex: 0, result: null },
    { answers: [null], questionIndex: 0, result: null },
    { answers: Array(9).fill(0), questionIndex: 7, result: null },
    { answers: [], questionIndex: 0.5, result: null },
    { answers: [], questionIndex: -1, result: null },
    { answers: [], questionIndex: 0, result: "__proto__" },
    { answers: [0], questionIndex: 0, result: "bellatrix" },
  ]) assert.equal(validateSavedQuiz(value), null);
});

test("storage failures never interrupt save, restore, or retake", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  try {
    Object.defineProperty(globalThis, "localStorage", { configurable: true, get() { throw new Error("Storage blocked"); } });
    assert.equal(loadQuiz(), null);
    assert.doesNotThrow(() => saveQuiz({ answers: [], questionIndex: 0, result: null }));
    assert.doesNotThrow(clearQuiz);
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});

test("storage round-trips, handles corrupt JSON, and retake removes only quiz state", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
  });
  try {
    const state = { answers: [0, 1], questionIndex: 2, result: null };
    saveQuiz(state);
    assert.deepEqual(loadQuiz(), state);
    values.set(experience.storageKey, "{broken");
    assert.equal(loadQuiz(), null);
    values.set("unrelated", "keep");
    clearQuiz();
    assert.equal(values.has(experience.storageKey), false);
    assert.equal(values.get("unrelated"), "keep");
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});
