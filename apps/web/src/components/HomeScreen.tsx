import InstrumentCard, { type Instrument } from "./InstrumentCard";

// Placeholder data until the User/Lesson services exist.
const instruments: Instrument[] = [
  { id: "placeholder", name: "Instrument", description: "description" },
];

export default function HomeScreen() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-hand text-2xl">My Instruments</h1>
        <button type="button" className="font-hand text-base hover:underline">
          Edit
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {instruments.map((instrument) => (
          <InstrumentCard key={instrument.id} instrument={instrument} />
        ))}

        <button
          type="button"
          className="mt-2 flex flex-col items-center justify-center gap-2 rounded-lg bg-stone-500/30 py-6 text-stone-700 transition hover:bg-stone-500/40"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-stone-500/30 text-2xl leading-none">
            +
          </span>
          <span className="font-serif text-lg">Add Instrument</span>
        </button>
      </div>
    </main>
  );
}
