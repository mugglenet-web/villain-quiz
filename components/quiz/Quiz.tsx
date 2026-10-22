"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import { assets, destinations, experience } from "@/data/config";
import { results } from "@/data/results";
import type { VillainKey } from "@/data/questions";
import { scoreAnswers, parseResult } from "@/lib/scoring";
import { clearQuiz, loadQuiz, saveQuiz } from "@/lib/persistence";
import { track } from "@/lib/analytics";
import { Panorama, Atmosphere } from "@/components/effects/Atmosphere";
import { EmbedBridge } from "@/components/effects/EmbedBridge";
import { AssetImage } from "@/components/effects/AssetImage";
import { AudioToggle, useQuizAudio } from "./AudioToggle";
import { Introduction } from "./Introduction";
import { Question } from "./Question";
import { Calculation, Reveal } from "@/components/results/Reveal";
import { Results } from "@/components/results/Results";

type Stage = "loading" | "intro" | "questions" | "calculating" | "reveal" | "result";

export function Quiz() {
  const [stage, setStage] = useState<Stage>("loading");
  const [answers, setAnswers] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<VillainKey | null>(null);
  const [locked, setLocked] = useState(false);
  const [halfway, setHalfway] = useState(false);
  const lock = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const halfwayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const source = useRef<"quiz" | "saved" | "link">("quiz");
  const reduced = useReducedMotion();
  const audio = useQuizAudio();

  useEffect(() => {
    const boot = window.setTimeout(() => {
      track("quiz_view", { embedded: window.parent !== window });
      const url = new URL(window.location.href);
      const linked = parseResult(url.searchParams.get("result"));
      if (linked) {
        source.current = "link";
        setResult(linked);
        setStage("result");
        track("quiz_result_view", { result: linked, source: "link" });
        return;
      }
      if (url.searchParams.has("result")) {
        url.searchParams.delete("result");
        window.history.replaceState(null, "", url);
      }
      const saved = loadQuiz();
      if (saved) {
        setAnswers(saved.answers);
        setIndex(saved.questionIndex);
        const restoredResult = saved.result ?? (saved.answers.length === 8 ? scoreAnswers(saved.answers) : null);
        if (restoredResult) {
          source.current = "saved";
          setResult(restoredResult);
          setStage("result");
          track("quiz_result_view", { result: restoredResult, source: "saved" });
        } else setStage("questions");
      } else setStage("intro");
    }, 0);
    return () => { clearTimeout(boot); if (timer.current) clearTimeout(timer.current); if (halfwayTimer.current) clearTimeout(halfwayTimer.current); };
  }, []);

  const start = () => {
    track("quiz_start", {});
    saveQuiz({ answers, questionIndex: 0, result: null });
    setStage("questions");
  };
  const choose = (choice: number) => {
    if (lock.current) return;
    lock.current = true;
    setLocked(true);
    audio.play("selection");
    const next = [...answers];
    const changed = next[index] !== undefined && next[index] !== choice;
    next[index] = choice;
    setAnswers(next);
    const nextIndex = Math.min(index + 1, 7);
    const winner = index === 7 ? scoreAnswers(next) : null;
    saveQuiz({ answers: next, questionIndex: nextIndex, result: winner });
    track("quiz_question_answered", { question: index + 1, choice: choice + 1, changed });
    timer.current = setTimeout(() => {
      lock.current = false;
      setLocked(false);
      if (winner) {
        setResult(winner);
        source.current = "quiz";
        track("quiz_complete", { result: winner });
        setStage("calculating");
      } else {
        setIndex(nextIndex);
        if (index === 3) {
          setHalfway(true);
          halfwayTimer.current = setTimeout(() => setHalfway(false), experience.timing.halfway);
        }
      }
    }, reduced ? 100 : experience.timing.answer);
  };
  const back = () => {
    if (lock.current) return;
    if (index === 0) { setStage("intro"); return; }
    const previous = index - 1;
    setIndex(previous);
    saveQuiz({ answers, questionIndex: previous, result: null });
  };
  const beginReveal = useCallback(() => setStage("reveal"), []);
  const finishReveal = useCallback(() => {
    setStage("result");
    if (result) track("quiz_result_view", { result, source: source.current });
  }, [result]);
  useEffect(() => {
    if (stage === "reveal") audio.play("reveal");
    // Sound preference is controlled by explicit user interaction, not stage restoration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);
  const replay = () => {
    clearQuiz();
    const url = new URL(window.location.href);
    url.searchParams.delete("result");
    window.history.replaceState(null, "", url);
    setAnswers([]);
    setIndex(0);
    setResult(null);
    setStage("intro");
    track("quiz_replay", {});
    requestAnimationFrame(() => document.getElementById("intro-title")?.focus({ preventScroll: true }));
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const resultStage = stage === "calculating" || stage === "reveal" || stage === "result";
  const theme = result ? {
    "--accent": results[result].theme,
    "--result-shadow": experience.resultShadows[result],
  } as CSSProperties : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <div id="quiz-root" className={`quiz-shell ${resultStage ? `in-results theme-${result}` : ""}`} style={theme}>
        <a className="skip-link" href="#quiz-main">Skip to quiz</a>
        <div className="scene" aria-hidden="true">
          <Panorama questionIndex={index} />
          <motion.div className="scene-image intro-scene" style={{ backgroundImage: `url("${assets.intro}")` }} animate={{ opacity: stage === "intro" || stage === "loading" ? 1 : 0 }} transition={{ duration: reduced ? 0 : experience.timing.crossfade }} />
          <motion.div className="scene-image result-scene" style={{ backgroundImage: `url("${assets.results}")` }} animate={{ opacity: resultStage ? 1 : 0 }} transition={{ duration: reduced ? 0 : experience.timing.crossfade }} />
          <div className="scene-shade" />
          <Atmosphere intense={stage === "calculating" || stage === "reveal"} />
          <div className="scene-grain" />
        </div>
        <header className="site-header">
          <a href={destinations.brand} target="_blank" rel="noopener noreferrer" className="brand-link" aria-label="MuggleNet home (opens in a new tab)">
            <AssetImage src={assets.logo} alt="MuggleNet" width={180} height={50} unoptimized priority />
          </a>
          <span className="header-label">THE DARK ARTS COLLECTION</span>
          <AudioToggle enabled={audio.enabled} toggle={audio.toggle} />
        </header>
        <main id="quiz-main" tabIndex={-1} className={`quiz-main stage-${stage}`}>
          <AnimatePresence mode="wait">
            {stage === "loading" && <section key="loading" className="loading-screen" role="status"><span className="eyebrow">MUGGLENET</span><p>Opening the chamber...</p></section>}
            {stage === "intro" && <Introduction key="intro" start={start} />}
            {stage === "questions" && <Question key={`question-${index}`} index={index} selected={answers[index]} locked={locked} choose={choose} back={back} />}
            {stage === "calculating" && <Calculation key="calculation" complete={beginReveal} />}
            {stage === "reveal" && result && <Reveal key="reveal" result={result} complete={finishReveal} />}
            {stage === "result" && result && <Results key={`result-${result}`} result={result} replay={replay} />}
          </AnimatePresence>
          <AnimatePresence>
            {halfway && stage === "questions" && <motion.div className="halfway-flourish" role="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><span aria-hidden="true">✧</span> Halfway into the shadows. Intriguing...</motion.div>}
          </AnimatePresence>
        </main>
        <footer className="site-footer">
          <span>A LITTLE MISCHIEF. A LOT OF MAGIC.</span>
          <a href={destinations.brand} target="_blank" rel="noopener noreferrer">MuggleNet <span aria-hidden="true">↗</span></a>
          <p>An unofficial fan experience. For entertainment, not a Ministry-approved diagnosis.</p>
        </footer>
        <EmbedBridge />
      </div>
    </MotionConfig>
  );
}
