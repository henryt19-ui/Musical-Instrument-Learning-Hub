import { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import { supabase } from "../lib/supabase";
import { useUser } from "../lib/useUser";

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

export default function RoadmapStepScreen() {
  const user = useUser();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [completedStepIds, setCompletedStepIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const pathSegments = window.location.pathname.split("/").filter(Boolean);
  const rawStepNumber = Number(pathSegments[pathSegments.length - 1]);
  const requestedStepNumber = Number.isInteger(rawStepNumber) && rawStepNumber >= 1 ? rawStepNumber : 1;
  const roadmapSlug = pathSegments.includes("steps") && pathSegments[0] === "roadmaps" ? pathSegments[1] : undefined;
  const instrumentSlug = roadmapSlug?.split("-")[0];
  const rawRoadmapId = Number(new URLSearchParams(window.location.search).get("roadmapId"));
  const requestedRoadmapId = Number.isSafeInteger(rawRoadmapId) && rawRoadmapId > 0 ? rawRoadmapId : undefined;

  useEffect(() => {
    let active = true;

    async function loadRoadmap() {
      let query = supabase
        .from("roadmaps")
        .select("id, title, description, level, roadmap_steps(id, position, title, description, resources(id, title, url, kind))")
        .order("position", { referencedTable: "roadmap_steps" });

      if (requestedRoadmapId) {
        query = query.eq("id", requestedRoadmapId);
      } else if (instrumentSlug) {
        const { data: instrumentData, error: instrumentError } = await supabase
          .from("instruments")
          .select("id")
          .eq("slug", instrumentSlug)
          .single();

        if (!active) return;

        if (instrumentError) {
          setLoadError(instrumentError.message);
          setLoading(false);
          return;
        }

        query = query.eq("instrument_id", instrumentData.id);
      }

      const { data, error } = await query;

      if (!active) return;

      if (error) {
        setLoadError(error.message);
        setLoading(false);
        return;
      }

      const roadmaps = (data ?? []) as Roadmap[];
      const matchingRoadmap = roadmapSlug
        ? roadmaps.find((item) => roadmapTitleToSlug(item.title) === roadmapSlug) ?? roadmaps[0]
        : roadmaps[0];

      if (!matchingRoadmap) {
        setLoadError("No roadmap found for this step.");
        setLoading(false);
        return;
      }

      setRoadmap(matchingRoadmap);
      setLoading(false);
    }

    loadRoadmap().catch((error: unknown) => {
      if (!active) return;
      setLoadError(error instanceof Error ? error.message : String(error));
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [instrumentSlug, requestedRoadmapId, roadmapSlug]);

  useEffect(() => {
    if (!user || !roadmap) {
      setCompletedStepIds([]);
      return;
    }

    const userId = user.id;
    let active = true;

    async function loadProgress() {
      const { data, error } = await supabase
        .from("step_progress")
        .select("step_id")
        .eq("user_id", userId);

      if (!active) return;

      if (!error) {
        setCompletedStepIds((data ?? []).map((row) => Number(row.step_id)));
      }
    }

    loadProgress().catch(() => undefined);

    return () => {
      active = false;
    };
  }, [user, roadmap]);

  const currentStep = useMemo(() => {
    if (!roadmap) return null;
    return (
      roadmap.roadmap_steps.find((step) => step.position === requestedStepNumber) ??
      roadmap.roadmap_steps[0] ??
      null
    );
  }, [requestedStepNumber, roadmap]);

  const currentStepPosition = currentStep?.position ?? requestedStepNumber;
  const previousStep = currentStepPosition > 1 ? currentStepPosition - 1 : 1;
  const totalSteps = roadmap?.roadmap_steps.length ?? 0;
  const hasNextStep = currentStep !== null && currentStep.position < totalSteps;
  const nextStep = hasNextStep && currentStep ? currentStep.position + 1 : totalSteps;
  const completedCount = roadmap?.roadmap_steps.filter((step) => completedStepIds.includes(step.id)).length ?? 0;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
  const isCompleted = currentStep !== null && completedStepIds.includes(currentStep.id);
  const roadmapStepHref = (position: number) => `/roadmap/${position}?roadmapId=${roadmap?.id}`;

  const handleProgressToggle = async () => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }

    if (!currentStep) return;

    setSaving(true);
    setStatusMessage(null);

    try {
      if (isCompleted) {
        const { error } = await supabase
          .from("step_progress")
          .delete()
          .eq("user_id", user.id)
          .eq("step_id", currentStep.id);

        if (error) throw error;

        setCompletedStepIds((previous) => previous.filter((id) => id !== currentStep.id));
        setStatusMessage("Step marked as not completed.");
      } else {
        const { error } = await supabase
          .from("step_progress")
          .upsert({ user_id: user.id, step_id: currentStep.id }, { ignoreDuplicates: true });

        if (error) throw error;

        setCompletedStepIds((previous) => (previous.includes(currentStep.id) ? previous : [...previous, currentStep.id]));
        setStatusMessage("Step marked complete.");
      }
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to update progress right now.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] font-sans">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-gray-500">Loading step...</p>
        </main>
      </div>
    );
  }

  if (loadError || !roadmap || !currentStep) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] font-sans">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-red-700" role="alert">{loadError ?? "This step could not be found."}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <nav className="text-sm text-gray-500 flex gap-2 flex-wrap">
            <a href="/" className="hover:text-gray-800">Home</a> /
            <span>{roadmap.title}</span> /
            <span className="text-gray-800 font-medium">Step {currentStep.position}</span>
          </nav>
          <a href={`/roadmaps/${roadmapTitleToSlug(roadmap.title)}`} className="text-sm font-bold text-[#C2185B] hover:underline">
            ← Back to roadmap
          </a>
        </div>

        <div className="bg-gradient-to-r from-slate-800 via-amber-900 to-amber-700 rounded-3xl p-8 text-white shadow-lg mb-10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="w-full md:max-w-2xl">
              <span className="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-4">
                {roadmap.title} · Step {currentStep.position} of {totalSteps}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
                {currentStep.title}
              </h1>
              <p className="text-gray-200 text-sm md:text-base mb-6">
                {currentStep.description || "Goal: keep building your skills with this step."}
              </p>

              <div className="flex gap-2 w-full max-w-md">
                {roadmap.roadmap_steps.map((step) => {
                  const active = step.position <= currentStep.position;
                  return (
                    <div
                      key={step.id}
                      className={`h-2 flex-1 rounded-full ${active ? "bg-pink-400" : "bg-white/20"}`}
                    />
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleProgressToggle}
              disabled={saving}
              className={`font-bold py-3 px-6 rounded-full transition shadow-md flex items-center gap-2 whitespace-nowrap ${
                isCompleted
                  ? "bg-white text-gray-800 hover:bg-gray-100"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              } ${saving ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
              {saving ? "Saving..." : isCompleted ? "Undo completion" : "Mark step complete"}
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {statusMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 mb-2">
              Resources for This Step
            </h2>
            <p className="text-gray-500 text-sm mb-6">Work through them in order, or pick the format you like best.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {currentStep.resources.length === 0 ? (
                <p className="text-gray-500 md:col-span-2">No resources are linked to this step yet.</p>
              ) : (
                currentStep.resources.map((resource) => {
                  const toneClass =
                    resource.kind === "video"
                      ? "bg-pink-500"
                      : resource.kind === "article"
                        ? "bg-blue-400"
                        : resource.kind === "practice"
                          ? "bg-emerald-500"
                          : "bg-amber-400";

                  const labelClass =
                    resource.kind === "video"
                      ? "bg-pink-100 text-pink-600"
                      : resource.kind === "article"
                        ? "bg-blue-100 text-blue-600"
                        : resource.kind === "practice"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-amber-100 text-amber-600";

                  return (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white p-5 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition"
                    >
                      <div className={`w-16 h-16 rounded-xl ${toneClass} flex items-center justify-center flex-shrink-0 text-white`}>
                        {resource.kind === "video" ? (
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        ) : resource.kind === "article" ? (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        ) : (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        )}
                      </div>
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${labelClass}`}>
                          {resource.kind.replace(/_/g, " ")}
                        </span>
                        <h3 className="font-bold text-gray-800 text-sm mt-1">{resource.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">Open resource</p>
                      </div>
                    </a>
                  );
                })
              )}
            </div>

            <div className="flex justify-between items-center border-t border-gray-200 pt-6 gap-4 flex-wrap">
              <a href={roadmapStepHref(previousStep)} className="bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition flex flex-col">
                <span className="text-xs text-gray-500 mb-1">← Previous step</span>
                <span className="font-bold text-gray-800 text-sm">{previousStep >= 1 ? `Step ${previousStep}` : "Roadmap overview"}</span>
              </a>
              <a href={hasNextStep ? roadmapStepHref(nextStep) : `/roadmaps/${roadmapTitleToSlug(roadmap.title)}`} className="bg-[#C2185B] text-white px-6 py-3 rounded-xl shadow-md hover:bg-[#ad1457] transition flex flex-col items-end">
                <span className="text-xs text-pink-200 mb-1">{hasNextStep ? "Next step →" : "Finish roadmap →"}</span>
                <span className="font-bold text-sm">{hasNextStep ? `Step ${nextStep}` : "Roadmap overview"}</span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Progress</h3>
              <p className="text-2xl font-extrabold text-gray-900 mb-2">{completedCount}/{totalSteps}</p>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-amber-500" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">{progressPercent}% complete</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Practice Tip</h3>
              <p className="text-sm text-gray-700">
                Spend 10–15 minutes on this step and repeat the exercise until it feels natural. Small, consistent practice beats long, uneven sessions.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 text-teal-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Practice with the metronome</h3>
                <p className="text-xs text-gray-500 mt-1">Suggested tempo: 72–84 BPM</p>
              </div>
            </div>

            <div className="px-2 pt-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">You're ready to move on when</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">• You can do the skill without looking at the resource.</li>
                <li className="flex items-start gap-2">• It feels steady and relaxed when you play it twice in a row.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}