import assert from "node:assert/strict";
import { test } from "node:test";
import { parentOrigin, track } from "./analytics";

test("standalone analytics is safe without a browser", () => {
  assert.equal(parentOrigin(), null);
  assert.doesNotThrow(() => track("quiz_start", {}));
});

test("only exact approved referrer origins can receive messages", () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  try {
    Object.defineProperty(globalThis, "window", { configurable: true, value: { parent: {} } });
    for (const [referrer, expected] of [
      ["https://mugglenet.com/games/villain-quiz", "https://mugglenet.com"],
      ["https://www.mugglenet.com/games/villain-quiz", "https://www.mugglenet.com"],
      ["https://mugglenet.com.attacker.test/", null],
      ["https://mugglenet.com@attacker.test/", null],
      ["http://mugglenet.com/", null],
      ["https://mugglenet.com:8080/", null],
      ["", null],
    ]) {
      Object.defineProperty(globalThis, "document", { configurable: true, value: { referrer } });
      assert.equal(parentOrigin(), expected);
    }
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
    if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
    else Reflect.deleteProperty(globalThis, "document");
  }
});

test("analytics sends controlled fields and tolerates synchronous and async adapter errors", async () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const events: CustomEvent[] = [];
  let messages = 0;
  const mock = {
    dispatchEvent: (event: CustomEvent) => { events.push(event); },
    parent: { postMessage: () => { messages += 1; } },
    mugglenetQuizAnalytics: (): void | Promise<void> => { throw new Error("Adapter unavailable"); },
  };
  Object.defineProperty(globalThis, "window", { configurable: true, value: mock });
  try {
    assert.doesNotThrow(() => track("quiz_question_answered", { question: 2, choice: 3, changed: true }));
    assert.deepEqual(events[0].detail, { event: "quiz_question_answered", fields: { question: 2, choice: 3, changed: true } });
    mock.mugglenetQuizAnalytics = () => Promise.reject(new Error("Network unavailable"));
    assert.doesNotThrow(() => track("quiz_start", {}));
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(messages, 0, "parent analytics forwarding is off by default");
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
