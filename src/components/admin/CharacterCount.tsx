"use client";

import React from "react";

type CharacterCountProps = {
  current: number;
  max: number;
  warningAt?: number;
};

export default function CharacterCount({ current, max, warningAt }: CharacterCountProps) {
  const isLimitReached = current === max;
  const isOver = current > max;

  let color = "#64748b"; // slate-500
  if (isOver || isLimitReached) color = "#ef4444"; // red-500

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginLeft: "auto", minWidth: "140px" }}>
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color,
          transition: "all 0.2s ease",
          backgroundColor: isOver || isLimitReached ? "#fee2e2" : "transparent",
          padding: "2px 6px",
          borderRadius: "4px",
        }}
      >
        {current} / {max}
      </span>
      {(isLimitReached || isOver) && (
        <span style={{ fontSize: "0.65rem", color: "#ef4444", fontWeight: 500, marginTop: 2, textAlign: "right", lineHeight: 1.2 }}>
          Content cannot exceed the original design length to preserve layout consistency.
        </span>
      )}
    </div>
  );
}
