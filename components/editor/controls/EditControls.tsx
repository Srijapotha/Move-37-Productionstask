"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  addSegment,
  removeSegment,
  updateSegment,
} from "@/lib/redux/slices/timelineSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Scissors, 
  Trash, 
  Plus, 
  Clock 
} from "lucide-react";
import { toast } from "sonner";

const EditControls = () => {
  const dispatch = useAppDispatch();
  const { segments, selectedSegmentId } = useAppSelector((state) => state.timeline);
  const { currentTime, duration } = useAppSelector((state) => state.video);
  
  const selectedSegment = segments.find(segment => segment.id === selectedSegmentId);

  const handleSplitAtCurrentTime = () => {
    if (!selectedSegmentId || !currentTime) return;
    
    const segment = segments.find(seg => seg.id === selectedSegmentId);
    if (!segment) return;
    
    // Check if current time is within the selected segment
    if (currentTime <= segment.startTime || currentTime >= segment.endTime) {
      toast.error("Current time is not within the selected segment");
      return;
    }
    
    // Update the existing segment to end at current time
    dispatch(updateSegment({
      id: segment.id,
      changes: {
        endTime: currentTime,
        duration: currentTime - segment.startTime,
      }
    }));
    
    // Create a new segment from current time to original end time
    dispatch(addSegment({
      id: `segment-${Date.now()}`,
      startTime: currentTime,
      endTime: segment.endTime,
      duration: segment.endTime - currentTime,
    }));
    
    toast.success("Split segment at current position");
  };

  const handleRemoveSegment = () => {
    if (!selectedSegmentId) return;
    
    if (segments.length <= 1) {
      toast.error("Cannot remove the only segment");
      return;
    }
    
    dispatch(removeSegment(selectedSegmentId));
    toast.success("Segment removed");
  };

  const handleUpdateTiming = (startTime: number, endTime: number) => {
    if (!selectedSegmentId) return;
    
    dispatch(updateSegment({
      id: selectedSegmentId,
      changes: {
        startTime,
        endTime,
        duration: endTime - startTime,
      }
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Video Editing</h3>
        <div className="space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSplitAtCurrentTime}
            disabled={!selectedSegmentId}
          >
            <Scissors className="h-4 w-4 mr-1" />
            Split at Current Time
          </Button>
        </div>
      </div>

      {selectedSegment ? (
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Selected Segment</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveSegment}
                disabled={segments.length <= 1}
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Start Time: {selectedSegment.startTime.toFixed(2)}s</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateTiming(currentTime, selectedSegment.endTime)}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Set to current
                  </Button>
                </div>
                <Slider
                  value={[selectedSegment.startTime]}
                  min={0}
                  max={Math.min(selectedSegment.endTime - 0.1, duration)}
                  step={0.01}
                  onValueChange={(value) => handleUpdateTiming(value[0], selectedSegment.endTime)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>End Time: {selectedSegment.endTime.toFixed(2)}s</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateTiming(selectedSegment.startTime, currentTime)}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Set to current
                  </Button>
                </div>
                <Slider
                  value={[selectedSegment.endTime]}
                  min={Math.max(selectedSegment.startTime + 0.1, 0)}
                  max={duration}
                  step={0.01}
                  onValueChange={(value) => handleUpdateTiming(selectedSegment.startTime, value[0])}
                />
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Duration: {(selectedSegment.endTime - selectedSegment.startTime).toFixed(2)}s</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg border">
            <h4 className="font-medium mb-2">Segment Arrangement</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop segments in the timeline to rearrange them
            </p>
            <div className="flex flex-wrap gap-2">
              {segments.map((segment, index) => (
                <div
                  key={segment.id}
                  className={`
                    px-3 py-2 rounded-md text-sm cursor-pointer
                    ${segment.id === selectedSegmentId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted-foreground/10"
                    }
                  `}
                  onClick={() => dispatch({ type: "timeline/setSelectedSegment", payload: segment.id })}
                >
                  Segment {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-muted rounded-lg">
          <Scissors className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="font-medium mb-1">No segment selected</h3>
          <p className="text-sm text-muted-foreground">
            Select a segment in the timeline to edit it
          </p>
        </div>
      )}
    </div>
  );
};

export default EditControls;