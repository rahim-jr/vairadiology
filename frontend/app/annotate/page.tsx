"use client";

import { FormEvent, useEffect, useState } from "react";
import { ImageAnnotator } from "@/components/annotate/ImageAnnotator";
import { AppNav } from "@/components/shared/AppNav";
import { Icon } from "@/components/shared/Icons";
import { fetchImages, uploadImage } from "@/lib/api";
import type { AnnotatedImage, Polygon } from "@/lib/types";

export default function AnnotatePage() {
  const [images, setImages] = useState<AnnotatedImage[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setImages(await fetchImages());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load images.");
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, []);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!file) {
      setError("Choose an image first.");
      return;
    }
    setIsUploading(true);
    try {
      const uploaded = await uploadImage(file, title || file.name);
      setImages((current) => [uploaded, ...current]);
      setFile(null);
      setTitle("");
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  function handlePolygonAdded(imageId: number, polygon: Polygon) {
    setImages((current) =>
      current.map((image) =>
        image.id === imageId
          ? { ...image, polygons: [...image.polygons, polygon] }
          : image,
      ),
    );
  }

  function handlePolygonRemoved(imageId: number, polygonId: number) {
    setImages((current) =>
      current.map((image) =>
        image.id === imageId
          ? {
              ...image,
              polygons: image.polygons.filter(
                (polygon) => polygon.id !== polygonId,
              ),
            }
          : image,
      ),
    );
  }

  const polygonCount = images.reduce(
    (total, image) => total + image.polygons.length,
    0,
  );

  return (
    <main className="shell">
      <AppNav />
      <section className="page">
        <div className="toolbar">
          <div>
            <span className="eyebrow">
              <Icon name="polygon" size={16} /> Annotation studio
            </span>
            <h1 className="page-title gradient-text">
              A great annotation ahead!
            </h1>
            <p className="subtitle">
              Upload images, scroll through the stack, click points to draw
              polygons, then save or remove each region with confidence.
            </p>
          </div>
          <div className="stats-grid" style={{ minWidth: 320, marginTop: 0 }}>
            <div className="stat-card">
              <div className="stat-value">{images.length}</div>
              <div className="stat-label">Images</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{polygonCount}</div>
              <div className="stat-label">Polygons</div>
            </div>
          </div>
        </div>
        {error ? (
          <div className="error" style={{ marginBottom: 16 }}>
            {error}
          </div>
        ) : null}
        <div className="annotate-grid">
          <form className="upload-card form" onSubmit={handleUpload}>
            <span className="eyebrow">
              <Icon name="upload" size={16} /> Upload panel
            </span>
            <h2 style={{ margin: "0", letterSpacing: "-0.05em" }}>
              Add imaging data
            </h2>
            <p className="helper">
              Accepted by Django/Pillow: PNG, JPEG, WebP, GIF, BMP and TIFF.
              Images are persisted under backend media.
            </p>
            <div className="tool-steps">
              <div className="tool-step">
                <span className="step-number">1</span>
                <span>Upload an image and give it a useful title.</span>
              </div>
              <div className="tool-step">
                <span className="step-number">2</span>
                <span>
                  Click at least three points on the image to draft a polygon.
                </span>
              </div>
              <div className="tool-step">
                <span className="step-number">3</span>
                <span>
                  Save the shape or remove exact polygons from the list.
                </span>
              </div>
            </div>
            <label className="field">
              Title
              <input
                className="input"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Chest scan 01"
              />
            </label>
            <label className="field">
              Image file
              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </label>
            {file ? <div className="notice">Ready: {file.name}</div> : null}
            <button className="btn" disabled={isUploading} type="submit">
              {isUploading ? "Uploading image…" : "Upload image"}
            </button>
          </form>
          <div className="image-strip">
            {isLoading ? <div className="skeleton" /> : null}
            {!isLoading && images.length === 0 ? (
              <div className="empty">
                <div className="empty-visual">
                  <Icon name="image" size={34} />
                </div>
                No images yet. Upload one to start annotating.
              </div>
            ) : null}
            {images.map((image) => (
              <ImageAnnotator
                key={image.id}
                image={image}
                onPolygonAdded={handlePolygonAdded}
                onPolygonRemoved={handlePolygonRemoved}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
