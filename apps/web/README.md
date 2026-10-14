# apps/web

React 18 + TypeScript + Tailwind CSS web client for Legato (Musical Instrument Learning Hub), built with Vite.

## Status
Only the **home screen** ("My Instruments") is implemented, as a static UI matching the team mockup:
- Header with the Legato logo and an account button
- "My Instruments" list with a placeholder instrument card and an Edit button
- "Add Instrument" button

Buttons are not wired up yet, and the instrument list uses placeholder data in `src/components/HomeScreen.tsx` until the User/Lesson services exist.

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
