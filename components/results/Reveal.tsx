"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { assets, experience } from "@/data/config";
import { results } from "@/data/results";
import type { VillainKey } from "@/data/questions";
import { Seal } from "@/components/effects/Atmosphere";
import { AssetImage } from "@/components/effects/AssetImage";

export function Calculation({ complete }: { complete: () => void }) {
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    const interval = window.setInterval(() => setStep((current) => Math.min(current + 1, 3)), experience.timing.calculation / 4);
    const timeout = window.setTimeout(complete, experience.timing.calculation);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [complete]);
  return (
    <section className="calculation" aria-labelledby="calculation-title">
      <div className="calculation-seal"><Seal /></div>
      <p className="eyebrow">THE VEIL IS LIFTING</p>
      <h1 id="calculation-title" ref={heading} tabIndex={-1} aria-live="polite" aria-atomic="true">{experience.calculation[step]}</h1>
      <p>Your secrets are safe with us. More or less.</p>
      <div className="calculation-dots" aria-hidden="true"><i /><i /><i /><i /></div>
    </section>
  );
}

export function Reveal({ result, complete }: { result: VillainKey; complete: () => void }) {
  const reduced = useReducedMotion();
  const heading = useRef<HTMLHeadingElement>(null);
  const content = results[result];
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    const timer = window.setTimeout(complete, reduced ? 500 : experience.timing.reveal);
    return () => clearTimeout(timer);
  }, [complete, reduced]);
  return (
    <section className={`character-reveal theme-${result}`} aria-labelledby="reveal-title">
      <p className="eyebrow">THE DARK ARTS HAVE SPOKEN</p>
      <h1 id="reveal-title" tabIndex={-1} ref={heading}>YOU ARE... <span className="sr-only">{content.name}</span></h1>
      <motion.div className="portal" initial={{ opacity: 0, scale: reduced ? 1 : 0.86 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : experience.timing.portal }}>
        <Seal className="portal-seal" />
        <AssetImage src={assets[content.portrait]} alt={`${content.name} surrounded by dark magic`} fill unoptimized sizes="(max-width: 600px) 90vw, 430px" className="reveal-portrait" priority />
      </motion.div>
      <motion.p className="revealed-name" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduced ? 0 : experience.timing.portrait }}>{content.name}</motion.p>
      <button className="text-button" onClick={complete}>See my result <span aria-hidden="true">↓</span></button>
    </section>
  );
}
