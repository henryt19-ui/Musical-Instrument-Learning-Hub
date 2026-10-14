export default function Header() {
  return (
    <header className="relative flex h-24 items-center justify-center bg-gradient-to-br from-rose-header-from to-rose-header-to shadow-sm sm:h-28">
      <img src="/legato-logo.png" alt="Legato" className="h-16 w-auto sm:h-20" />
      <button
        type="button"
        aria-label="Account"
        className="absolute right-4 top-4 rounded-full p-1 text-ink transition hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-ink"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" />
        </svg>
      </button>
    </header>
  );
}
