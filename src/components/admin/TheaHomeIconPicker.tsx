"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

type IconOption = { key: string; label: string };

type Props = {
  value: unknown;
  onChange: (value: string) => void;
  options: readonly IconOption[];
  renderIcon: (name: string, className: string) => ReactNode;
  fallbackKey?: string;
};

export default function TheaHomeIconPicker({
  value,
  onChange,
  options,
  renderIcon,
  fallbackKey,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const fallback = fallbackKey ?? options[0]?.key ?? "";
  const selected =
    typeof value === "string" && options.some((option) => option.key === value)
      ? value
      : fallback;
  const selectedLabel =
    options.find((option) => option.key === selected)?.label ?? selected;

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter(
      (option) =>
        option.key.toLowerCase().includes(query) ||
        option.label.toLowerCase().includes(query),
    );
  }, [options, search]);

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
            {renderIcon(selected, "admin-integrity-icon-picker__icon")}
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
                {renderIcon(option.key, "admin-integrity-icon-picker__icon")}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
