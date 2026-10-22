"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { Seal } from "@/components/effects/Atmosphere";
import { experience } from "@/data/config";

export function Introduction({ start }: { start: () => void }) {
  const reduced = useReducedMotion();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
  return (
    <motion.section className="introduction" aria-labelledby="intro-title"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : experience.timing.intro }}>
      <div className="intro-sigil"><Seal /><span aria-hidden="true">M</span></div>
      <p className="eyebrow"><span className="tiny-star" aria-hidden="true">✧</span> A MUGGLENET PERSONALITY QUIZ <span className="tiny-star" aria-hidden="true">✧</span></p>
      <h1 id="intro-title" ref={heading} tabIndex={-1}>WHAT HARRY POTTER<br /><em>VILLAIN</em> ARE YOU?</h1>
      <div className="ornament" aria-hidden="true"><span />✧<span /></div>
      <p className="intro-copy">We all like to think we&apos;d be the hero of the story. But what if the Sorting Hat saw something more sinister?</p>
      <button className="primary-button reveal-button" onClick={start}>REVEAL MY DARK SIDE <span aria-hidden="true">↗</span></button>
      <p className="confidential">Your answers are strictly confidential. Probably.</p>
      <div className="intro-details"><span>8 QUESTIONS</span><i aria-hidden="true" /><span>4 DARK DESTINIES</span><i aria-hidden="true" /><span>NO TURNING BACK*</span></div>
      <p className="fine-print">*Actually, there is a Back button. We&apos;re not monsters.</p>
    </motion.section>
  );
}
