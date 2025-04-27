"use client";

import React from "react";
import { ImageOverlay } from "@/lib/redux/slices/imageSlice";

interface ImageOverlayRendererProps {
  overlays: ImageOverlay[];
  currentTime: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

const ImageOverlayRenderer = ({ overlays, currentTime, containerRef }: ImageOverlayRendererProps) => {
  // Filter overlays that should be visible at the current time
  const visibleOverlays = overlays.filter(
    overlay => currentTime >= overlay.startTime && currentTime <= overlay.endTime
  );

  if (visibleOverlays.length === 0) return null;

  return (
    <>
      {visibleOverlays.map(overlay => (
        <div
          key={overlay.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${overlay.position.x * 100}%`,
            top: `${overlay.position.y * 100}%`,
            transform: `translate(-50%, -50%) rotate(${overlay.style.rotation}deg)`,
          }}
        >
          <img
            src={overlay.url}
            alt=""
            style={{
              width: `${overlay.size.width}px`,
              height: `${overlay.size.height}px`,
              borderRadius: `${overlay.style.borderRadius}px`,
              borderWidth: `${overlay.style.borderWidth}px`,
              borderStyle: overlay.style.borderWidth > 0 ? 'solid' : 'none',
              borderColor: overlay.style.borderColor,
              opacity: overlay.style.opacity,
            }}
          />
        </div>
      ))}
    </>
  );
};

export default ImageOverlayRenderer;