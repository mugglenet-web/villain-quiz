import { embed } from "@/data/config";
import type { VillainKey } from "@/data/questions";

type Events = {
  quiz_view: { embedded: boolean };
  quiz_start: Record<string, never>;
  quiz_question_answered: { question: number; choice: number; changed: boolean };
  quiz_complete: { result: VillainKey };
  quiz_result_view: { result: VillainKey; source: "quiz" | "saved" | "link" };
  quiz_share: { result: VillainKey; method: "native" | "copy" };
  quiz_replay: Record<string, never>;
  quiz_book_click: { result: VillainKey; product: string };
};

declare global {
  interface Window {
    mugglenetQuizAnalytics?: (event: keyof Events, fields: Events[keyof Events]) => void | Promise<void>;
  }
}

export function parentOrigin(): string | null {
  if (typeof window === "undefined" || window.parent === window) return null;
  try {
    const origin = new URL(document.referrer).origin;
    return embed.allowedOrigins.find((allowed) => allowed === origin) ?? null;
  } catch { return null; }
}

export function track<E extends keyof Events>(event: E, fields: Events[E]) {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent("mugglenet-quiz:event", { detail: { event, fields } }));
    const pending = window.mugglenetQuizAnalytics?.(event, fields);
    if (pending) void Promise.resolve(pending).catch(() => {});
  } catch { /* Analytics must never interrupt the game. */ }
  if (embed.forwardAnalytics) {
    const origin = parentOrigin();
    if (origin) window.parent.postMessage({ type: embed.analyticsEvent, event, fields }, origin);
  }
}
