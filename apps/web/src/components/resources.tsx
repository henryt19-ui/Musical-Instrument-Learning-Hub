import { useState } from "react";

type ResourceType = "Video" | "Article" | "Tabs" | "Sheet music" | "Practice";
type ResourceLevel = "Beginner" | "Intermediate";

type Resource = {
  id: number;
  type: ResourceType;
  instrument: string;
  instrumentFilter: string;
  level: ResourceLevel;
  detail: string;
};

const resources: Resource[] = [
  { id: 1, type: "Video", instrument: "[Instrument]", instrumentFilter: "[Instrument 1]", level: "Beginner", detail: "[Length]" },
  { id: 2, type: "Article", instrument: "[Instrument]", instrumentFilter: "[Instrument 2]", level: "Beginner", detail: "[Read time]" },
  { id: 3, type: "Tabs", instrument: "[Instrument]", instrumentFilter: "[Instrument 3]", level: "Intermediate", detail: "[Details]" },
  { id: 4, type: "Practice", instrument: "[Instrument]", instrumentFilter: "[Instrument 1]", level: "Beginner", detail: "[Length]" },
  { id: 5, type: "Video", instrument: "[Instrument]", instrumentFilter: "[Instrument 2]", level: "Intermediate", detail: "[Length]" },
  { id: 6, type: "Article", instrument: "[Instrument]", instrumentFilter: "[Instrument 3]", level: "Beginner", detail: "[Read time]" },
  { id: 7, type: "Sheet music", instrument: "[Instrument]", instrumentFilter: "[Instrument 1]", level: "Intermediate", detail: "[Details]" },
  { id: 8, type: "Practice", instrument: "[Instrument]", instrumentFilter: "[Instrument 2]", level: "Beginner", detail: "[Length]" },
];

const instruments = ["All", "[Instrument 1]", "[Instrument 2]", "[Instrument 3]"];
const types: Array<"All" | ResourceType> = ["All", "Video", "Article", "Tabs", "Sheet music", "Practice"];
const levels: Array<"All" | ResourceLevel> = ["All", "Beginner", "Intermediate"];

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
  const [level, setLevel] = useState<"All" | ResourceLevel>("All");
  const [search, setSearch] = useState("");

  const visibleResources = resources.filter((resource) => {
    const matchesInstrument = instrument === "All" || resource.instrumentFilter === instrument;
    const matchesType = type === "All" || resource.type === type;
    const matchesLevel = level === "All" || resource.level === level;
    const matchesSearch = `${resource.type} ${resource.instrument} ${resource.instrumentFilter} ${resource.detail} [Resource title] [Source]`
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

        <p className="resources-count" aria-live="polite">Showing [n] resources</p>

        <section className="resources-grid" aria-label="Resources">
          {visibleResources.map((resource) => (
            <article className={`resources-card resources-card-${resource.type.toLowerCase().replace(/\s+/g, "-")}`} key={resource.id}>
              <div className="resources-card-art">
                <ResourceIcon type={resource.type} />
              </div>
              <div className="resources-card-copy">
                <div className="resources-card-tags">
                  <span className={`resources-type-tag type-${resource.type.toLowerCase().replace(/\s+/g, "-")}`}>{resource.type}</span>
                  <span className="resources-instrument-tag">{resource.instrument}</span>
                </div>
                <h2>[Resource title]</h2>
                <p>[Source] · {resource.detail}</p>
              </div>
            </article>
          ))}
          {visibleResources.length === 0 && (
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
