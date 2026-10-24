import InstrumentCard, { type Instrument } from "./InstrumentCard";

// Static wireframe content; replace these collections with service data when available.
const instruments: Instrument[] = [
  {
    id: "guitar",
    name: "Guitar",
    description: "Chords, strumming, and your first songs",
    roadmap: "Beginner roadmap",
    steps: 12,
    icon: "guitar",
  },
  {
    id: "piano",
    name: "Piano",
    description: "From middle C to playing with both hands",
    roadmap: "Beginner roadmap",
    steps: 10,
    icon: "piano",
  },
  {
    id: "drums",
    name: "Drums",
    description: "Grip, steady beats, and your first fills",
    roadmap: "Beginner roadmap",
    steps: 8,
    icon: "drums",
  },
];

const resources = [
  {
    type: "Video",
    title: "Down-up strumming for absolute beginners",
    source: "YouTube · 12 min",
    color: "from-pink-400 to-rose-500",
    icon: "play",
    href: "/resources/down-up-strumming",
  },
  {
    type: "Article",
    title: "The 6 strumming patterns every beginner should know",
    source: "Guitar blog · 8 min read",
    color: "from-blue-400 to-blue-500",
    icon: "article",
    href: "/resources/strumming-patterns",
  },
  {
    type: "Tab",
    title: "Easy songs to practice your first strumming pattern",
    source: "Tab collection · 10 songs",
    color: "from-amber-300 to-orange-400",
    icon: "tabs",
    href: "/resources/easy-songs",
  },
  {
    type: "Practice",
    title: "10-minute strumming drill at 70 BPM",
    source: "Practice routine · 10 min",
    color: "from-emerald-300 to-cyan-500",
    icon: "clock",
    href: "/resources/strumming-drill",
  },
] as const;

// Suggested next-step roadmaps shown below the learning tools.
const roadmaps = [
  {
    instrument: "Guitar",
    title: "Barre Chords and Beyond",
    description: "Barre chords, fingerpicking and songs with faster changes.",
    steps: 10,
    href: "/roadmaps/guitar-barre-chords",
  },
  {
    instrument: "Piano",
    title: "Hands Together",
    description: "Chord accompaniment, simple melodies and reading both clefs.",
    steps: 10,
    href: "/roadmaps/piano-hands-together",
  },
  {
    instrument: "Drums",
    title: "Grooves and Fills",
    description: "Rock, funk and shuffle beats, plus fills that flow.",
    steps: 8,
    href: "/roadmaps/drums-grooves",
  },
] as const;

// Shared title treatment for homepage sections, with optional subtitle and destination link.
function SectionHeading({
  title,
  subtitle,
  color,
  action,
}: {
  title: string;
  subtitle?: string;
  color: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <div>
        <h2 className={`bg-gradient-to-r ${color} bg-clip-text text-xl font-extrabold leading-tight text-transparent sm:text-2xl`}>
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {action && (
        <a className="shrink-0 text-xs text-slate-600 transition hover:text-pink-600" href={action.href}>
          {action.label}
        </a>
      )}
    </div>
  );
}

// Keeps resource-card icons consistent while selecting a shape by resource type.
function ResourceIcon({ name }: { name: (typeof resources)[number]["icon"] }) {
  if (name === "play") {
    return <path d="m9 6 10 6-10 6V6Z" fill="currentColor" stroke="none" />;
  }
  if (name === "article") {
    return <path d="M7 3h8l4 4v14H7zM15 3v5h5M10 12h6M10 16h6" />;
  }
  if (name === "tabs") {
    return <path d="M5 7h14M5 12h14M5 17h14M8 5v4M13 10v4M17 15v4" />;
  }
  return <path d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />;
}

export default function HomeScreen() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-10 sm:px-8">
      {/* Instrument links overlap the bottom of the hero, matching the wireframe. */}
      <section aria-label="Choose your instrument" className="-mt-11 rounded-2xl bg-white p-4 shadow-[0_14px_32px_rgba(43,35,70,0.15)] sm:p-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Choose your instrument</p>
        <div className="grid gap-3 md:grid-cols-3">
          {instruments.map((instrument) => (
            <InstrumentCard key={instrument.id} instrument={instrument} />
          ))}
        </div>
        <p className="mt-3 text-[10px] text-slate-400">
          More instruments coming soon: bass, violin, and vocals.
        </p>
      </section>

      {/* Progress and saved-item shortcuts are side-by-side on wider screens. */}
      <section className="mt-7 grid gap-5 md:grid-cols-3">
        <div className="md:col-span-2">
          <SectionHeading title="Continue Your Roadmap" color="from-orange-500 to-fuchsia-600" />
          <article className="relative min-h-48 overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_85%_15%,rgba(242,160,74,0.9),transparent_38%),linear-gradient(115deg,#253052_5%,#334f86_55%,#38232b_100%)] p-5 text-white shadow-xl">
            <div className="relative z-10">
              <p className="mb-2 inline-flex rounded-full bg-white/20 px-2 py-1 text-[9px] font-medium">
                Beginner Guitar · Step 4 of 12
              </p>
              <h3 className="text-xl font-extrabold sm:text-2xl">Basic Strumming Patterns</h3>
              <p className="mt-1 text-xs text-white/80">4 resources picked for this step</p>
              <a href="/roadmaps/guitar-beginner/steps/4" className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-slate-900 transition hover:bg-pink-100">
                <span aria-hidden="true">▶</span> Continue
              </a>
            </div>
            <ol aria-label="Roadmap progress" className="relative z-10 mt-4 grid grid-cols-5 gap-2 text-[9px] text-white/75">
              {["Holding the guitar", "Tuning", "First chords", "Strumming", "Chord changes"].map((step, index) => (
                <li key={step} className="min-w-0">
                  <div className={`mb-1 h-1 rounded-full ${index < 4 ? "bg-pink-400" : "bg-white/30"}`} />
                  <span className="block truncate">{index + 1} · {step}</span>
                </li>
              ))}
            </ol>
          </article>
        </div>

        <div>
          <SectionHeading title="Saved Items" color="from-pink-600 to-rose-600" />
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
            <a href="/favorites" className="flex min-h-16 items-center gap-3 rounded-xl bg-white p-3 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-lg text-amber-600" aria-hidden="true">★</span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold">Favorites</span>
                <span className="block text-[10px] text-slate-500">Roadmaps you’re following</span>
              </span>
              <span className="text-slate-400" aria-hidden="true">›</span>
            </a>
            <a href="/liked" className="flex min-h-16 items-center gap-3 rounded-xl bg-white p-3 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-lg text-rose-600" aria-hidden="true">♥</span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold">Liked</span>
                <span className="block text-[10px] text-slate-500">Videos, articles and tools you saved</span>
              </span>
              <span className="text-slate-400" aria-hidden="true">›</span>
            </a>
          </div>
        </div>
      </section>

      {/* Resource destinations are placeholders for future resource routes. */}
      <section className="mt-7">
        <SectionHeading
          title="Suggested Resources for Your Next Step"
          subtitle="Hand-picked for Step 4 · Basic Strumming Patterns"
          color="from-emerald-600 via-amber-500 to-orange-600"
          action={{ label: "See all resources", href: "/resources" }}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((resource) => (
            <a key={resource.title} href={resource.href} className="group overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg">
              <div className={`flex h-16 items-center justify-center bg-gradient-to-br ${resource.color} text-white`}>
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <ResourceIcon name={resource.icon} />
                </svg>
              </div>
              <div className="p-3">
                <span className="inline-flex rounded-full bg-pink-100 px-2 py-0.5 text-[9px] font-semibold text-pink-700">{resource.type}</span>
                <h3 className="mt-2 min-h-8 text-[11px] font-semibold leading-snug text-slate-900 group-hover:text-pink-600">{resource.title}</h3>
                <p className="mt-1 text-[9px] text-slate-500">{resource.source}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* The metronome is presented as available; the remaining tools are marked coming soon. */}
      <section className="mt-7 grid gap-5 lg:grid-cols-2">
        <div>
          <SectionHeading
            title="Practice Tools"
            subtitle="Free tools to use while you practice, right in your browser"
            color="from-emerald-600 to-cyan-600"
          />
          <a href="/practice-tools/metronome" className="flex min-h-20 items-center gap-3 rounded-xl bg-white p-3 shadow-md transition hover:shadow-lg">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-xl text-teal-700" aria-hidden="true">♩</span>
            <span className="flex-1">
              <span className="block text-xs font-semibold">Metronome</span>
              <span className="block text-[10px] text-slate-500">Keep steady time at any tempo</span>
            </span>
            <span className="rounded-full bg-teal-800 px-3 py-1.5 text-[9px] font-semibold text-white">Open metronome</span>
          </a>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[
              { name: "Tuner", description: "Be in tune with your mix", icon: "♧" },
              { name: "Chord Library", description: "Look up any chord shape", icon: "▦" },
              { name: "Ear Training", description: "Hear notes and chords", icon: "♫" },
            ].map((tool) => (
              <a key={tool.name} href={`/practice-tools/${tool.name.toLowerCase().replace(/\s+/g, "-")}`} className="min-h-20 rounded-xl border border-dashed border-slate-200 bg-white/70 p-2.5 transition hover:border-teal-300 hover:bg-white">
                <span className="flex items-center justify-between gap-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-sm text-violet-600" aria-hidden="true">{tool.icon}</span>
                  <span className="rounded-full bg-violet-100 px-1.5 py-1 text-[7px] font-semibold uppercase tracking-wide text-slate-500">Coming soon</span>
                </span>
                <span className="mt-2 block text-[10px] font-semibold text-slate-800">{tool.name}</span>
                <span className="mt-0.5 block text-[9px] leading-snug text-slate-500">{tool.description}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading
            title="Spotlight"
            subtitle="A free resource we love this week"
            color="from-pink-600 to-purple-600"
          />
          <article className="flex min-h-48 flex-col justify-end overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.8),transparent_35%),radial-gradient(ellipse_at_80%_100%,rgba(105,24,73,0.65),transparent_55%),#0c0b11] p-5 text-white shadow-xl">
            <span className="mb-2 w-fit rounded-full bg-white/20 px-2 py-1 text-[9px]">Sheet music · All instruments</span>
            <h3 className="text-2xl font-black tracking-tight">IMSLP</h3>
            <p className="mt-1 text-[10px] text-white/75">A huge free library of public-domain sheet music</p>
            <a href="https://imslp.org" className="mt-3 w-fit rounded-full border border-white/70 px-3 py-1.5 text-[10px] font-medium transition hover:bg-white hover:text-slate-900">
              Check it out
            </a>
          </article>
        </div>
      </section>

      {/* Static recommendations provide future roadmap-link integration points. */}
      <section className="mt-7">
        <SectionHeading
          title="Level Up Next"
          color="from-purple-600 to-blue-600"
          action={{ label: "All roadmaps", href: "/roadmaps" }}
        />
        <div className="grid gap-3 md:grid-cols-3">
          {roadmaps.map((roadmap) => (
            <a key={roadmap.title} href={roadmap.href} className="rounded-xl bg-white p-4 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-amber-100 px-2 py-1 text-[9px] font-semibold text-amber-800">Intermediate</span>
                <span className="text-[9px] text-slate-500">{roadmap.steps} steps</span>
              </div>
              <p className="mt-2 text-[9px] font-bold uppercase tracking-wide text-slate-500">{roadmap.instrument}</p>
              <h3 className="mt-1 text-sm font-extrabold leading-tight text-slate-900">{roadmap.instrument}: {roadmap.title}</h3>
              <p className="mt-2 text-[10px] leading-relaxed text-slate-500">{roadmap.description}</p>
              <span className="mt-3 block text-[10px] font-semibold text-pink-600">View roadmap →</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
