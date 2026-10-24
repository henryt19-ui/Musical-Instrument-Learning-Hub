# apps/web

React 18 + TypeScript + Tailwind CSS web client for Legato (Musical Instrument Learning Hub), built with Vite.

## Status
The **home screen** is a static homepage inspired by the Legato wireframe:
- Gradient hero with navigation and instrument chooser
- Roadmap progress, saved items, suggested resources, practice tools, spotlight, and roadmap recommendations
- Sample content is currently local to `src/components/HomeScreen.tsx`; connect it to the relevant services when they are available

Navigation links point to conventional feature paths (for example, `/instruments` and `/roadmaps`) so they can be connected to app routes as those pages are implemented.

## Run locally
Requires Node.js 20 or newer.

```bash
cd apps/web
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check and production build into dist/
```

## Structure
- `public/legato-logo.png`: logo with a transparent background
- `src/components/Header.tsx`: app header
- `src/components/HomeScreen.tsx`: My Instruments screen
- `src/components/InstrumentCard.tsx`: instrument card
- `src/index.css`: Tailwind setup and theme colors/fonts (Gelasio and Shadows Into Light Two, bundled via Fontsource)
