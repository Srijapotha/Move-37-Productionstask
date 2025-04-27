"use client";

import React from "react";
import { 
  Upload, 
  Scissors, 
  Type, 
  Music, 
  Image, 
  Download 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/redux/hooks";

type ToolType = "upload" | "edit" | "text" | "audio" | "image" | "export";

interface SidebarProps {
  activeTool: ToolType;
  setActiveTool: React.Dispatch<React.SetStateAction<ToolType>>;
}

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const ToolButton = ({ icon, label, active, disabled, onClick }: ToolButtonProps) => (
  <button
    className={cn(
      "flex flex-col items-center justify-center p-3 rounded-md transition-colors",
      active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted",
      disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground"
    )}
    onClick={onClick}
    disabled={disabled}
  >
    <div className="w-10 h-10 flex items-center justify-center">
      {icon}
    </div>
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const Sidebar = ({ activeTool, setActiveTool }: SidebarProps) => {
  const videoUrl = useAppSelector((state) => state.video.videoUrl);
  const hasVideo = !!videoUrl;

  const tools: { type: ToolType; icon: React.ReactNode; label: string }[] = [
    { type: "upload", icon: <Upload size={24} />, label: "Upload" },
    { type: "edit", icon: <Scissors size={24} />, label: "Edit" },
    { type: "text", icon: <Type size={24} />, label: "Text" },
    { type: "audio", icon: <Music size={24} />, label: "Audio" },
    { type: "image", icon: <Image size={24} />, label: "Images" },
    { type: "export", icon: <Download size={24} />, label: "Export" },
  ];

  return (
    <aside className="w-20 bg-card border-r flex flex-col items-center py-4">
      <div className="space-y-4">
        {tools.map((tool) => (
          <ToolButton
            key={tool.type}
            icon={tool.icon}
            label={tool.label}
            active={activeTool === tool.type}
            disabled={tool.type !== "upload" && !hasVideo}
            onClick={() => setActiveTool(tool.type)}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;