"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { assets, destinations, experience } from "@/data/config";
import { results } from "@/data/results";
import type { VillainKey } from "@/data/questions";
import { BookPanel } from "@/components/products/BookPanel";
import { Seal } from "@/components/effects/Atmosphere";
import { track } from "@/lib/analytics";
import { AssetImage } from "@/components/effects/AssetImage";

export function Results({ result, replay }: { result: VillainKey; replay: () => void }) {
  const content = results[result];
  const heading = useRef<HTMLHeadingElement>(null);
  const [message, setMessage] = useState("");
  const [manualLink, setManualLink] = useState("");
  const [nativeShare, setNativeShare] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    const frame = requestAnimationFrame(() => setNativeShare(typeof navigator.share === "function"));
    return () => cancelAnimationFrame(frame);
  }, []);
  const shareUrl = () => {
    const url = new URL(destinations.share || window.location.href);
    url.searchParams.set("result", result);
    return url.href;
  };
  const copy = async () => {
    const url = shareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Link copied. Your dark secret is ready to share.");
      track("quiz_share", { result, method: "copy" });
    } catch {
      setManualLink(url);
      setMessage("Select and copy the link below to share your result.");
    }
  };
  const share = async () => {
    try {
      await navigator.share({ title: `I'm ${content.name}! | MuggleNet`, text: `${content.subtitle} What Harry Potter villain are you?`, url: shareUrl() });
      track("quiz_share", { result, method: "native" });
      setMessage("Your dark side has been shared.");
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) void copy();
    }
  };
  return (
    <motion.section className={`results theme-${result}`} initial={{ opacity: 0, y: reduced ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : experience.timing.result }} aria-labelledby="result-name">
      <div className="result-hero">
        <div className="result-art">
          <Seal className="result-seal" />
          <AssetImage src={assets[content.portrait]} alt={`${content.name} casting a spell in a dark magical atmosphere`} fill unoptimized sizes="(max-width: 760px) 90vw, 500px" priority />
          <div className="portrait-caption" aria-hidden="true"><span />YOUR DARK REFLECTION<span /></div>
        </div>
        <div className="result-copy">
          <p className="eyebrow">THE DARK ARTS HAVE SPOKEN</p>
          <p className="you-are">YOU ARE...</p>
          <h1 id="result-name" ref={heading} tabIndex={-1}>{content.name}</h1>
          <p className="result-subtitle">{content.subtitle}</p>
          <div className="ornament" aria-hidden="true"><span />✧<span /></div>
          <p className="result-description">{content.description}</p>
          <p className="observation"><span aria-hidden="true">✦</span> {content.observation}</p>
          <div className="share-actions">
            {nativeShare && <button className="primary-button" onClick={share}>SHARE MY DARK SIDE <span aria-hidden="true">↗</span></button>}
            <button className={nativeShare ? "secondary-button" : "primary-button"} onClick={copy}>COPY RESULT LINK <span aria-hidden="true">⧉</span></button>
          </div>
          <p className="share-status" role="status">{message}</p>
          {manualLink && <input className="manual-link" readOnly aria-label="Your result link" value={manualLink} onFocus={(event) => event.target.select()} />}
          <button className="text-button replay-button" onClick={replay}><span aria-hidden="true">↻</span> Not quite evil enough? Take the quiz again.</button>
        </div>
      </div>
      <div className="section-divider" aria-hidden="true"><span />YOUR NEXT CHAPTER<span /></div>
      <BookPanel result={result} />
    </motion.section>
  );
}
