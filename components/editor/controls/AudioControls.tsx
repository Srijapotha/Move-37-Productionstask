"use client";

import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  addAudioTrack,
  removeAudioTrack,
  toggleMute,
  setVolume,
  setAudioFile,
  updateAudioTrack,
} from "@/lib/redux/slices/audioSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Music, 
  Plus, 
  Volume, 
  Volume2, 
  VolumeX, 
  Trash, 
  Mic
} from "lucide-react";
import { toast } from "sonner";

const AudioControls = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { tracks } = useAppSelector((state) => state.audio);

  const handleAddBackgroundMusic = () => {
    dispatch(addAudioTrack({
      name: "Background Music",
      type: "background",
      volume: 0.7,
      isMuted: false,
    }));
  };

  const handleAddVoiceover = () => {
    dispatch(addAudioTrack({
      name: "Voiceover",
      type: "voiceover",
      volume: 1,
      isMuted: false,
    }));
  };

  const handleRemoveTrack = (id: string) => {
    dispatch(removeAudioTrack(id));
  };

  const handleToggleMute = (id: string) => {
    dispatch(toggleMute(id));
  };

  const handleVolumeChange = (id: string, volume: number[]) => {
    dispatch(setVolume({ id, volume: volume[0] }));
  };

  const handleFileSelect = (id: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.dataset.trackId = id;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const trackId = e.target.dataset.trackId;
    
    if (file && trackId) {
      if (!file.type.startsWith("audio/")) {
        toast.error("Please select an audio file");
        return;
      }
      
      dispatch(setAudioFile({ id: trackId, file }));
      toast.success("Audio file added");
    }
  };

  const handleRenameTrack = (id: string, name: string) => {
    dispatch(updateAudioTrack({ id, changes: { name } }));
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        ref={fileInputRef}
        accept="audio/*"
        className="hidden"
        onChange={handleFileChange}
      />
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Audio Management</h3>
        <div className="space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddVoiceover}
          >
            <Mic className="h-4 w-4 mr-1" />
            Voiceover
          </Button>
          <Button
            size="sm"
            onClick={handleAddBackgroundMusic}
          >
            <Plus className="h-4 w-4 mr-1" />
            Background Music
          </Button>
        </div>
      </div>

      {tracks.length > 0 ? (
        <div className="space-y-4">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="bg-muted p-4 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {track.type === "main" ? (
                    <Volume2 className="h-5 w-5 text-primary" />
                  ) : track.type === "background" ? (
                    <Music className="h-5 w-5 text-chart-1" />
                  ) : (
                    <Mic className="h-5 w-5 text-chart-2" />
                  )}
                  
                  <Input
                    value={track.name}
                    onChange={(e) => handleRenameTrack(track.id, e.target.value)}
                    className="h-8 w-40"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleMute(track.id)}
                  >
                    {track.isMuted ? (
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {track.type !== "main" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTrack(track.id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Volume className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[track.volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(value) => handleVolumeChange(track.id, value)}
                  disabled={track.isMuted}
                  className="flex-1"
                />
                <span className="text-xs w-8 text-right">
                  {Math.round(track.volume * 100)}%
                </span>
              </div>
              
              {track.type !== "main" && (
                <div>
                  {track.url ? (
                    <div className="bg-card p-2 rounded text-sm flex justify-between items-center">
                      <span className="truncate">
                        {track.file?.name || "Audio file"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileSelect(track.id)}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleFileSelect(track.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Audio File
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-muted rounded-lg">
          <Music className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="font-medium mb-1">No audio tracks yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add background music or voiceovers to your video
          </p>
          <div className="flex justify-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddVoiceover}
            >
              <Mic className="h-4 w-4 mr-1" />
              Voiceover
            </Button>
            <Button
              size="sm"
              onClick={handleAddBackgroundMusic}
            >
              <Plus className="h-4 w-4 mr-1" />
              Background Music
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioControls;