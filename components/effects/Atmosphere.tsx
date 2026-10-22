"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { assets, experience } from "@/data/config";

export function Panorama({ questionIndex }: { questionIndex: number }) {
  const reduced = useReducedMotion();
  const position = (questionIndex / 7) * 100;
  const viewport = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(0);
  useEffect(() => {
    const measure = () => {
      if (viewport.current && camera.current) {
        setOverflow(Math.max(0, camera.current.offsetWidth - viewport.current.offsetWidth));
      }
    };
    const observer = new ResizeObserver(measure);
    if (viewport.current) observer.observe(viewport.current);
    if (camera.current) observer.observe(camera.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={viewport} className="panorama-viewport" aria-hidden="true" data-testid="panorama" data-position={position}>
      <motion.div
        ref={camera}
        className="panorama-camera"
        style={{
          width: `max(${experience.panorama.minimumWidth}, calc(100svh * ${experience.panorama.aspectRatio}))`,
          backgroundImage: `url("${assets.panorama}")`,
        }}
        animate={{ x: -(overflow * position / 100) }}
        transition={{ duration: reduced ? 0 : experience.panorama.duration, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

export function Atmosphere({ intense = false }: { intense?: boolean }) {
  return (
    <div className={`atmosphere ${intense ? "atmosphere-intense" : ""}`} aria-hidden="true">
      <div className="fog fog-one" /><div className="fog fog-two" />
      <div className="embers">
        {Array.from({ length: 14 }, (_, index) => (
          <i key={index} style={{
            left: `${(index * 37 + 11) % 100}%`,
            top: `${(index * 23 + 17) % 100}%`,
            animationDelay: `${-(index * 1.7)}s`,
            animationDuration: `${9 + (index % 5) * 2}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

export function Seal({ className = "" }: { className?: string }) {
  return (
    <svg className={`seal ${className}`} viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth=".7" />
      <circle cx="100" cy="100" r="78" stroke="currentColor" strokeWidth=".5" strokeDasharray="2 8" />
      <path d="M100 20 169 140H31Z M100 180 31 60h138Z" stroke="currentColor" strokeWidth=".6" />
      <circle cx="100" cy="100" r="48" stroke="currentColor" strokeWidth=".6" />
      <path d="m100 52 12 36 36 12-36 12-12 36-12-36-36-12 36-12Z" stroke="currentColor" />
      <path d="M100 3v12m0 170v12M3 100h12m170 0h12" stroke="currentColor" />
    </svg>
  );
}
