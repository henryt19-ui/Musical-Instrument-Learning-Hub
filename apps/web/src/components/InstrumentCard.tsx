export type Instrument = {
  id: string;
  name: string;
  description: string;
  roadmap: string;
  steps: number;
  icon: string;
};

// Selecting a card opens that instrument's detail route.
export default function InstrumentCard({ instrument }: { instrument: Instrument }) {
  const iconKey = `${instrument.name} ${instrument.icon}`.toLowerCase();
  const iconSrc = iconKey.includes("guitar")
    ? "/figma-icons/guitar.svg"
    : iconKey.includes("piano")
      ? "/figma-icons/piano.svg"
      : iconKey.includes("drum")
        ? "/figma-icons/drums.svg"
        : "/figma-icons/note.svg";

  return (
    <a
      href={`/instruments/${instrument.id}`}
      className="group flex min-h-24 items-center gap-3 rounded-xl border border-violet-100 bg-[#f8f6fb] p-3 transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md sm:p-3.5"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fff0b7,#f2d7ff_55%,#b9f3ee)] text-indigo-950 shadow-sm">
        <img src={iconSrc} alt="" aria-hidden="true" className="h-6 w-6 object-contain" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-extrabold text-slate-900">{instrument.name}</span>
        <span className="mt-0.5 block text-[10px] leading-snug text-slate-500">{instrument.description}</span>
        <span className="mt-1 block text-[9px] font-semibold leading-tight text-emerald-800">
          {instrument.roadmap} · {instrument.steps} steps
        </span>
      </span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm text-pink-600 shadow-sm transition group-hover:bg-pink-600 group-hover:text-white" aria-hidden="true">
        →
      </span>
    </a>
  );
}
