# RT STUDIO

A lightweight, dependency-free portfolio demo featuring three interactive product experiences:

- **RESIDENCE** — an architectural real-estate landing page.
- **MONETA** — a personal finance dashboard with local demo data.
- **ATELIER** — a fashion storefront with a working local cart and checkout demo.

## Run locally

Open `index.html` in a browser, or serve the folder with any static HTTP server, for example:

```sh
npx serve .
```

## Hero character video

The Hero uses `assets/videos/portifolio animação.mp4` (H.264, 368 × 560, approximately 60 fps, 5 seconds, 659 KB) configured in `heroCharacterConfig` in `app.js`. The original is kept at its native resolution without filters or upscaling. It autoplays muted, loops inline, and preserves its portrait aspect ratio. `assets/developer-fullstack.png` remains the loading poster and fallback if playback fails; when reduced motion is preferred, the video is not loaded and the static image is shown. The video source is attached only after checking the motion preference and its media-query listener is removed when navigating away from the portfolio.

All financial, product, address, and contact data in these experiences is illustrative. MONETA and ATELIER persist demo state in the browser's local storage; no backend, payment processor, authentication, or real financial integration is included. RESIDENCE links to the published demonstration and labels property details as illustrative.
