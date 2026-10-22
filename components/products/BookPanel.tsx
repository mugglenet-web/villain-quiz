"use client";

import { results } from "@/data/results";
import { products } from "@/data/products";
import type { VillainKey } from "@/data/questions";
import { track } from "@/lib/analytics";
import { AssetImage } from "@/components/effects/AssetImage";

export function BookPanel({ result }: { result: VillainKey }) {
  const content = results[result];
  const product = products[content.book];
  return (
    <aside className="book-panel" aria-labelledby="book-title">
      <div className="book-art">
        <div className="book-halo" aria-hidden="true" />
        <AssetImage src={product.image} alt={`Cover of ${product.title}`} width={240} height={330} unoptimized />
      </div>
      <div className="book-copy">
        <p className="eyebrow">FROM THE RESTRICTED SECTION</p>
        <h2 id="book-title">{content.headline}</h2>
        <p>{content.copy}</p>
        <p className="book-name">{product.title}</p>
        <a className="commerce-button" href={product.url} target="_blank" rel="noopener noreferrer sponsored"
          onClick={() => track("quiz_book_click", { result, product: content.book })}>
          {content.cta} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
      <p className="affiliate-disclosure">As an Amazon Associate, MuggleNet may earn from qualifying purchases.</p>
    </aside>
  );
}
