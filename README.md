# MuggleNet Villain Quiz

A standalone, responsive **What Harry Potter Villain Are You?** experience for MuggleNet, built with **Next.js App Router, React, TypeScript, Tailwind CSS, and Motion**. It runs directly on its deployment URL or inside a WordPress iframe. Eight questions lead to a deterministic villain result, sharing, and related book recommendations.

## Run locally

Use **Node.js 20.9 or newer** and npm. The lockfile is committed; use `npm ci` rather than changing dependency versions during deployment.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. Available commands:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run lint` | Run the existing ESLint configuration. |
| `npm run typecheck` | Generate Next route types and check TypeScript without emitting code. |
| `npm test` | Run the existing Node/tsx unit tests. |
| `npm run build` | Create the production Next build. |
| `npm start` | Serve an already-built production application. |

For a local production check:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

**No environment variables, API keys, or secrets are required.** The quiz does not require a database, account, or backend analytics service.

## Deploy to Vercel

1. Import this repository into Vercel and select the **Next.js** framework preset.
2. Use the repository root as the project root. Select a supported Node version meeting the minimum above.
3. Set the install command to `npm ci` and the build command to `npm run build`; retain the preset's output settings.
4. Leave environment variables empty unless adding a separately reviewed integration.
5. Deploy, then check the standalone production URL, image/audio loading, answer navigation, result sharing, reload/resume, and retake.
6. Replace the placeholder domain in the WordPress snippet below with the actual production origin. Keep the HTTPS origin identical in the iframe and its message checks.
7. Test the published article on both mobile and desktop, including its `?result=` links. Preview domains are not substitutes for the production iframe origin.

Vercel serves the application; `npm start` is for self-hosted/local production execution. Keep security headers enabled at the hosting layer, and do not add headers that conflict with the iframe policy.

## Content and configuration

| File | What to edit |
| --- | --- |
| `data/config.ts` | MuggleNet asset URLs; `sources` asset/font origins and font stylesheet; brand and share destinations; experience timing, panorama settings, colors, storage key; allowed embed origins and analytics forwarding. |
| `data/questions.ts` | Eight questions, choice text, and each choice's villain-key mapping. Answer indexes are zero-based within each question. |
| `data/results.ts` | Exact approved result copy, imagery references, and result presentation for Lord Voldemort, Bellatrix Lestrange, Dolores Umbridge, and Lucius Malfoy. |
| `data/products.ts` | Approved book recommendations and product/affiliate URLs. |
| `lib/scoring.ts` | Input validation, valid result-key parsing, and deterministic scoring. |
| `lib/persistence.ts` | Validated, best-effort localStorage persistence. |
| `lib/analytics.ts` | Optional analytics hook, DOM events, and approved-parent forwarding. |
| `components/effects/EmbedBridge.tsx` | Child-to-parent height reporting. |
| `next.config.ts` | Response security headers and allowed remote image sources. |
| `app/layout.tsx`, `app/globals.css` | Global metadata, font loading/fallbacks, and layout/accessibility styles. |

Preserve the approved question/result copy when making visual changes. Do not invent prices, discounts, product URLs, or replacement asset URLs. Use the configured Google Fonts URLs and existing fallback font stack; update source allowlists deliberately if approved assets move.

### Scoring and shared results

The valid result keys are **`voldemort`**, **`bellatrix`**, **`umbridge`**, and **`lucius`**. Scoring requires exactly eight integer answer indexes, each between 0 and 3:

1. Map each answer through that question's choice key.
2. Count selections for each villain; the highest count wins.
3. For tied highest counts, inspect selections in reverse question order, **Q8 through Q1**. The first selection belonging to a tied leader wins.

There is no randomness, weighting, or fixed villain-priority tie breaker. Changing choice mappings changes outcomes, so review scoring tests alongside editorial changes.

A valid `?result=KEY` opens the corresponding shared result; it is not evidence that the visitor completed the quiz. Shared links target the configured article URL:

```text
https://mugglenet.com/games/villain-quiz?result=voldemort
```

The article must forward the validated result query to the iframe's initial URL, as the snippet below does. Without this, visitors to article share links see the normal quiz rather than the shared result.

### Local persistence and privacy

The versioned key **`mugglenet-villain-quiz:v1`** stores JSON containing `answers`, `questionIndex`, and `result` (a valid key when completed, otherwise `null`). It contains no names, email addresses, accounts, or other PII. Stored data is validated before use, including consistency between completed answers and their result.

Persistence is optional: blocked third-party storage, private browsing restrictions, malformed saved data, and storage errors must not stop play. Reload can restore available progress/results; **Retake clears the saved quiz**. Change the versioned storage key if introducing an incompatible state or question-mapping format.

## WordPress embedding

Paste this complete snippet into a **Custom HTML** block on the MuggleNet quiz article. Replace `https://YOUR-QUIZ-PRODUCTION-DOMAIN.vercel.app` with the actual deployment origin. WordPress must permit the script; if your role/site sanitizes scripts, have an authorized administrator install this same listener through the site's approved script mechanism.

```html
<div id="mugglenet-villain-quiz-container" style="width:100%;max-width:100%;">
  <iframe
    id="mugglenet-villain-quiz-frame"
    src="https://YOUR-QUIZ-PRODUCTION-DOMAIN.vercel.app/"
    title="MuggleNet: What Harry Potter Villain Are You?"
    loading="lazy"
    allow="web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    style="display:block;width:100%;max-width:100%;height:720px;min-height:720px;border:0;"
  ></iframe>
</div>
<script>
(function () {
  "use strict";

  var iframe = document.getElementById("mugglenet-villain-quiz-frame");
  if (!iframe) return;

  var quizOrigin = "https://YOUR-QUIZ-PRODUCTION-DOMAIN.vercel.app";
  var quizUrl = new URL("/", quizOrigin);
  var validResults = ["voldemort", "bellatrix", "umbridge", "lucius"];
  var result = new URL(window.location.href).searchParams.get("result");
  if (validResults.indexOf(result) !== -1) {
    quizUrl.searchParams.set("result", result);
  }

  var currentHeight = 720;
  var pendingHeight = 720;
  var animationFrame = 0;

  window.addEventListener("message", function (event) {
    if (event.origin !== quizOrigin || event.source !== iframe.contentWindow) return;
    var data = event.data;
    if (!data || typeof data !== "object" ||
        data.type !== "mugglenet-quiz:resize" ||
        typeof data.height !== "number" ||
        !Number.isFinite(data.height)) return;

    var nextHeight = Math.round(Math.min(12000, Math.max(320, data.height)));
    pendingHeight = nextHeight;
    if (Math.abs(pendingHeight - currentHeight) <= 2 || animationFrame) return;

    animationFrame = window.requestAnimationFrame(function () {
      animationFrame = 0;
      if (Math.abs(pendingHeight - currentHeight) <= 2) return;
      currentHeight = pendingHeight;
      iframe.style.height = currentHeight + "px";
      iframe.style.minHeight = currentHeight + "px";
    });
  });

  // Register the listener before navigating to the validated initial result URL.
  iframe.src = quizUrl.href;
}());
</script>
```

The container and iframe are full-width, initially 720px tall, with no border. The listener accepts only the exact deployment origin **and** that iframe's `contentWindow`; it validates the message type and finite numeric height, clamps to **320–12000px**, rounds, ignores changes of at most 2px, and batches style updates with `requestAnimationFrame`. There is no viewport-relative minimum or fixed maximum-height CSS that could clip content.

The child uses `ResizeObserver` on **`#quiz-root`**, then reports:

```js
{ type: "mugglenet-quiz:resize", height: 720 }
```

The child sends only to the approved origin derived from `document.referrer`. Keep the iframe's `referrerpolicy="strict-origin-when-cross-origin"`: it supplies the parent origin without leaking the article's full path/query. A missing or unapproved referrer disables messaging. Keep the child's **root minimum height fixed at `720px`**, not `100vh`, `100dvh`, or another iframe-viewport-dependent value; otherwise resizing the parent can change the measured minimum and create a feedback loop.

The snippet intentionally has **no sandbox**. If introducing sandboxing later, review script and storage behavior: scripts require `allow-scripts`, and normal origin-based storage requires `allow-same-origin`. A sandbox without these permissions can break functionality and opaque-origin message checks. Re-test the entire integration rather than adding permissions blindly.

Use one instance of this snippet per page; additional instances need unique IDs and separately scoped listeners. Do not forward arbitrary article query parameters or accept messages from other windows.

## Security headers

`next.config.ts` applies headers to application routes:

- CSP `frame-ancestors 'self' https://mugglenet.com https://www.mugglenet.com` allows only the application itself and the two approved MuggleNet parent origins.
- **No `X-Frame-Options` header** is set: `DENY` or `SAMEORIGIN` would block the cross-origin WordPress integration. Check reverse proxies/plugins for conflicting headers too.
- Images allow the application, inline `data:` image fallbacks, and `https://mugglenet.com`; media allows only the application and MuggleNet. Next's remote image configuration restricts HTTPS MuggleNet uploads.
- Google Fonts styles are permitted from `https://fonts.googleapis.com`, with fonts from `https://fonts.gstatic.com` and the application.
- Scripts and styles allow the application's origin and the inline allowances needed by this Next implementation. **This is not a strict nonce-based CSP**; do not describe it as one.
- `connect-src 'self'` prevents arbitrary external browser requests. An external analytics adapter would require a narrowly scoped, reviewed CSP change.
- `object-src 'none'`, `base-uri 'self'`, and `form-action 'self'` constrain embedding/navigation behavior.
- `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, and a Permissions Policy disabling camera, microphone, and geolocation are also set.

If adding another approved embedding site, edit `embed.allowedOrigins` in `data/config.ts`; `next.config.ts` imports this allowlist and generates CSP `frame-ancestors` automatically, without duplicate origin configuration. The `sources` configuration centralizes asset/font origins and the font stylesheet; review its allowlists whenever approved asset or font origins change. Preview/local parents are not automatically trusted. Always use explicit approved target origins for child messages.

### Dependency advisory

The current `npm audit` report contains **5 high-severity findings in development-only lint dependencies**, from the unpatched `braces <=3.0.3` malicious-glob stack-exhaustion dependency chain. There is currently no patch for that reported chain. Use only trusted local source/glob patterns for linting; do not accept untrusted glob input into these tools.

Do not downgrade Next to an unsupported version to silence the audit, and do not apply `npm audit fix --force` without reviewing its changes. Assess production dependencies separately with:

```sh
npm audit --omit=dev
```

Audit output changes over time: recheck when updating dependencies and distinguish development tooling exposure from production runtime exposure. This advisory is not a claim that every future production audit is clean.

## Optional analytics

No vendor analytics or secrets are required. The quiz offers two integration points in its own window:

```js
window.mugglenetQuizAnalytics = function (event, fields) {
  // Send to your approved, consent-aware adapter.
};

window.addEventListener("mugglenet-quiz:event", function (message) {
  var event = message.detail.event;
  var fields = message.detail.fields;
  // Alternatively handle { event, fields } here.
});
```

Choose one integration point to avoid double counting. The DOM event's detail is **`{ event, fields }`**. Analytics failures must not interrupt gameplay.

| Event | Fields |
| --- | --- |
| `quiz_view` | `embedded` boolean |
| `quiz_start` | Empty object |
| `quiz_question_answered` | `question`, `choice`, `changed` |
| `quiz_complete` | `result` |
| `quiz_result_view` | `result`, `source`: `quiz`, `saved`, or `link` |
| `quiz_share` | `result`, `method`: `native` or `copy` |
| `quiz_replay` | Empty object |
| `quiz_book_click` | `result`, `product` |

**`embed.forwardAnalytics` defaults to `false`.** If explicitly enabled, the child forwards `{ type: "mugglenet-quiz:analytics", event, fields }` only to an approved referrer origin. A parent adapter must separately validate the exact quiz origin, iframe source, message type, and expected event/fields; the resize listener above intentionally does not process analytics. Do not send PII or add a vendor endpoint without reviewing consent requirements and `connect-src`.

## Accessibility and resilience

- Honor `prefers-reduced-motion`: reduce/disable decorative movement and long transitions without hiding quiz content.
- Support keyboard answer selection, navigation, and sharing with visible focus states. Move focus to the new screen/question heading so transitions remain understandable.
- Expose question progress and meaningful status/result text to screen readers; hide purely decorative atmosphere/effects from the accessibility tree.
- Keep controls usable on touch screens and narrow layouts; do not depend on hover, audio, or animation to communicate an answer.
- Sound starts **off** and requires an explicit user click. Do not autoplay audio; blocked playback and audio-loading errors degrade gracefully.
- Keep readable fallback fonts and background/image fallbacks so slow or unavailable external assets do not obscure text or controls.
- Sharing should work through native sharing where available and a copy fallback otherwise. A declined share is not a gameplay failure.

Before publishing, manually check keyboard-only use, a screen reader, reduced-motion settings, sound activation/error behavior, disabled storage, small-screen touch interaction, failed image/font requests, and iframe resize/share links.

Browser validation passed for a complete quiz at 320px width, Back navigation, refresh/resume, sharing, and replay; all four valid result URLs worked and unsafe result values were rejected. The actual WordPress snippet was tested against an HTTPS-routed local application with a MuggleNet parent: iframe height remained stable and spoofed messages were rejected. Reduced-motion instant panorama movement also passed. The validation sandbox could not resolve remote assets/fonts, so live production asset and font verification remains a deployment step.

## Affiliate disclosure

Display the exact disclosure alongside the recommendations:

> As an Amazon Associate, MuggleNet may earn from qualifying purchases.

Keep approved affiliate links in `data/products.ts`. Do not fabricate pricing, availability, or product destinations; verify the supplied links before publication.
