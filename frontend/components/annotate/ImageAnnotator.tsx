"use client";

import { MouseEvent, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/shared/Icons";
import { removePolygon, savePolygon } from "@/lib/api";
import type { AnnotatedImage, Point, Polygon } from "@/lib/types";

type Props = {
  image: AnnotatedImage;
  onPolygonAdded: (imageId: number, polygon: Polygon) => void;
  onPolygonRemoved: (imageId: number, polygonId: number) => void;
};

const palette = ["#a78bfa", "#22d3ee", "#34d399", "#fbbf24", "#fb7185"];

export function ImageAnnotator({
  image,
  onPolygonAdded,
  onPolygonRemoved,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"select" | "draw">("select");
  const [selectedPolygonId, setSelectedPolygonId] = useState<number | null>(
    null,
  );
  const [draft, setDraft] = useState<Point[]>([]);
  const [label, setLabel] = useState("");
  const [color, setColor] = useState(palette[0]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const draftPath = useMemo(
    () => draft.map((point) => `${point.x},${point.y}`).join(" "),
    [draft],
  );
  const canSave = draft.length >= 3;
  const selectedPolygon =
    image.polygons.find((polygon) => polygon.id === selectedPolygonId) ?? null;

  function switchMode(nextMode: "select" | "draw") {
    setMode(nextMode);
    setError("");
    if (nextMode === "select") {
      setDraft([]);
    } else {
      setSelectedPolygonId(null);
    }
  }

  function handleCanvasClick(event: MouseEvent<SVGSVGElement>) {
    if (mode !== "draw") {
      setSelectedPolygonId(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Number(((event.clientX - rect.left) / rect.width).toFixed(4));
    const y = Number(((event.clientY - rect.top) / rect.height).toFixed(4));
    setDraft((current) => [...current, { x, y }]);
  }

  function handlePolygonSelect(
    event: MouseEvent<SVGPolygonElement>,
    polygonId: number,
  ) {
    event.stopPropagation();
    if (mode === "draw") return;
    setSelectedPolygonId(polygonId);
  }

  async function handleSave() {
    setError("");
    if (!canSave) {
      setError("Click at least three points before saving a polygon.");
      return;
    }
    setIsSaving(true);
    try {
      const polygon = await savePolygon(image.id, {
        label: label.trim(),
        color,
        points: draft,
      });
      onPolygonAdded(image.id, polygon);
      setDraft([]);
      setLabel("");
      setSelectedPolygonId(polygon.id);
      setMode("select");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save polygon.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemove(polygon: Polygon) {
    await removePolygon(polygon.id);
    onPolygonRemoved(image.id, polygon.id);
    if (selectedPolygonId === polygon.id) setSelectedPolygonId(null);
  }

  async function handleRemoveSelected() {
    if (!selectedPolygon) return;
    await handleRemove(selectedPolygon);
  }

  return (
    <article className="image-card">
      <div className="column-header">
        <div>
          <div className="column-title">
            <Icon name="image" size={18} /> {image.title || "Untitled scan"}
          </div>
          <div className="helper">
            {new Date(image.created_at).toLocaleString()}
          </div>
        </div>
        <div className="actions">
          <span className="badge">{image.polygons.length} saved</span>
          <span className="badge">{draft.length} draft pts</span>
        </div>
      </div>

      <div className="mode-switch" aria-label="Annotation mode selector">
        <button
          className={`mode-button${mode === "select" ? " active" : ""}`}
          type="button"
          onClick={() => switchMode("select")}
        >
          <Icon name="target" size={16} /> Select polygons
        </button>
        <button
          className={`mode-button${mode === "draw" ? " active" : ""}`}
          type="button"
          onClick={() => switchMode("draw")}
        >
          <Icon name="polygon" size={16} /> Draw polygon
        </button>
      </div>

      {error ? (
        <div className="error" style={{ marginBottom: 12 }}>
          {error}
        </div>
      ) : null}
      {selectedPolygon ? (
        <div className="selection-banner">
          <span>
            <Icon
              name="polygon"
              size={16}
              style={{ color: selectedPolygon.color }}
            />{" "}
            Selected: {selectedPolygon.label || `Polygon ${selectedPolygon.id}`}
          </span>
          <button
            className="ghost-btn danger"
            type="button"
            onClick={handleRemoveSelected}
          >
            Delete selected
          </button>
        </div>
      ) : (
        <div className="notice" style={{ marginBottom: 12 }}>
          {mode === "select"
            ? "Click a saved polygon on the image, or select it from the list below."
            : "Click around the region to place points. Save becomes available after three points."}
        </div>
      )}

      <div
        className={`canvas-wrap ${mode === "draw" ? "drawing" : "selecting"}`}
        ref={wrapperRef}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="canvas-img"
          src={image.image_url}
          alt={image.title || "Uploaded image"}
          draggable={false}
        />
        <svg
          className="canvas-svg"
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
          onClick={handleCanvasClick}
          role="img"
          aria-label="Annotation canvas"
        >
          {image.polygons.map((polygon) => {
            const isSelected = polygon.id === selectedPolygonId;
            return (
              <polygon
                key={polygon.id}
                className="saved-polygon"
                points={polygon.points
                  .map((point) => `${point.x},${point.y}`)
                  .join(" ")}
                fill={`${polygon.color}${isSelected ? "55" : "30"}`}
                stroke={isSelected ? "#ffffff" : polygon.color}
                strokeWidth={isSelected ? "0.011" : "0.006"}
                vectorEffect="non-scaling-stroke"
                onClick={(event) => handlePolygonSelect(event, polygon.id)}
              />
            );
          })}
          {draft.length > 1 ? (
            <polyline
              points={draftPath}
              fill="none"
              stroke={color}
              strokeWidth="0.006"
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
          {canSave ? (
            <polygon
              points={draftPath}
              fill={`${color}22`}
              stroke={color}
              strokeWidth="0.004"
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
          {draft.map((point, index) => (
            <g key={`${point.x}-${point.y}-${index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="0.012"
                fill="#020617"
                stroke={color}
                strokeWidth="0.004"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={point.x} cy={point.y} r="0.005" fill={color} />
            </g>
          ))}
        </svg>
      </div>

      <div className="annotation-controls">
        <label className="field">
          Polygon label
          <input
            className="input"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="lesion, organ, region"
          />
        </label>
        <div className="actions">
          {palette.map((item) => (
            <button
              key={item}
              className={`color-dot${item === color ? " active" : ""}`}
              type="button"
              style={{ background: item }}
              aria-label={`Use ${item}`}
              onClick={() => setColor(item)}
            />
          ))}
        </div>
        <div className="actions">
          <button
            className="btn"
            type="button"
            disabled={isSaving || !canSave || mode !== "draw"}
            onClick={handleSave}
          >
            {isSaving ? "Saving polygon…" : "Finish & save polygon"}
          </button>
          <button
            className="ghost-btn"
            type="button"
            disabled={!draft.length || mode !== "draw"}
            onClick={() => setDraft((current) => current.slice(0, -1))}
          >
            Undo point
          </button>
          <button
            className="ghost-btn"
            type="button"
            disabled={!draft.length}
            onClick={() => setDraft([])}
          >
            Clear draft
          </button>
        </div>
      </div>

      <div className="polygon-list">
        {image.polygons.length ? (
          image.polygons.map((polygon) => {
            const isSelected = polygon.id === selectedPolygonId;
            return (
              <div
                className={`polygon-row${isSelected ? " selected" : ""}`}
                key={polygon.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setMode("select");
                  setDraft([]);
                  setSelectedPolygonId(polygon.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setMode("select");
                    setDraft([]);
                    setSelectedPolygonId(polygon.id);
                  }
                }}
              >
                <span>
                  <Icon
                    name="polygon"
                    size={16}
                    style={{ color: polygon.color }}
                  />
                  {polygon.label || `Polygon ${polygon.id}`} ·{" "}
                  {polygon.points.length} pts
                </span>
                <button
                  className="ghost-btn danger"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    void handleRemove(polygon);
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })
        ) : (
          <div className="empty">
            No saved polygons on this image yet. Switch to Draw polygon to
            create one.
          </div>
        )}
      </div>
    </article>
  );
}
