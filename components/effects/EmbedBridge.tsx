"use client";

import { useEffect } from "react";
import { embed } from "@/data/config";
import { parentOrigin } from "@/lib/analytics";

export function EmbedBridge() {
  useEffect(() => {
    const origin = parentOrigin();
    if (!origin) return;
    const root = document.getElementById("quiz-root");
    if (!root) return;
    let lastHeight = 0;
    let frame = 0;
    const report = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const height = Math.ceil(root.getBoundingClientRect().height);
        if (height > 0 && Math.abs(height - lastHeight) > 2) {
          lastHeight = height;
          window.parent.postMessage({ type: embed.resizeEvent, height }, origin);
        }
      });
    };
    const observer = new ResizeObserver(report);
    observer.observe(root);
    report();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  return null;
}
