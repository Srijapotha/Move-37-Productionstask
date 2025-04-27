"use client";

import React from "react";
import { TextOverlay } from "@/lib/redux/slices/textSlice";

interface TextOverlayRendererProps {
  overlays: TextOverlay[];
  currentTime: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

const TextOverlayRenderer = ({ overlays, currentTime, containerRef }: TextOverlayRendererProps) => {
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
            color: overlay.style.color,
            backgroundColor: overlay.style.backgroundColor,
            padding: overlay.isSubtitle ? "4px 8px" : "0",
            borderRadius: overlay.isSubtitle ? "4px" : "0",
            fontFamily: overlay.style.fontFamily,
            fontSize: `${overlay.style.fontSize}px`,
            fontWeight: overlay.style.isBold ? "bold" : "normal",
            fontStyle: overlay.style.isItalic ? "italic" : "normal",
            opacity: overlay.style.opacity,
            textAlign: "center",
            maxWidth: "80%",
            wordBreak: "break-word",
          }}
        >
          {overlay.content}
        </div>
      ))}
    </>
  );
};

export default TextOverlayRenderer;