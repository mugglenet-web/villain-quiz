"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { questions } from "@/data/questions";
import { experience } from "@/data/config";

export function Question({ index, selected, locked, choose, back }: {
  index: number; selected: number | undefined; locked: boolean;
  choose: (choice: number) => void; back: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
  return (
    <motion.section
      className="question-panel"
      initial={{ opacity: 0, y: reduced ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduced ? 0 : -10 }}
      transition={{ duration: reduced ? 0 : experience.timing.question }}
      aria-labelledby="question-title"
    >
      <div className="question-meta">
        <button onClick={back} className="back-button" disabled={locked}>
          <span aria-hidden="true">←</span> Back
        </button>
        <span className="eyebrow">QUESTION {index + 1} / 8</span>
        <span className="chapter-mark" aria-hidden="true">CHAPTER {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"][index]}</span>
      </div>
      <div className="progress-track" role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={8} aria-valuenow={index + 1} aria-valuetext={`Question ${index + 1} of 8`}>
        {questions.map((_, segment) => <span key={segment} className={segment <= index ? "lit" : ""} />)}
      </div>
      <p className="question-prelude" aria-hidden="true">A glimpse into your nature</p>
      <h1 id="question-title" tabIndex={-1} ref={heading}>{questions[index].text}</h1>
      <p className="choice-hint" id="choice-hint">Trust your first instinct. Choose one to continue.</p>
      <div className="choices" role="group" aria-label="Answer choices" aria-describedby="choice-hint">
        {questions[index].choices.map((choice, choiceIndex) => (
          <motion.button
            key={choiceIndex}
            className={`choice ${selected === choiceIndex ? "selected" : ""}`}
            onClick={() => choose(choiceIndex)}
            disabled={locked}
            aria-pressed={selected === choiceIndex}
            whileHover={reduced ? undefined : { x: 3 }}
            whileTap={reduced ? undefined : { scale: 0.99 }}
          >
            <span className="choice-letter" aria-hidden="true"><span>{String.fromCharCode(65 + choiceIndex)}</span></span>
            <span>{choice.text}</span>
            <span className="choice-arrow" aria-hidden="true">{selected === choiceIndex ? "✓" : "↗"}</span>
          </motion.button>
        ))}
      </div>
      <div className="question-bottom" aria-hidden="true"><span />THERE ARE NO WRONG ANSWERS. ONLY REVEALING ONES.<span /></div>
    </motion.section>
  );
}
