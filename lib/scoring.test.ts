import assert from "node:assert/strict";
import test from "node:test";
import { questions, type VillainKey } from "../data/questions";
import { parseResult, scoreAnswers } from "./scoring";

const keys: VillainKey[] = ["voldemort", "bellatrix", "umbridge", "lucius"];

function answersFor(winners: VillainKey[]): number[] {
  return winners.map((key, index) =>
    questions[index].choices.findIndex((choice) => choice.key === key),
  );
}

test("each of eight questions maps four choices to the four villains", () => {
  assert.equal(questions.length, 8);
  for (const question of questions) {
    assert.ok(question.text.trim());
    assert.equal(question.choices.length, 4);
    assert.deepEqual(
      question.choices.map((choice) => choice.key).sort(),
      [...keys].sort(),
    );
    for (const choice of question.choices) assert.ok(choice.text.trim());
  }
});

test("each villain can win outright", () => {
  for (const key of keys) {
    assert.equal(scoreAnswers(answersFor(Array(8).fill(key))), key);
  }
});

test("changed answers are rescored without retaining earlier counts", () => {
  const answers = answersFor(Array(8).fill("voldemort"));
  assert.equal(scoreAnswers(answers), "voldemort");
  const changed = answersFor([
    "bellatrix", "bellatrix", "bellatrix", "bellatrix",
    "bellatrix", "voldemort", "voldemort", "voldemort",
  ]);
  answers.splice(0, answers.length, ...changed);
  assert.equal(scoreAnswers(answers), "bellatrix");
  assert.deepEqual(answers, changed);
});

test("ties use the latest answer belonging to a tied highest scorer", () => {
  assert.equal(
    scoreAnswers(answersFor([
      "voldemort", "voldemort", "voldemort", "voldemort",
      "bellatrix", "bellatrix", "bellatrix", "bellatrix",
    ])),
    "bellatrix",
  );
  assert.equal(
    scoreAnswers(answersFor([
      "bellatrix", "bellatrix", "bellatrix", "bellatrix",
      "voldemort", "voldemort", "voldemort", "voldemort",
    ])),
    "voldemort",
  );
  assert.equal(
    scoreAnswers(answersFor([
      "voldemort", "bellatrix", "voldemort", "bellatrix",
      "voldemort", "bellatrix", "umbridge", "lucius",
    ])),
    "bellatrix",
  );
  assert.equal(
    scoreAnswers(answersFor([
      "voldemort", "bellatrix", "umbridge", "lucius",
      "voldemort", "bellatrix", "umbridge", "lucius",
    ])),
    "lucius",
  );
});

test("all 4^8 combinations match a separate ranking-based scorer", () => {
  for (let combination = 0; combination < 4 ** 8; combination += 1) {
    const answers = Array.from(
      { length: 8 },
      (_, index) => (combination >>> (index * 2)) & 3,
    );
    const selected = answers.map(
      (answer, index) => questions[index].choices[answer].key,
    );
    const ranking = keys.map((key) => ({
      key,
      count: selected.filter((answer) => answer === key).length,
      last: selected.lastIndexOf(key),
    }));
    ranking.sort((a, b) => b.count - a.count || b.last - a.last);
    assert.equal(scoreAnswers(answers), ranking[0].key);
  }
});

test("invalid answer lengths, types, indexes, and sparse arrays throw", () => {
  const invalid: unknown[] = [
    [], Array(7).fill(0), Array(9).fill(0), Array(8),
    null, undefined, "00000000", { length: 8 },
  ];
  for (const value of [-1, 4, 0.5, NaN, Infinity, -Infinity, "0", null, undefined]) {
    invalid.push([value, ...Array(7).fill(0)]);
  }
  for (const answers of invalid) {
    assert.throws(() => scoreAnswers(answers as number[]));
  }
});

test("result parsing accepts only exact own villain keys", () => {
  for (const key of keys) assert.equal(parseResult(key), key);
  for (const value of [
    "__proto__", "constructor", "prototype", "toString", "hasOwnProperty",
    "Voldemort", " voldemort", "voldemort ", "", null, undefined, 0,
    {}, ["voldemort"], new String("voldemort"),
    { toString: () => "voldemort" },
  ]) {
    assert.equal(parseResult(value), null);
  }
});
