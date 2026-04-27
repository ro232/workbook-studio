"use client";

import { useCallback, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Upload, X, Camera, RotateCw } from "lucide-react";
import type { ChildPhoto, PhotoCrop } from "@/types/workbook";
import { cn } from "@/lib/utils";

interface Props {
  photo?: ChildPhoto;
  onChange: (photo: ChildPhoto | undefined) => void;
}

export function PhotoUpload({ photo, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [shape, setShape] = useState<PhotoCrop["shape"]>("circle");
  const [pixelCrop, setPixelCrop] = useState<Area | null>(null);

  const onSelectFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setTempUrl(reader.result as string);
      setShape(photo?.crop.shape ?? "circle");
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setEditing(true);
    };
    reader.readAsDataURL(file);
  }, [photo?.crop.shape]);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setPixelCrop(areaPixels);
  }, []);

  const onApply = useCallback(async () => {
    if (!tempUrl || !pixelCrop) return;
    // Convert to a cropped data URL via canvas so we ship a small image
    const dataUrl = await renderCroppedDataUrl(tempUrl, pixelCrop, shape);
    const cropPercent: PhotoCrop = {
      x: 0, y: 0, width: 100, height: 100,
      zoom: 1,
      shape,
    };
    onChange({ dataUrl, crop: cropPercent });
    setEditing(false);
    setTempUrl(null);
  }, [tempUrl, pixelCrop, shape, onChange]);

  const onCancel = () => {
    setEditing(false);
    setTempUrl(null);
  };

  const onRemove = () => {
    onChange(undefined);
  };

  const onReplace = () => {
    fileRef.current?.click();
  };

  const aspect = 1; // square; rendering frame can be circle/rounded/square

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        className="hidden"
      />

      {!photo && !editing && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-[var(--color-border)] bg-white hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]/40 transition"
        >
          <div className="w-12 h-12 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center">
            <Camera size={20} />
          </div>
          <div className="text-sm font-medium">Add a photo</div>
          <div className="text-xs text-[var(--color-ink-muted)]">PNG, JPG · cropped to fit the cover</div>
        </button>
      )}

      {photo && !editing && (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-white">
          <div
            className={cn(
              "w-16 h-16 bg-cover bg-center shrink-0",
              photo.crop.shape === "circle" && "rounded-full",
              photo.crop.shape === "rounded" && "rounded-xl",
            )}
            style={{ backgroundImage: `url(${photo.dataUrl})` }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">Photo uploaded</div>
            <div className="text-xs text-[var(--color-ink-muted)] capitalize">{photo.crop.shape} frame</div>
          </div>
          <button
            type="button"
            onClick={onReplace}
            className="px-3 py-2 text-xs font-medium rounded-full border border-[var(--color-border)] hover:bg-[var(--color-bg)] flex items-center gap-1.5"
          >
            <RotateCw size={12} /> Change
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="px-2 py-2 text-xs rounded-full text-[var(--color-ink-muted)] hover:bg-[var(--color-bg)]"
            aria-label="Remove photo"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {editing && tempUrl && (
        <div className="rounded-xl border border-[var(--color-border)] bg-white overflow-hidden">
          <div className="relative w-full bg-[var(--color-bg)]" style={{ aspectRatio: "1 / 1" }}>
            <Cropper
              image={tempUrl}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={shape === "circle" ? "round" : "rect"}
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="cover"
            />
          </div>
          <div className="p-3 space-y-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-[var(--color-ink-muted)] mb-1.5">Frame shape</div>
              <div className="flex gap-2">
                {(["circle", "rounded", "square"] as PhotoCrop["shape"][]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShape(s)}
                    className={cn(
                      "px-3 py-1.5 text-xs capitalize rounded-full border transition",
                      shape === s
                        ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                        : "border-[var(--color-border)] text-[var(--color-ink-muted)] hover:bg-[var(--color-bg)]"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-[var(--color-ink-muted)] mb-1.5">Zoom</div>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm rounded-full border border-[var(--color-border)] hover:bg-[var(--color-bg)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onApply}
                className="px-4 py-2 text-sm font-medium rounded-full bg-[var(--color-accent)] text-white hover:bg-[#265648] flex items-center gap-1.5"
              >
                <Upload size={14} /> Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

async function renderCroppedDataUrl(src: string, area: Area, shape: PhotoCrop["shape"]): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const SIZE = 480; // output size
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no ctx"));

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, SIZE, SIZE);
      // Note: shape is rendered at the cover SVG layer (PhotoFrame), not baked into the data URL,
      // so the user could change shape after uploading. Output is a square crop.
      void shape;
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = src;
  });
}
