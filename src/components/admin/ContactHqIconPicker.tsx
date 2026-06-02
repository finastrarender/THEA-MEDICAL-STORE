"use client";

import { useMemo, useState } from "react";
import SimpleIcon, { SIMPLE_ICON_OPTIONS, simpleIconLabel } from "@/components/sections/SimpleIcon";

type Props = {
  value: unknown;
  onChange: (value: string) => void;
};

export default function ContactHqIconPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = typeof value === "string" && value ? value : "location";
  const selectedLabel = simpleIconLabel(selected);

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return SIMPLE_ICON_OPTIONS;
    return SIMPLE_ICON_OPTIONS.filter(
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
            <SimpleIcon name={selected} className="admin-integrity-icon-picker__icon" />
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
                <SimpleIcon name={option.key} className="admin-integrity-icon-picker__icon" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
