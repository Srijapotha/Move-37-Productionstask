"use client";

import React from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { Button } from "@/components/ui/button";
import { FilmIcon, Loader2 } from "lucide-react";

interface HeaderProps {
  onNewProject: () => void;
}

const Header = ({ onNewProject }: HeaderProps) => {
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportProgress, setExportProgress] = React.useState(0);
  const videoFile = useAppSelector((state) => state.video.videoFile);

  const handleExport = () => {
    if (!videoFile) return;
    
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export process
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            downloadVideo();
          }, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const downloadVideo = () => {
    // Create a fake download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(videoFile as Blob);
    link.download = "edited-video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-card border-b">
      <div className="flex items-center space-x-2">
        <FilmIcon className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">VideoForge</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onNewProject}>
          New Project
        </Button>
        {isExporting ? (
          <Button disabled className="min-w-[120px]">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {Math.round(exportProgress)}%
          </Button>
        ) : (
          <Button 
            disabled={!videoFile} 
            onClick={handleExport}
            className="min-w-[120px]"
          >
            Export Video
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;