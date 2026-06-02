"use client";

import { useMemo, useState } from "react";
import ProjectsIntegrityIcon, {
  PROJECTS_INTEGRITY_ICON_OPTIONS,
  projectsIntegrityIconLabel,
} from "@/components/icons/ProjectsIntegrityIcon";

type Props = {
  value: unknown;
  onChange: (value: string) => void;
};

export default function ProjectsIntegrityIconPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = typeof value === "string" ? value : "verified";
  const selectedLabel = projectsIntegrityIconLabel(selected);

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return PROJECTS_INTEGRITY_ICON_OPTIONS;
    return PROJECTS_INTEGRITY_ICON_OPTIONS.filter(
      (option) =>
        option.key.toLowerCase().includes(query) ||
        option.label.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <div className="admin-icon-picker admin-integrity-icon-picker">
      <button
        type="button"
        className="admin-icon-picker__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Choose icon"
      >
        <span className="admin-icon-picker__trigger-content">
          <span className="admin-integrity-icon-picker__preview" aria-hidden="true">
            <ProjectsIntegrityIcon name={selected} className="admin-integrity-icon-picker__icon" />
          </span>
          <span>{selectedLabel}</span>
        </span>
        <span className="admin-icon-picker__caret" aria-hidden="true">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open ? (
        <div className="admin-icon-picker__panel admin-integrity-icon-picker__panel" role="listbox">
          <input
            type="search"
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-icon-picker__search"
          />
          <p className="admin-integrity-icon-picker__hint">
            {filteredOptions.length} icon{filteredOptions.length === 1 ? "" : "s"}
          </p>
          <div className="admin-icon-picker__grid admin-integrity-icon-picker__grid">
            {filteredOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                role="option"
                aria-selected={selected === option.key}
                className={`admin-icon-picker__item ${selected === option.key ? "is-selected" : ""}`}
                title={option.label}
                aria-label={option.label}
                onClick={() => {
                  onChange(option.key);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <ProjectsIntegrityIcon
                  name={option.key}
                  className="admin-integrity-icon-picker__icon"
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
