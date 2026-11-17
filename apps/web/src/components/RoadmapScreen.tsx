// apps/web/src/components/RoadmapScreen.tsx
import { useEffect, useState } from "react";
import Header from "./Header";
import { supabase } from "../lib/supabase";
import { useAuthSession } from "../lib/useUser";

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

function roadmapTitleToSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function RoadmapScreen() {
  const { user, loading: authLoading } = useAuthSession();
  const [completedStepIds, setCompletedStepIds] = useState<number[]>([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressError, setProgressError] = useState<string | null>(null);
  const [instrumentName, setInstrumentName] = useState("");
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [favoriteSaved, setFavoriteSaved] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [loginRequired, setLoginRequired] = useState(false);
  const pathSegments = window.location.pathname.split("/").filter(Boolean);
  const roadmapSlug = pathSegments[1];
  const instrumentSlug = roadmapSlug?.split("-")[0];

  useEffect(() => {
    let active = true;

    async function loadRoadmaps() {
      if (!instrumentSlug) {
        const { data: roadmapData, error: roadmapError } = await supabase
          .from("roadmaps")
          .select("id, title, description, level, roadmap_steps(id, position, title, description, resources(id, title, url, kind))")
          .order("title");

        if (!active) return;
        if (roadmapError) {
          setLoadError(roadmapError.message);
        } else {
          setRoadmaps((roadmapData ?? []) as Roadmap[]);
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

  const roadmap = roadmapSlug
    ? roadmaps.find((item) => roadmapTitleToSlug(item.title) === roadmapSlug) ??
      (roadmaps.length === 1 ? roadmaps[0] : undefined)
    : undefined;

  useEffect(() => {
    let active = true;

    async function checkFavorite() {
      if (!roadmap) return;

      setFavoriteLoading(true);
      setFavoriteMessage("");
      setLoginRequired(false);

      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          if (active) setFavoriteSaved(false);
          return;
        }

        const { data, error } = await supabase
          .from("favorite_roadmaps")
          .select("roadmap_id")
          .eq("user_id", user.id)
          .eq("roadmap_id", roadmap.id)
          .maybeSingle();

        if (error) throw error;
        if (active) setFavoriteSaved(Boolean(data));
      } catch (error) {
        if (active) {
          setFavoriteMessage(error instanceof Error ? error.message : String(error));
        }
      } finally {
        if (active) setFavoriteLoading(false);
      }
    }

    checkFavorite();
    return () => {
      active = false;
    };
  }, [roadmap?.id]);

  useEffect(() => {
    let active = true;
    setCompletedStepIds([]);
    setProgressError(null);

    if (authLoading) {
      setProgressLoading(true);
      return () => { active = false; };
    }
    if (!user) {
      setProgressLoading(false);
      return () => { active = false; };
    }

    setProgressLoading(true);
    void supabase.from("step_progress").select("step_id").eq("user_id", user.id)
      .then(({ data, error }) => {
        if (error) throw error;
        if (active) setCompletedStepIds((data ?? []).map((row) => Number(row.step_id)));
      })
      .catch((error: unknown) => {
        if (active) setProgressError(error instanceof Error ? error.message : "Progress could not be loaded.");
      })
      .finally(() => { if (active) setProgressLoading(false); });

    return () => { active = false; };
  }, [user?.id, authLoading]);

  const completedSet = new Set(completedStepIds);
  function getProgress(item: Roadmap) {
    const total = item.roadmap_steps.length;
    const completed = item.roadmap_steps.filter((step) => completedSet.has(step.id)).length;
    return { total, completed, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }

  const sortedSteps = [...(roadmap?.roadmap_steps ?? [])].sort((a, b) => a.position - b.position);
  const roadmapProgress = roadmap ? getProgress(roadmap) : { total: 0, completed: 0, percent: 0 };
  const nextStep = sortedSteps.find((step) => !completedSet.has(step.id)) ?? sortedSteps[sortedSteps.length - 1];
  const nextStepHref = nextStep && roadmap ? "/roadmap/" + nextStep.position + "?roadmapId=" + roadmap.id : "#steps";

  async function toggleFavorite() {
    if (!roadmap) return;

    setFavoriteLoading(true);
    setFavoriteMessage("");
    setLoginRequired(false);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        setLoginRequired(true);
        setFavoriteMessage("Log in to save roadmaps to your library.");
        return;
      }

      if (favoriteSaved) {
        const { error } = await supabase
          .from("favorite_roadmaps")
          .delete()
          .eq("user_id", user.id)
          .eq("roadmap_id", roadmap.id);
        if (error) throw error;
        setFavoriteSaved(false);
        setFavoriteMessage("Removed from your favorites.");
      } else {
        const { error } = await supabase
          .from("favorite_roadmaps")
          .upsert(
            { user_id: user.id, roadmap_id: roadmap.id },
            { onConflict: "user_id,roadmap_id", ignoreDuplicates: true },
          );
        if (error) throw error;
        setFavoriteSaved(true);
        setFavoriteMessage("Added to your favorites.");
      }
    } catch (error) {
      setFavoriteMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setFavoriteLoading(false);
    }
  }

  if (loading || loadError || (!roadmap && roadmaps.length === 0)) {
    const message = loading
      ? "Loading roadmap..."
      : loadError ?? (roadmapSlug
          ? `No roadmaps found for ${instrumentName}.`
          : "No roadmaps available.");

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
    return (
      <div className="min-h-screen bg-[#FAFAFA] font-sans">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            {roadmapSlug ? "Choose a " + instrumentName + " roadmap" : "Choose a roadmap"}
          </h1>
          <p className="mb-8 text-sm text-gray-500">
            {user ? "Pick up where you left off." : "Explore learning paths. Log in to track your completion."}
          </p>
          {progressError && <p className="mb-5 text-sm text-red-700" role="alert">Progress unavailable: {progressError}</p>}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {roadmaps.map((item) => {
              const summary = getProgress(item);
              const status = summary.total > 0 && summary.completed === summary.total
                ? "Complete" : summary.completed > 0 ? "In progress" : "Not started";
              return (
                <a key={item.id} href={"/roadmaps/" + roadmapTitleToSlug(item.title)}
                  className="group relative overflow-hidden rounded-3xl border border-fuchsia-100 bg-white p-6 shadow-[0_12px_30px_rgba(68,38,88,0.08)] transition hover:-translate-y-1 hover:border-pink-300 hover:shadow-[0_18px_38px_rgba(68,38,88,0.14)] focus-visible:outline-pink-600">
                  <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500" />
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold capitalize text-pink-700">{item.level}</span>
                    <span className="text-xs font-semibold text-gray-500">{summary.total} steps</span>
                  </div>
                  <h2 className="mb-2 text-xl font-extrabold text-gray-900 transition group-hover:text-[#C2185B]">{item.title}</h2>
                  <p className="mb-6 min-h-9 text-sm text-gray-500">{item.description || "Build your skills, one lesson at a time."}</p>
                  {user && !progressLoading && !progressError ? (
                    <>
                      <div className="mb-2 flex justify-between text-xs font-bold text-gray-600">
                        <span>{status} · {summary.completed} of {summary.total} complete</span>
                        <span>{summary.percent}%</span>
                      </div>
                      <div role="progressbar" aria-label={item.title + " progress"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={summary.percent}
                        className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500" style={{ width: summary.percent + "%" }} />
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500">{progressLoading ? "Loading progress..." : user ? "Progress unavailable" : "Sign in to track progress"}</p>
                  )}
                  <div className="mt-5 text-sm font-bold text-[#C2185B]">Open roadmap <span aria-hidden="true">→</span></div>
                </a>
              );
            })}
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

            {user && !progressLoading && !progressError ? (
              <div className="max-w-lg rounded-2xl bg-pink-50/60 p-4">
                <div className="mb-2 flex items-center justify-between gap-3 text-sm font-bold text-gray-700">
                  <span>{roadmapProgress.completed} of {roadmapProgress.total} steps completed</span>
                  <span className="text-[#C2185B]">{roadmapProgress.percent}%</span>
                </div>
                <div role="progressbar" aria-label="Roadmap completion" aria-valuemin={0} aria-valuemax={100}
                  aria-valuenow={roadmapProgress.percent} className="h-3 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 transition-all"
                    style={{ width: roadmapProgress.percent + "%" }} />
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {progressLoading ? "Loading progress..." : progressError ? "Progress unavailable: " + progressError : "Log in to track your progress as you complete steps."}
              </p>
            )
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 min-w-[200px]">
            <a href={nextStepHref} className="bg-[#C2185B] text-center text-white font-semibold py-3 px-6 rounded-full hover:bg-[#ad1457] transition shadow-md w-full">
              {roadmapProgress.total > 0 && roadmapProgress.completed === roadmapProgress.total ? "Review roadmap" : roadmapProgress.completed > 0 ? "Continue roadmap" : "Start roadmap"}
            </a>
            <button
              type="button"
              onClick={toggleFavorite}
              disabled={favoriteLoading}
              aria-pressed={favoriteSaved}
              className="bg-white text-gray-700 font-semibold py-3 px-6 rounded-full border border-gray-200 hover:bg-gray-50 transition flex items-center justify-center gap-2 w-full disabled:cursor-wait disabled:opacity-60"
            >
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              {favoriteLoading ? "Saving..." : favoriteSaved ? "Remove from Favorites" : "Save to Favorites"}
            </button>
            {favoriteMessage && (
              <p className="text-center text-sm text-gray-600" role="status" aria-live="polite">
                {favoriteMessage}{" "}
                {loginRequired && <a className="font-semibold text-[#C2185B] underline" href="/login">Log in</a>}
              </p>
            )}
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
              {sortedSteps.map((step) => {
                const done = completedSet.has(step.id);
                return (
                  <a key={step.id} href={"/roadmap/" + step.position + "?roadmapId=" + roadmap.id}
                    className={"group rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md flex items-center gap-5 " +
                      (done ? "border-emerald-200 bg-emerald-50/70" : "border-gray-100 bg-white hover:border-pink-200")}>
                    <div className={"flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl font-extrabold " +
                      (done ? "bg-emerald-500 text-white" : "bg-gradient-to-br from-pink-100 to-purple-100 text-pink-600")}>
                      {done ? "✓" : step.position}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-extrabold text-gray-800 group-hover:text-[#C2185B]">{step.title}</h3>
                      {step.description && <p className="mt-1 text-xs text-gray-500">{step.description}</p>}
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className={"rounded-full px-2 py-1 font-bold " + (done ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600")}>
                          {user && !progressLoading && !progressError ? done ? "Completed" : "To do" : progressLoading ? "Checking progress" : user ? "Progress unavailable" : "Log in to track"}
                        </span>
                        <span className="text-gray-400">{step.resources.length} resources</span>
                      </div>
                    </div>
                    <span className="text-lg text-pink-500 transition group-hover:translate-x-1" aria-hidden="true">→</span>
                  </a>
                );
              })}
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
                {sortedSteps.map((step) => (
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