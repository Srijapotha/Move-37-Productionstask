"use client";

import React, { useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { 
  setVideoDuration, 
  togglePlayback, 
  setCurrentTime 
} from "@/lib/redux/slices/videoSlice";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  VolumeX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { initializeTimeline } from "@/lib/redux/slices/timelineSlice";
import TextOverlayRenderer from "./overlays/TextOverlayRenderer";
import ImageOverlayRenderer from "./overlays/ImageOverlayRenderer";

const VideoPreview = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  
  const { videoUrl, isPlaying, currentTime, duration } = useAppSelector(
    (state) => state.video
  );
  
  const textOverlays = useAppSelector((state) => state.text.overlays);
  const imageOverlays = useAppSelector((state) => state.image.overlays);
  const [isMuted, setIsMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(1);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      dispatch(setCurrentTime(videoRef.current.currentTime));
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      dispatch(setVideoDuration(videoDuration));
      dispatch(initializeTimeline(videoDuration));
    }
  };

  const handleSeek = (value: number[]) => {
    dispatch(setCurrentTime(value[0]));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden">
      <div 
        ref={containerRef} 
        className="relative bg-black aspect-video flex items-center justify-center"
      >
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              className="max-h-full max-w-full"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={() => dispatch(togglePlayback())}
            />
            <div className="absolute inset-0 pointer-events-none">
              <TextOverlayRenderer 
                overlays={textOverlays} 
                currentTime={currentTime} 
                containerRef={containerRef}
              />
              <ImageOverlayRenderer 
                overlays={imageOverlays} 
                currentTime={currentTime} 
                containerRef={containerRef}
              />
            </div>
          </>
        ) : (
          <div className="text-muted-foreground">No video loaded</div>
        )}
      </div>
      
      {videoUrl && (
        <div className="p-3 space-y-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.01}
            onValueChange={handleSeek}
            className="my-2"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch(setCurrentTime(0))}
              >
                <SkipBack size={20} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch(togglePlayback())}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch(setCurrentTime(duration))}
              >
                <SkipForward size={20} />
              </Button>
              
              <div className="text-sm text-muted-foreground">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 w-32">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
              
              <Slider
                value={[volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;