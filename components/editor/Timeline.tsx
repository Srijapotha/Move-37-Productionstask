"use client";

import React, { useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { 
  setCurrentTime,
  togglePlayback
} from "@/lib/redux/slices/videoSlice";
import { 
  setSelectedSegment, 
  reorderSegments,
  setZoom
} from "@/lib/redux/slices/timelineSlice";
import { 
  ChevronUp, 
  ChevronDown, 
  ZoomIn, 
  ZoomOut 
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Timeline = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const timelineRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  
  const { segments, selectedSegmentId, zoom } = useAppSelector((state) => state.timeline);
  const { currentTime, duration, isPlaying } = useAppSelector((state) => state.video);
  
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !duration) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    const newTime = clickPos * duration;
    
    dispatch(setCurrentTime(newTime));
  };

  const handleSegmentClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setSelectedSegment(id));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (sourceIndex !== targetIndex) {
      dispatch(reorderSegments({ sourceIndex, destinationIndex: targetIndex }));
    }
  };

  const handleZoomChange = (value: number[]) => {
    dispatch(setZoom(value[0]));
  };

  // Generate time markers based on duration and zoom
  const timeMarkers = [];
  if (duration) {
    const interval = Math.max(1, Math.floor(duration / 10)); // At least 1 second intervals
    for (let i = 0; i <= duration; i += interval) {
      timeMarkers.push({
        time: i,
        label: `${Math.floor(i / 60)}:${Math.floor(i % 60).toString().padStart(2, '0')}`
      });
    }
  }

  if (!duration) return null;

  return (
    <div className={cn(
      "bg-card border-t transition-all duration-300 overflow-hidden",
      isExpanded ? "h-64" : "h-12"
    )}>
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </Button>
          <span className="font-medium">Timeline</span>
        </div>
        
        {isExpanded && (
          <div className="flex items-center space-x-4">
            <ZoomOut size={18} className="text-muted-foreground" />
            <Slider
              value={[zoom]}
              min={0.5}
              max={5}
              step={0.1}
              onValueChange={handleZoomChange}
              className="w-32"
            />
            <ZoomIn size={18} className="text-muted-foreground" />
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="p-4 space-y-3">
          {/* Time markers */}
          <div className="flex justify-between text-xs text-muted-foreground">
            {timeMarkers.map(marker => (
              <div 
                key={marker.time}
                className="absolute"
                style={{ left: `${(marker.time / duration) * 100}%` }}
              >
                {marker.label}
              </div>
            ))}
          </div>
          
          {/* Main timeline */}
          <div
            ref={timelineRef}
            className="relative h-20 bg-muted rounded cursor-pointer mt-6"
            onClick={handleTimelineClick}
          >
            {/* Segments */}
            {segments.map((segment, index) => (
              <div
                key={segment.id}
                className={cn(
                  "absolute h-full rounded-md border-2 transition-all",
                  selectedSegmentId === segment.id
                    ? "border-primary bg-primary/20"
                    : "border-accent bg-accent/20 hover:bg-accent/30"
                )}
                style={{
                  left: `${(segment.startTime / duration) * 100 * zoom}%`,
                  width: `${((segment.endTime - segment.startTime) / duration) * 100 * zoom}%`,
                  maxWidth: "100%"
                }}
                onClick={(e) => handleSegmentClick(segment.id, e)}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="p-2 text-xs truncate">Segment {index + 1}</div>
              </div>
            ))}
            
            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-primary-foreground z-10"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          
          {/* Audio track visualization (mocked) */}
          <div className="h-16 bg-muted rounded overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="100%" height="100%">
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <path 
                  d="M0,50 Q25,30 50,50 T100,50 T150,50 T200,50 T250,50 T300,50 T350,50 T400,50 T450,50 T500,50 T550,50 T600,50" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth="2"
                  fill="url(#waveGradient)"
                  transform="scale(2, 1)"
                />
              </svg>
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-primary-foreground z-10"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;