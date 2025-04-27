"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { resetVideo } from "@/lib/redux/slices/videoSlice";
import { resetTimeline } from "@/lib/redux/slices/timelineSlice";
import { resetAudio } from "@/lib/redux/slices/audioSlice";
import { resetText } from "@/lib/redux/slices/textSlice";
import { resetImage } from "@/lib/redux/slices/imageSlice";

import Header from "@/components/editor/Header";
import Sidebar from "@/components/editor/Sidebar";
import VideoPreview from "@/components/editor/VideoPreview";
import Timeline from "@/components/editor/Timeline";
import UploadPanel from "@/components/editor/UploadPanel";
import EditorControls from "@/components/editor/EditorControls";
import { useAppSelector } from "@/lib/redux/hooks";

const Editor = () => {
  const [activeTool, setActiveTool] = useState<
    "upload" | "edit" | "text" | "audio" | "image" | "export"
  >("upload");
  const videoUrl = useAppSelector((state) => state.video.videoUrl);
  const dispatch = useDispatch();

  const handleNewProject = () => {
    if (confirm("Are you sure you want to start a new project? All unsaved changes will be lost.")) {
      dispatch(resetVideo());
      dispatch(resetTimeline());
      dispatch(resetAudio());
      dispatch(resetText());
      dispatch(resetImage());
      setActiveTool("upload");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header onNewProject={handleNewProject} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden p-4">
            {!videoUrl && activeTool === "upload" ? (
              <UploadPanel />
            ) : (
              <>
                <VideoPreview />
                <EditorControls activeTool={activeTool} />
              </>
            )}
          </div>
          <Timeline />
        </div>
      </div>
    </div>
  );
};

export default Editor;