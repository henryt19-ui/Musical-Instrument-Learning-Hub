export type Instrument = {
  id: string;
  name: string;
  description: string;
};

export default function InstrumentCard({ instrument }: { instrument: Instrument }) {
  return (
    <article className="relative rounded-lg bg-white px-4 py-4 shadow-sm">
      <h2 className="font-serif text-2xl font-semibold">{instrument.name}</h2>
      <p className="mt-2 text-base">{instrument.description}</p>
      <button
        type="button"
        aria-label={`Options for ${instrument.name}`}
        className="absolute right-3 top-3 rounded p-1 text-gray-500 transition hover:bg-black/5"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>
    </article>
  );
}
