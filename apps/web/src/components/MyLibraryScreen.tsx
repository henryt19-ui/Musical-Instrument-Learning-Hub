import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthSession } from "../lib/useUser";
import Header from "./Header";

type Relation<T> = T | T[] | null;

type Roadmap = {
  id: number;
  instrument: string;
  name: string;
  description: string | null;
  level: string;
  stepIds: number[];
  href: string;
};

type LibraryResource = {
  id: number;
  title: string;
  url: string;
  kind: string;
  source: string;
  instrument: string;
};

type FavoriteRoadmapRow = {
  roadmap_id: number;
  roadmaps: Relation<{
    id: number;
    title: string;
    description: string | null;
    level: string;
    instruments: Relation<{ name: string }>;
    roadmap_steps: { id: number }[];
  }>;
};

type ResourceRow = {
  id: number;
  title: string;
  url: string;
  kind: string;
  source: string | null;
  roadmap_steps: Relation<{
    roadmaps: Relation<{
      instruments: Relation<{ name: string }>;
    }>;
  }>;
};

function firstRelation<T>(relation: Relation<T> | undefined): T | undefined {
  return Array.isArray(relation) ? relation[0] : relation ?? undefined;
}

function roadmapTitleToSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function resourceKindLabel(kind: string) {
  return kind.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function sourceLabel(url: string, source: string | null) {
  if (source?.trim()) return source;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Learning resource";
  }
}

const resourceIcons: Record<string, string> = {
  video: "/figma-icons/video.svg",
  article: "/figma-icons/article.svg",
  tabs: "/figma-icons/tabs.svg",
  sheet_music: "/figma-icons/note.svg",
  practice: "/figma-icons/note.svg",
};

function RoadmapCard({ roadmap, completedStepIds }: { roadmap: Roadmap; completedStepIds: Set<number> }) {
  const totalSteps = roadmap.stepIds.length;
  const completed = roadmap.stepIds.filter((id) => completedStepIds.has(id)).length;
  const percent = totalSteps === 0 ? 0 : Math.round((completed / totalSteps) * 100);
  const status = totalSteps > 0 && completed === totalSteps
    ? "Complete"
    : completed > 0 ? "In progress" : "Not started";

  return (
    <article className="legato-roadmap-card">
      <div className="legato-roadmap-meta">
        <span className={"legato-roadmap-status " + (status === "Not started" ? "not-started" : "in-progress")}>
          {status}
        </span>
        <span className="legato-roadmap-count">{completed} / {totalSteps} steps</span>
      </div>
      <h3><a href={roadmap.href}>{roadmap.instrument}: {roadmap.name}</a></h3>
      <p className="legato-roadmap-next">{roadmap.description || roadmap.level + " roadmap"}</p>
      <div className="legato-roadmap-progress-heading">
        <span>Learning progress</span>
        <strong>{percent}%</strong>
      </div>
      <div className="legato-progress-track" role="progressbar" aria-label={roadmap.name + " completion"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <div className="legato-progress-fill" style={{ width: percent + "%" }} />
      </div>
      <a className="legato-roadmap-continue" href={roadmap.href}>{completed > 0 ? "Continue learning" : "View roadmap"} <span aria-hidden="true">→</span></a>
    </article>
  );
}

export default function MyLibraryScreen() {
  const { user, loading: authLoading } = useAuthSession();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [roadmapsLoading, setRoadmapsLoading] = useState(true);
  const [roadmapsError, setRoadmapsError] = useState<string | null>(null);
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resourcesError, setResourcesError] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"browse" | "liked">("browse");
  const [busyResourceId, setBusyResourceId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadResources() {
      const { data, error } = await supabase
        .from("resources")
        .select("id, title, url, kind, source, roadmap_steps!inner(roadmaps!inner(instruments!inner(name)))")
        .order("title");

      if (error) throw error;
      if (!active) return;

      setResources(((data ?? []) as ResourceRow[]).map((row) => {
        const step = firstRelation(row.roadmap_steps);
        const roadmap = firstRelation(step?.roadmaps);
        const instrument = firstRelation(roadmap?.instruments);
        return {
          id: row.id,
          title: row.title,
          url: row.url,
          kind: row.kind,
          source: sourceLabel(row.url, row.source),
          instrument: instrument?.name ?? "Instrument",
        };
      }));
    }

    void loadResources()
      .catch((error: unknown) => {
        if (active) setResourcesError(error instanceof Error ? error.message : "Unable to load resources.");
      })
      .finally(() => {
        if (active) setResourcesLoading(false);
      });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    setRoadmapsLoading(true);
    setRoadmapsError(null);
    setMessage("");

    if (!user) {
      setRoadmaps([]);
      setCompletedIds([]);
      setLikedIds([]);
      setRoadmapsLoading(false);
      return;
    }

    async function loadSavedItems() {
      const [favoritesResult, progressResult, likesResult] = await Promise.all([
        supabase.from("favorite_roadmaps")
          .select("roadmap_id, roadmaps(id, title, description, level, instruments(name), roadmap_steps(id))")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false })
          .returns<FavoriteRoadmapRow[]>(),
        supabase.from("step_progress").select("step_id").eq("user_id", user!.id),
        supabase.from("liked_resources").select("resource_id").eq("user_id", user!.id),
      ]);

      if (favoritesResult.error) throw favoritesResult.error;
      if (progressResult.error) throw progressResult.error;
      if (likesResult.error) throw likesResult.error;
      if (!active) return;

      setRoadmaps((favoritesResult.data ?? []).flatMap((row) => {
        const roadmap = firstRelation(row.roadmaps);
        if (!roadmap) return [];
        return [{
          id: roadmap.id,
          instrument: firstRelation(roadmap.instruments)?.name ?? "Instrument",
          name: roadmap.title,
          description: roadmap.description,
          level: roadmap.level,
          stepIds: roadmap.roadmap_steps.map((step) => step.id),
          href: "/roadmaps/" + roadmapTitleToSlug(roadmap.title),
        }];
      }));
      setCompletedIds((progressResult.data ?? []).map((row) => Number(row.step_id)));
      setLikedIds((likesResult.data ?? []).map((row) => Number(row.resource_id)));
    }

    void loadSavedItems()
      .catch((error: unknown) => {
        if (!active) return;
        setRoadmapsError(error instanceof Error ? error.message : "Unable to load your saved items.");
        setRoadmaps([]);
        setCompletedIds([]);
        setLikedIds([]);
      })
      .finally(() => {
        if (active) setRoadmapsLoading(false);
      });

    return () => { active = false; };
  }, [user?.id, authLoading]);

  const likedSet = new Set(likedIds);
  const completedSet = new Set(completedIds);
  const visibleResources = resources.filter((resource) => activeTab === "browse" || likedSet.has(resource.id));

  async function toggleLike(resource: LibraryResource) {
    if (!user) {
      setMessage("Log in to like a resource and save it to your library.");
      return;
    }
    if (busyResourceId !== null) return;

    const wasLiked = likedSet.has(resource.id);
    setBusyResourceId(resource.id);
    setMessage("");

    try {
      const result = wasLiked
        ? await supabase.from("liked_resources").delete().eq("user_id", user.id).eq("resource_id", resource.id)
        : await supabase.from("liked_resources").upsert(
          { user_id: user.id, resource_id: resource.id },
          { onConflict: "user_id,resource_id", ignoreDuplicates: true },
        );

      if (result.error) throw result.error;
      setLikedIds((current) => wasLiked
        ? current.filter((id) => id !== resource.id)
        : [...new Set([...current, resource.id])]);
      setMessage(resource.title + (wasLiked ? " removed from liked resources." : " added to liked resources."));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save your like. Please try again.");
    } finally {
      setBusyResourceId(null);
    }
  }

  return (
    <>
      <Header />
      <div className="legato-ui legato-library">
        <main className="legato-library-content">
          <div className="legato-library-overview">
            <div>
              <h1 className="legato-library-title">My Library</h1>
              <p className="legato-library-subtitle">Your favorite roadmaps and learning resources, in one place.</p>
            </div>
            <div className="legato-tab-switch" role="tablist" aria-label="Library resources view">
              <button type="button" role="tab" id="legato-browse-tab"
                aria-selected={activeTab === "browse"} aria-controls="legato-resources-panel"
                className={activeTab === "browse" ? "selected" : ""}
                onClick={() => { setActiveTab("browse"); setMessage(""); }}>
                <img src="/figma-icons/article.svg" alt="" /> Browse
              </button>
              <button type="button" role="tab" id="legato-liked-tab"
                aria-selected={activeTab === "liked"} aria-controls="legato-resources-panel"
                className={activeTab === "liked" ? "selected" : ""}
                onClick={() => { setActiveTab("liked"); setMessage(""); }}>
                <img src="/figma-icons/liked.svg" alt="" /> Liked
              </button>
            </div>
          </div>

          <section className="legato-roadmaps-section" aria-labelledby="legato-roadmaps-heading">
            <h2 id="legato-roadmaps-heading" className="legato-section-title roadmaps">Favorite Roadmaps</h2>
            <div className="legato-roadmap-grid">
              {(roadmapsLoading || authLoading) && <p className="legato-empty-state">Loading your saved roadmaps...</p>}
              {!roadmapsLoading && roadmapsError && (
                <p className="legato-empty-state" role="alert">Could not load your library: {roadmapsError}</p>
              )}
              {!roadmapsLoading && !roadmapsError && !user && (
                <p className="legato-empty-state"><a className="legato-tip-link" href="/login">Log in</a> to see your saved roadmaps and progress.</p>
              )}
              {!roadmapsLoading && !roadmapsError && user && roadmaps.length === 0 && (
                <p className="legato-empty-state">No favorite roadmaps yet. Explore a roadmap and save it to see it here.</p>
              )}
              {!roadmapsLoading && !roadmapsError && roadmaps.map((roadmap) => (
                <RoadmapCard key={roadmap.id} roadmap={roadmap} completedStepIds={completedSet} />
              ))}
            </div>
          </section>

          <section className="legato-resources-section" aria-labelledby="legato-resources-heading">
            <h2 id="legato-resources-heading" className="legato-section-title resources">
              {activeTab === "browse" ? "Learning Resources" : "Liked Resources"}
            </h2>
            <div id="legato-resources-panel" role="tabpanel"
              aria-labelledby={activeTab === "browse" ? "legato-browse-tab" : "legato-liked-tab"}
              className="legato-resource-list">
              {resourcesLoading && <p className="legato-empty-state">Loading resources...</p>}
              {!resourcesLoading && resourcesError && <p className="legato-empty-state" role="alert">Could not load resources: {resourcesError}</p>}
              {!resourcesLoading && !resourcesError && activeTab === "liked" && !user && (
                <p className="legato-empty-state"><a className="legato-tip-link" href="/login">Log in</a> to see your liked resources.</p>
              )}
              {!resourcesLoading && !resourcesError && (activeTab === "browse" || user) && visibleResources.map((resource) => {
                const liked = likedSet.has(resource.id);
                return (
                  <article className="legato-resource-item" key={resource.id}>
                    <span className={"legato-resource-icon " + resource.kind}>
                      <img src={resourceIcons[resource.kind] ?? "/figma-icons/article.svg"} alt="" />
                    </span>
                    <div className="legato-resource-copy">
                      <h3><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title}</a></h3>
                      <p>{resourceKindLabel(resource.kind)} · {resource.source} · {resource.instrument}</p>
                    </div>
                    <button type="button"
                      className={"legato-like-button" + (liked ? " is-liked" : "")}
                      aria-label={(liked ? "Unlike " : "Like ") + resource.title}
                      aria-pressed={liked}
                      disabled={busyResourceId !== null}
                      onClick={() => void toggleLike(resource)}>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
                      </svg>
                    </button>
                  </article>
                );
              })}
              {!resourcesLoading && !resourcesError && (activeTab === "browse" || user) && visibleResources.length === 0 && (
                <p className="legato-empty-state">{activeTab === "browse" ? "No resources available yet." : "No liked resources yet. Browse resources and tap the heart to save your favorites."}</p>
              )}
            </div>
            <div className="legato-resource-tip">
              <span>Tap the heart to like a resource. Your likes are saved to your account.</span>
              <a className="legato-tip-link" href="/resources">Explore resources →</a>
            </div>
            <p className="legato-action-message" role="status" aria-live="polite">
              {message} {message.startsWith("Log in") && <a className="legato-tip-link" href="/login">Log in</a>}
            </p>
          </section>
        </main>
        <footer className="legato-library-footer">
          <div>
            <a href="/" className="legato-brand" aria-label="Legato home"><img src="/legato-logo.png" alt="Legato" /></a>
            <span>© 2026 Legato</span>
          </div>
        </footer>
      </div>
    </>
  );
}
