"use client";

import { useEffect, useRef, useState } from "react";
import { assets } from "@/data/config";

export function useQuizAudio() {
  const [enabled, setEnabled] = useState(false);
  const ambient = useRef<HTMLAudioElement | null>(null);
  const effects = useRef<HTMLAudioElement | null>(null);
  const play = (kind: "selection" | "reveal") => {
    if (!enabled) return;
    effects.current?.pause();
    const audio = new Audio(kind === "selection" ? assets.selectionAudio : assets.revealAudio);
    audio.volume = 0.35;
    effects.current = audio;
    void audio.play().catch(() => {});
  };
  const toggle = () => {
    if (enabled) {
      ambient.current?.pause();
      effects.current?.pause();
      setEnabled(false);
      return;
    }
    const audio = ambient.current ?? new Audio(assets.ambientAudio);
    ambient.current = audio;
    audio.loop = true;
    audio.volume = 0.12;
    void audio.play().catch(() => {});
    setEnabled(true);
  };
  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden) { ambient.current?.pause(); effects.current?.pause(); }
      else if (ambient.current && enabled) void ambient.current.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, [enabled]);
  useEffect(() => () => { ambient.current?.pause(); effects.current?.pause(); }, []);
  return { enabled, toggle, play };
}

export function AudioToggle({ enabled, toggle }: { enabled: boolean; toggle: () => void }) {
  return (
    <button className="audio-toggle" onClick={toggle} aria-pressed={enabled} aria-label={`Turn sound ${enabled ? "off" : "on"}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
        <path d="M11 4 6 8H3v8h3l5 4V4Z" />
        {enabled ? <path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" /> : <path d="m16 9 5 6m0-6-5 6" />}
      </svg>
      <span>Sound {enabled ? "on" : "off"}</span>
    </button>
  );
}
