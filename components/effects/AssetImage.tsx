"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export function AssetImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className={`asset-fallback ${props.fill ? "asset-fallback-fill" : ""}`} role="img" aria-label={props.alt}>{props.alt}</span>;
  }
  return <Image {...props} alt={props.alt} onError={() => setFailed(true)} />;
}
