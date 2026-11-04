// apps/web/src/components/RoadmapScreen.tsx
import { useEffect, useState } from "react";
import Header from "./Header";
import { supabase } from "../lib/supabase";

type RoadmapResource = {
  id: number;
  title: string;
  url: string;
  kind: string;
};

type RoadmapStep = {
  id: number;
  position: number;
  title: string;
  description: string | null;
  resources: RoadmapResource[];
};

type Roadmap = {
  id: number;
  title: string;
  description: string | null;
  level: string;
  roadmap_steps: RoadmapStep[];
};

type Instrument = {
  id: number;
  slug: string;
  name: string;
};

function roadmapTitleToSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function RoadmapScreen() {
  const [instrumentName, setInstrumentName] = useState("");
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const pathSegments = window.location.pathname.split("/").filter(Boolean);
  const roadmapSlug = pathSegments[1];
  const instrumentSlug = roadmapSlug?.split("-")[0];

  useEffect(() => {
    let active = true;

    async function loadRoadmaps() {
      if (!instrumentSlug) {
        const { data: instrumentData, error: instrumentListError } = await supabase
          .from("instruments")
          .select("id, slug, name")
          .order("name");

        if (!active) return;
        if (instrumentListError) {
          setLoadError(instrumentListError.message);
        } else if (!instrumentData?.length) {
          setLoadError("No instruments found.");
        } else {
          setInstruments((instrumentData ?? []) as Instrument[]);
        }
        setLoading(false);
        return;
      }

      const { data: instrument, error: instrumentError } = await supabase
        .from("instruments")
        .select("id, name")
        .eq("slug", instrumentSlug)
        .single();

      if (!active) return;
      if (instrumentError) {
        setLoadError(instrumentError.message);
        setLoading(false);
        return;
      }

      setInstrumentName(instrument.name);

      const { data: roadmapData, error: roadmapError } = await supabase
        .from("roadmaps")
        .select("id, title, description, level, roadmap_steps(id, position, title, description, resources(id, title, url, kind))")
        .eq("instrument_id", instrument.id)
        .order("position", { referencedTable: "roadmap_steps" });

      if (!active) return;
      if (roadmapError) {
        setLoadError(roadmapError.message);
      } else {
        setRoadmaps((roadmapData ?? []) as Roadmap[]);
      }
      setLoading(false);
    }

    loadRoadmaps().catch((error: unknown) => {
      if (!active) return;
      setLoadError(error instanceof Error ? error.message : String(error));
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const roadmap =
    roadmaps.find((item) => roadmapTitleToSlug(item.title) === roadmapSlug) ??
    (roadmaps.length === 1 ? roadmaps[0] : undefined);

  if (loading || loadError || (!roadmap && roadmaps.length === 0)) {
    const message = loading
      ? "Loading roadmap..."
      : loadError ?? `No roadmaps found for ${instrumentName}.`;

    return (
      <div className="min-h-screen bg-[#FAFAFA] font-sans">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <p className={loadError ? "text-red-700" : "text-gray-500"} role={loadError ? "alert" : undefined}>
            {message}
          </p>
        </main>
      </div>
    );
  }

  if (!roadmap) {
    const choices = roadmapSlug
      ? roadmaps.map((item) => ({
          id: item.id,
          name: item.title,
          href: `/roadmaps/${roadmapTitleToSlug(item.title)}`,
        }))
      : instruments.map((instrument) => ({
          id: instrument.id,
          name: instrument.name,
          href: `/roadmaps/${instrument.slug}`,
        }));

    return (
      <div className="min-h-screen bg-[#FAFAFA] font-sans">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
            {roadmapSlug ? `Choose a ${instrumentName} roadmap` : "Choose an instrument"}
          </h1>
          <div className="space-y-3">
            {choices.map((choice) => (
              <a
                key={choice.id}
                href={choice.href}
                className="block rounded-2xl bg-white p-5 shadow-sm border border-gray-100 font-semibold text-gray-800 hover:shadow-md"
              >
                {choice.name}
              </a>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6 flex gap-2">
          <a href="/" className="hover:text-gray-800">Home</a> /
          <span>{instrumentName}</span> /
          <span className="text-gray-800 font-medium">{roadmap.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Icon */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-200 via-purple-200 to-blue-200 flex-shrink-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
          </div>

          {/* Content */}
          <div className="flex-1 w-full">
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">{roadmap.level}</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">{roadmap.roadmap_steps.length} steps</span>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
              {instrumentName}:<br />{roadmap.title}
            </h1>
            <p className="text-gray-500 mb-6 text-sm max-w-xl">
              {roadmap.description || "Follow this roadmap one step at a time."}
            </p>

            <div className="flex items-center gap-4 max-w-lg">
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {roadmap.roadmap_steps.length} steps in this roadmap
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 min-w-[200px]">
            <a href={roadmap.roadmap_steps[0] ? `/roadmap/${roadmap.roadmap_steps[0].position}` : "#steps"} className="bg-[#C2185B] text-center text-white font-semibold py-3 px-6 rounded-full hover:bg-[#ad1457] transition shadow-md w-full">
              Continue roadmap
            </a>
            <button className="bg-white text-gray-700 font-semibold py-3 px-6 rounded-full border border-gray-200 hover:bg-gray-50 transition flex items-center justify-center gap-2 w-full">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              Save to Favorites
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: The Steps */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 mb-6">
              The Steps
            </h2>
            <div id="steps" className="space-y-4">
              {roadmap.roadmap_steps.map((step) => (
                <a key={step.id} href={`/roadmap/${step.position}`} className="p-5 rounded-2xl flex items-center gap-5 bg-white shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 text-pink-500 font-bold">
                    {step.position}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-sm">{step.title}</h3>
                    {step.description && <p className="text-gray-400 text-xs mt-1">{step.description}</p>}
                  </div>
                  <span className="text-xs text-gray-400">{step.resources.length} resources</span>
                </a>
              ))}
              {roadmap.roadmap_steps.length === 0 && (
                <p className="text-gray-500">This roadmap does not have any steps yet.</p>
              )}
            </div>
          </div>

          {/* Right Column: About */}
          <div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-6">
              About
            </h2>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">What you'll learn</h3>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                {roadmap.roadmap_steps.map((step) => (
                  <li key={step.id}>• {step.description || step.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}