"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Download, 
  Settings, 
  Film, 
  Loader2 
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const ExportControls = () => {
  const [exportFormat, setExportFormat] = useState("mp4");
  const [quality, setQuality] = useState("high");
  const [resolution, setResolution] = useState("1080p");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [filename, setFilename] = useState("my-video");
  const videoFile = useAppSelector((state) => state.video.videoFile);

  const handleExport = () => {
    if (!videoFile) {
      toast.error("No video to export");
      return;
    }
    
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate export process
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        const newProgress = prev + Math.random() * 5;
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
    }, 300);
  };

  const downloadVideo = () => {
    // Create a fake download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(videoFile as Blob);
    link.download = `${filename}.${exportFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export complete");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Export Video</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Filename</Label>
          <Input
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Enter filename"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Format</Label>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp4">MP4</SelectItem>
              <SelectItem value="webm">WebM</SelectItem>
              <SelectItem value="mov">MOV</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Quality</Label>
          <Select value={quality} onValueChange={setQuality}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (SD)</SelectItem>
              <SelectItem value="medium">Medium (HD)</SelectItem>
              <SelectItem value="high">High (Full HD)</SelectItem>
              <SelectItem value="ultra">Ultra (4K)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Resolution</Label>
          <Select value={resolution} onValueChange={setResolution}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="480p">480p</SelectItem>
              <SelectItem value="720p">720p</SelectItem>
              <SelectItem value="1080p">1080p</SelectItem>
              <SelectItem value="4k">4K</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2 mt-6">
        <div className="flex justify-between items-center">
          <Label>Estimated File Size</Label>
          <span className="text-sm font-medium">
            {quality === "low" ? "5-20 MB" :
             quality === "medium" ? "20-50 MB" :
             quality === "high" ? "50-100 MB" : "100-500 MB"}
          </span>
        </div>
      </div>
      
      {isExporting ? (
        <div className="space-y-2 mt-4">
          <div className="flex justify-between items-center">
            <Label>Export Progress</Label>
            <span className="text-sm">{Math.round(exportProgress)}%</span>
          </div>
          <div className="relative">
            <Slider
              value={[exportProgress]}
              min={0}
              max={100}
              step={1}
              disabled
            />
          </div>
          <div className="mt-4 flex justify-center">
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </Button>
          </div>
        </div>
      ) : (
        <Button
          className="w-full mt-4"
          onClick={handleExport}
          disabled={!videoFile}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Video
        </Button>
      )}
      
      <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
        <div className="flex items-start space-x-3">
          <Settings className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Export Settings</p>
            <p>Your video will be exported with the following settings:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Format: {exportFormat.toUpperCase()}</li>
              <li>Quality: {quality.charAt(0).toUpperCase() + quality.slice(1)}</li>
              <li>Resolution: {resolution}</li>
              <li>Codec: {exportFormat === "mp4" ? "H.264" : exportFormat === "webm" ? "VP9" : "ProRes"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportControls;