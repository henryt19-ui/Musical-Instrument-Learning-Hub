import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Roadmap = {
  id: number;
  instrument: string;
  name: string;
  description: string | null;
  level: string;
  totalSteps: number;
  href: string;
};

type SavedResource = {
  id: string;
  title: string;
  type: "Video" | "Article" | "Tabs";
  source: string;
  instrument: string;
  liked: boolean;
};

type FavoriteRoadmapRow = {
  roadmap_id: number;
  roadmaps: {
    id: number;
    title: string;
    description: string | null;
    level: string;
    instruments: { name: string } | null;
    roadmap_steps: { id: number }[];
  } | null;
};

function roadmapTitleToSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const exampleResources: SavedResource[] = [
  {
    id: "video-1",
    title: "Piano Practice Routine for Beginners",
    type: "Video",
    source: "Video tutorial",
    instrument: "Piano",
    liked: true,
  },
  {
    id: "article-1",
    title: "How to Read Sheet Music",
    type: "Article",
    source: "Learning guide",
    instrument: "Piano",
    liked: false,
  },
  {
    id: "tabs-1",
    title: "Essential Beginner Guitar Chords",
    type: "Tabs",
    source: "Chord reference",
    instrument: "Guitar",
    liked: true,
  },
];

const resourceIcon: Record<SavedResource["type"], string> = {
  Video: "/figma-icons/video.svg",
  Article: "/figma-icons/article.svg",
  Tabs: "/figma-icons/tabs.svg",
};

function LibraryNavigation() {
  return (
    <header className="legato-library-nav">
      <div className="legato-library-nav-inner">
        <a className="legato-brand" href="/" aria-label="Legato home">
          <img src="/legato-logo.png" alt="Legato" />
        </a>
        <nav className="legato-menu" aria-label="Primary navigation">
          <a href="/instruments">Instruments</a>
          <a href="/roadmaps">Roadmaps</a>
          <a href="/resources">Resources</a>
          <a href="/practice-tools">Practice Tools</a>
          <a className="is-active" href="/library" aria-current="page">My Library</a>
        </nav>
        <a href="/login" className="legato-profile" aria-label="Log in">
          <span className="legato-profile-avatar" aria-hidden="true">A</span>
          <span>Log in</span>
        </a>
      </div>
    </header>
  );
}

function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
  return (
    <article className="legato-roadmap-card">
      <div className="legato-roadmap-meta">
        <span className="legato-roadmap-status not-started">Saved</span>
        <span className="legato-roadmap-count">{roadmap.totalSteps} steps</span>
      </div>
      <h3><a href={roadmap.href}>{roadmap.instrument}: {roadmap.name}</a></h3>
      <p className="legato-roadmap-next">{roadmap.description || `${roadmap.level} roadmap`}</p>
    </article>
  );
}

export default function MyLibraryScreen() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [roadmapsLoading, setRoadmapsLoading] = useState(true);
  const [roadmapsError, setRoadmapsError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"favorites" | "liked">("favorites");
  const [savedIds, setSavedIds] = useState<string[]>(exampleResources.map((item) => item.id));
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    let requestId = 0;

    async function loadFavoriteRoadmaps(userId: string | null) {
      const currentRequestId = ++requestId;
      setIsAuthenticated(Boolean(userId));
      setRoadmapsError(null);
      setRoadmapsLoading(true);

      if (!userId) {
        setRoadmaps([]);
        setRoadmapsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("favorite_roadmaps")
          .select("roadmap_id, roadmaps(id, title, description, level, instruments(name), roadmap_steps(id))")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .returns<FavoriteRoadmapRow[]>();

        if (error) throw error;
        if (!active || currentRequestId !== requestId) return;

        setRoadmaps((data ?? []).flatMap(({ roadmaps: roadmap }) => {
          if (!roadmap) return [];
          return [{
            id: roadmap.id,
            instrument: roadmap.instruments?.name ?? "Instrument",
            name: roadmap.title,
            description: roadmap.description,
            level: roadmap.level,
            totalSteps: roadmap.roadmap_steps.length,
            href: `/roadmaps/${roadmapTitleToSlug(roadmap.title)}`,
          }];
        }));
      } catch (error) {
        if (active && currentRequestId === requestId) {
          setRoadmapsError(error instanceof Error ? error.message : String(error));
          setRoadmaps([]);
        }
      } finally {
        if (active && currentRequestId === requestId) setRoadmapsLoading(false);
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void loadFavoriteRoadmaps(session?.user.id ?? null);
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) throw error;
      return loadFavoriteRoadmaps(data.session?.user.id ?? null);
    }).catch((error: unknown) => {
      if (active) {
        setRoadmapsError(error instanceof Error ? error.message : String(error));
        setRoadmapsLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const visibleResources = exampleResources.filter((resource) =>
    activeTab === "favorites" ? savedIds.includes(resource.id) : resource.liked
  );

  function toggleSave(resource: SavedResource) {
    const isSaved = savedIds.includes(resource.id);
    setSavedIds((previous) => isSaved
      ? previous.filter((id) => id !== resource.id)
      : [...previous, resource.id]
    );
    setMessage(`${resource.title} ${isSaved ? "removed from" : "added to"} favorites.`);
  }

  return (
    <div className="legato-ui legato-library">
      <LibraryNavigation />
      <main className="legato-library-content">
        <div className="legato-library-overview">
          <div>
            <h1 className="legato-library-title">My Library</h1>
            <p className="legato-library-subtitle">Your roadmaps and everything you've saved, in one place.</p>
          </div>
          <div className="legato-tab-switch" role="tablist" aria-label="Library view">
            <button
              type="button"
              role="tab"
              id="legato-favorites-tab"
              aria-selected={activeTab === "favorites"}
              aria-controls="legato-resources-panel"
              className={activeTab === "favorites" ? "selected" : ""}
              onClick={() => { setActiveTab("favorites"); setMessage(""); }}
            >
              <img src="/figma-icons/favorite.svg" alt="" /> Favorites
            </button>
            <button
              type="button"
              role="tab"
              id="legato-liked-tab"
              aria-selected={activeTab === "liked"}
              aria-controls="legato-resources-panel"
              className={activeTab === "liked" ? "selected" : ""}
              onClick={() => { setActiveTab("liked"); setMessage(""); }}
            >
              <img src="/figma-icons/liked.svg" alt="" /> Liked
            </button>
          </div>
        </div>

        <section className="legato-roadmaps-section" aria-labelledby="legato-roadmaps-heading">
          <h2 id="legato-roadmaps-heading" className="legato-section-title roadmaps">Roadmaps</h2>
          <div className="legato-roadmap-grid">
            {roadmapsLoading && <p className="legato-empty-state">Loading your saved roadmaps...</p>}
            {!roadmapsLoading && roadmapsError && (
              <p className="legato-empty-state" role="alert">Could not load your roadmaps: {roadmapsError}</p>
            )}
            {!roadmapsLoading && !roadmapsError && !isAuthenticated && (
              <div className="legato-empty-state">
                <span><a className="legato-tip-link" href="/login">Log in</a> to see roadmaps saved to your library.</span>
              </div>
            )}
            {!roadmapsLoading && !roadmapsError && isAuthenticated && roadmaps.length === 0 && (
              <div className="legato-empty-state">
                No roadmaps saved yet.
                <span> Browse roadmaps and add your favorites to see them here.</span>
              </div>
            )}
            {!roadmapsLoading && !roadmapsError && roadmaps.map((roadmap) => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} />
            ))}
          </div>
        </section>

        <section className="legato-resources-section" aria-labelledby="legato-resources-heading">
          <h2 id="legato-resources-heading" className="legato-section-title resources">
            {activeTab === "favorites" ? "Saved Resources" : "Liked Resources"}
          </h2>
          <div
            id="legato-resources-panel"
            role="tabpanel"
            aria-labelledby={activeTab === "favorites" ? "legato-favorites-tab" : "legato-liked-tab"}
            className="legato-resource-list"
          >
            {visibleResources.map((resource) => (
              <article className="legato-resource-item" key={resource.id}>
                <span className={`legato-resource-icon ${resource.type.toLowerCase()}`}>
                  <img src={resourceIcon[resource.type]} alt="" />
                </span>
                <div className="legato-resource-copy">
                  <h3>{resource.title}</h3>
                  <p>{resource.type} · {resource.source} · {resource.instrument}</p>
                </div>
                <button
                  type="button"
                  className={`legato-save-button ${savedIds.includes(resource.id) ? "is-saved" : ""}`}
                  aria-label={`${savedIds.includes(resource.id) ? "Remove" : "Add"} ${resource.title} ${savedIds.includes(resource.id) ? "from" : "to"} favorites`}
                  aria-pressed={savedIds.includes(resource.id)}
                  onClick={() => toggleSave(resource)}
                >
                  <img src="/figma-icons/star.svg" alt="" />
                </button>
              </article>
            ))}
            {visibleResources.length === 0 && (
              <div className="legato-empty-state">
                {activeTab === "favorites" ? "Nothing saved yet." : "No liked resources yet."}
                <span> Browse resources to add items to your library.</span>
              </div>
            )}
          </div>
          <div className="legato-resource-tip">
            <span>Tap the star on any roadmap or resource to save it here.</span>
            <span className="legato-tip-link">Browse resources →</span>
          </div>
          <p className="legato-action-message" role="status" aria-live="polite">{message}</p>
        </section>
      </main>
      <footer className="legato-library-footer">
        <div>
          <a href="/" className="legato-brand" aria-label="Legato home">
            <img src="/legato-logo.png" alt="Legato" />
          </a>
          <span>© 2026 Legato</span>
        </div>
      </footer>
    </div>
  );
}
