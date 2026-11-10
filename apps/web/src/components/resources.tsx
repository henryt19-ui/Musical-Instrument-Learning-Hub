import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type ResourceKind = "video" | "article" | "tabs" | "sheet_music" | "practice";
type ResourceType = "Video" | "Article" | "Tabs" | "Sheet music" | "Practice";

type Resource = {
  id: number;
  type: ResourceType;
  instrument: string;
  level: string;
  title: string;
  url: string;
  description: string | null;
  source: string;
  durationMinutes: number | null;
};

type Relation<T> = T | T[] | null;

type ResourceRow = {
  id: number;
  title: string;
  url: string;
  kind: string;
  description: string | null;
  source: string | null;
  duration_minutes: number | null;
  roadmap_steps: Relation<{
    roadmaps: Relation<{
      level: string;
      instruments: Relation<{ name: string }>;
    }>;
  }>;
};

const resourceTypeLabels: Record<ResourceKind, ResourceType> = {
  video: "Video",
  article: "Article",
  tabs: "Tabs",
  sheet_music: "Sheet music",
  practice: "Practice",
};

function firstRelation<T>(relation: Relation<T> | undefined): T | undefined {
  return Array.isArray(relation) ? relation[0] : relation ?? undefined;
}

function resourceType(kind: string): ResourceType {
  if (Object.prototype.hasOwnProperty.call(resourceTypeLabels, kind)) {
    return resourceTypeLabels[kind as ResourceKind];
  }
  throw new Error(`Unsupported resource kind: ${kind}`);
}

function resourceSource(url: string, source: string | null) {
  if (source?.trim()) return source;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function formatDuration(minutes: number | null) {
  if (minutes === null) return null;
  return `${minutes} min`;
}

function formatLevel(level: string) {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function ResourceIcon({ type }: { type: ResourceType }) {
  if (type === "Video") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 12 7-12 7V5Z" /></svg>;
  }
  if (type === "Article") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v5h4M9 12h7M9 16h7" /></svg>;
  }
  if (type === "Practice") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14M5 10h14M5 15h14M5 20h14" /></svg>;
}

function FilterOptions<T extends string>({
  label,
  options,
  selected,
  onSelect,
  className = "",
}: {
  label: string;
  options: T[];
  selected: T;
  onSelect: (option: T) => void;
  className?: string;
}) {
  return (
    <div className="resources-filter-row">
      <span className="resources-filter-label">{label}</span>
      <div className="resources-filter-options">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={`resources-filter-chip ${className} ${selected === option ? "is-selected" : ""}`}
            aria-pressed={selected === option}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ResourcesScreen() {
  const [instrument, setInstrument] = useState("All");
  const [type, setType] = useState<"All" | ResourceType>("All");
  const [level, setLevel] = useState("All");
  const [search, setSearch] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [unassignedCount, setUnassignedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadResources() {
      const { data, error } = await supabase
        .from("resources")
        .select("id, title, url, kind, description, source, duration_minutes, roadmap_steps!inner(roadmaps!inner(level, instruments!inner(name)))")
        .order("title");

      if (error) throw error;

      const rows = (data ?? []) as ResourceRow[];
      const loadedResources = rows.map((row) => {
        const step = firstRelation(row.roadmap_steps);
        const roadmap = firstRelation(step?.roadmaps);
        const relatedInstrument = firstRelation(roadmap?.instruments);

        return {
          id: row.id,
          type: resourceType(row.kind),
          instrument: relatedInstrument?.name ?? "Unassigned",
          level: roadmap ? formatLevel(roadmap.level) : "Unassigned",
          title: row.title,
          url: row.url,
          description: row.description,
          source: resourceSource(row.url, row.source),
          durationMinutes: row.duration_minutes,
        };
      });

      if (active) {
        setResources(loadedResources);
        setUnassignedCount(loadedResources.filter(
          (resource) => resource.instrument === "Unassigned" || resource.level === "Unassigned",
        ).length);
      }
    }

    loadResources()
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : String(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const instruments = ["All", ...Array.from(new Set(resources.map((resource) => resource.instrument))).sort()];
  const typeOrder: ResourceType[] = ["Video", "Article", "Tabs", "Sheet music", "Practice"];
  const types: Array<"All" | ResourceType> = [
    "All",
    ...typeOrder.filter((resourceType) => resources.some((resource) => resource.type === resourceType)),
  ];
  const levels = ["All", ...Array.from(new Set(resources.map((resource) => resource.level))).sort()];

  const visibleResources = resources.filter((resource) => {
    const matchesInstrument = instrument === "All" || resource.instrument === instrument;
    const matchesType = type === "All" || resource.type === type;
    const matchesLevel = level === "All" || resource.level === level;
    const matchesSearch = `${resource.type} ${resource.instrument} ${resource.level} ${resource.title} ${resource.source} ${resource.description ?? ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchesInstrument && matchesType && matchesLevel && matchesSearch;
  });

  return (
    <div className="legato-ui resources-page">
      <header className="resources-header">
        <div className="resources-header-inner">
          <a className="legato-brand resources-brand" href="/" aria-label="Legato home">
            <img src="/legato-logo.png" alt="Legato" />
          </a>
          <nav className="resources-menu" aria-label="Main navigation">
            <a href="/instruments">Instruments</a>
            <a href="/roadmaps">Roadmaps</a>
            <a href="/resources" aria-current="page">Resources</a>
            <a href="/practice-tools">Practice Tools</a>
            <a href="/library">My Library</a>
          </nav>
          <a className="resources-login" href="/login">Log in</a>
        </div>
      </header>

      <main className="resources-content">
        <div className="resources-heading-row">
          <div>
            <h1 className="resources-title">Resources</h1>
            <p className="resources-subtitle">Hand-picked videos, articles, tabs and practice routines from around the web.</p>
          </div>
          <label className="resources-search">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4 4" /></svg>
            <input
              type="search"
              aria-label="Search resources"
              placeholder="Search resources"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>

        <section className="resources-filters" aria-label="Filter resources">
          <FilterOptions label="Instrument" options={instruments} selected={instrument} onSelect={setInstrument} />
          <FilterOptions label="Type" options={types} selected={type} onSelect={setType} className="type-chip" />
          <FilterOptions label="Level" options={levels} selected={level} onSelect={setLevel} />
        </section>

        <p className="resources-count" aria-live="polite">
          Showing {visibleResources.length} of {resources.length} resources
        </p>
        {unassignedCount > 0 && (
          <p className="resources-empty" role="status">
            {unassignedCount} resource{unassignedCount === 1 ? " is" : "s are"} missing a roadmap or instrument association and shown as Unassigned. Link {unassignedCount === 1 ? "it" : "them"} to a roadmap step in Supabase to enable the correct filters.
          </p>
        )}

        <section className="resources-grid" aria-label="Resources">
          {loading && <p className="resources-empty" role="status">Loading resources...</p>}
          {loadError && <p className="resources-empty" role="alert">Unable to load resources: {loadError}</p>}
          {!loading && !loadError && resources.length === 0 && (
            <p className="resources-empty" role="status">No resources have been added yet.</p>
          )}
          {visibleResources.map((resource) => (
            <article className={`resources-card resources-card-${resource.type.toLowerCase().replace(/\s+/g, "-")}`} key={resource.id}>
              <div className="resources-card-art">
                <ResourceIcon type={resource.type} />
              </div>
              <div className="resources-card-copy">
                <div className="resources-card-tags">
                  <span className={`resources-type-tag type-${resource.type.toLowerCase().replace(/\s+/g, "-")}`}>{resource.type}</span>
                  <span className="resources-instrument-tag">{resource.instrument}</span>
                  <span className="resources-instrument-tag">{resource.level}</span>
                </div>
                <h2><a href={resource.url} target="_blank" rel="noreferrer">{resource.title}</a></h2>
                {resource.description && <p>{resource.description}</p>}
                <p>{resource.source}{resource.durationMinutes !== null && ` · ${formatDuration(resource.durationMinutes)}`}</p>
              </div>
            </article>
          ))}
          {!loading && !loadError && resources.length > 0 && visibleResources.length === 0 && (
            <p className="resources-empty" role="status">No resources match those filters.</p>
          )}
        </section>
      </main>

      <footer className="resources-footer">
        <div>
          <a className="legato-brand" href="/" aria-label="Legato home">
            <img src="/legato-logo.png" alt="Legato" />
          </a>
          <span>© 2026 Legato</span>
        </div>
      </footer>
    </div>
  );
}
