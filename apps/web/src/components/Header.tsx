type HeaderProps = {
  variant?: "compact" | "home";
};

export default function Header({ variant = "compact" }: HeaderProps) {
  return (
    <header className="bg-[linear-gradient(110deg,#f486ab_0%,#ffc66b_32%,#86b8ff_75%,#2795c1_100%)] text-white shadow-sm">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
          <a href="/" aria-label="Legato home" className="shrink-0">
            {/* The supplied logo is dark; invert it to remain legible on the hero gradient. */}
            <img src="/legato-logo.png" alt="Legato" className="h-9 w-auto brightness-0 invert sm:h-11" />
          </a>
          <div className="order-3 flex w-full flex-wrap items-center justify-end gap-x-6 gap-y-2 sm:order-none sm:w-auto sm:flex-nowrap">
            {/* These paths are integration points for the corresponding feature pages. */}
            <nav aria-label="Main navigation" className="flex gap-x-5 overflow-x-auto pb-1 text-[11px] font-medium sm:pb-0">
              <a href="/instruments" className="whitespace-nowrap transition hover:text-white/75">Instruments</a>
              <a href="/roadmaps" className="whitespace-nowrap transition hover:text-white/75">Roadmaps</a>
              <a href="/resources" className="whitespace-nowrap transition hover:text-white/75">Resources</a>
              <a href="/practice-tools" className="whitespace-nowrap transition hover:text-white/75">Practice Tools</a>
              <a href="/library" className="whitespace-nowrap transition hover:text-white/75">My Library</a>
            </nav>
            <a href="/login" className="shrink-0 rounded-full bg-white px-4 py-2 text-[10px] font-semibold text-slate-800 shadow-md transition hover:bg-slate-100">
              Log in
            </a>
          </div>
        </div>
        {variant === "home" && (
          <div className="pb-14 pt-2 sm:pb-16">
            <h1 className="text-3xl font-black tracking-tight drop-shadow-sm sm:text-4xl lg:text-5xl">
              What do you want to learn?
            </h1>
            <p className="mt-1 max-w-lg text-[11px] leading-relaxed text-white/95 sm:text-xs">
              Pick an instrument and follow a step-by-step roadmap, with the best
              lessons and resources from around the web for every step.
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
