"use client";

import React from "react";
import TextControls from "./controls/TextControls";
import AudioControls from "./controls/AudioControls";
import ImageControls from "./controls/ImageControls";
import EditControls from "./controls/EditControls";
import ExportControls from "./controls/ExportControls";

interface EditorControlsProps {
  activeTool: "upload" | "edit" | "text" | "audio" | "image" | "export";
}

const EditorControls = ({ activeTool }: EditorControlsProps) => {
  return (
    <div className="mt-4 p-4 bg-card rounded-lg border">
      {activeTool === "edit" && <EditControls />}
      {activeTool === "text" && <TextControls />}
      {activeTool === "audio" && <AudioControls />}
      {activeTool === "image" && <ImageControls />}
      {activeTool === "export" && <ExportControls />}
    </div>
  );
};

export default EditorControls;