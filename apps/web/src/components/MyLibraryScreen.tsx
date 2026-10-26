import { useState } from "react";

// Placeholder content. Replace these arrays with API responses when the
// roadmap and saved-resource endpoints become available.
type Roadmap = {
  id: string;
  instrument: string;
  name: string;
  status: "in-progress" | "not-started";
  currentStep: number;
  totalSteps: number;
  nextStep: string;
};

type SavedResource = {
  id: string;
  title: string;
  type: "Video" | "Article" | "Tabs";
  source: string;
  instrument: string;
  liked: boolean;
};

const exampleRoadmaps: Roadmap[] = [
  {
    id: "piano-basics",
    instrument: "Piano",
    name: "Beginner Fundamentals",
    status: "in-progress",
    currentStep: 4,
    totalSteps: 10,
    nextStep: "Practicing major scales",
  },
  {
    id: "guitar-chords",
    instrument: "Guitar",
    name: "First Chords",
    status: "not-started",
    currentStep: 0,
    totalSteps: 8,
    nextStep: "Understanding the fretboard",
  },
];

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
  const inProgress = roadmap.status === "in-progress";
  const progress = Math.round((roadmap.currentStep / roadmap.totalSteps) * 100);
  return (
    <article className="legato-roadmap-card">
      <div className="legato-roadmap-meta">
        <span className={`legato-roadmap-status ${inProgress ? "in-progress" : "not-started"}`}>
          {inProgress ? "In progress" : "Not started"}
        </span>
        <span className="legato-roadmap-count">
          {inProgress ? `Step ${roadmap.currentStep} of ${roadmap.totalSteps}` : `${roadmap.totalSteps} steps`}
        </span>
      </div>
      <h3>{roadmap.instrument}: {roadmap.name}</h3>
      <div
        className="legato-progress-track"
        role="progressbar"
        aria-label={`${roadmap.instrument} roadmap progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div className="legato-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="legato-roadmap-next">
        {inProgress ? "Next" : "Start with"}: {roadmap.nextStep}
      </p>
    </article>
  );
}

export default function MyLibraryScreen() {
  const [activeTab, setActiveTab] = useState<"favorites" | "liked">("favorites");
  const [savedIds, setSavedIds] = useState<string[]>(exampleResources.map((item) => item.id));
  const [message, setMessage] = useState("");
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
            {exampleRoadmaps.map((roadmap) => <RoadmapCard key={roadmap.id} roadmap={roadmap} />)}
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
