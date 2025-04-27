"use client";

import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  addImageOverlay,
  removeImageOverlay,
  updateImageStyle,
  updateImageTiming,
} from "@/lib/redux/slices/imageSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Image, 
  Plus, 
  Trash, 
  Move, 
  Clock, 
  Frame 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ImageControls = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { overlays, selectedOverlayId } = useAppSelector((state) => state.image);
  const { duration, currentTime } = useAppSelector((state) => state.video);
  const selectedOverlay = overlays.find(overlay => overlay.id === selectedOverlayId);
  
  const [activeTab, setActiveTab] = React.useState("style");

  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      
      const url = URL.createObjectURL(file);
      
      // Create a new image element to get dimensions
      const img = new window.Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const width = Math.min(300, img.width);
        const height = width / aspectRatio;
        
        dispatch(addImageOverlay({
          file,
          url,
          startTime: Math.max(0, currentTime),
          endTime: Math.min(duration, currentTime + 5),
          position: { x: 0.5, y: 0.5 },
          size: { width, height },
          style: {
            opacity: 1,
            borderRadius: 0,
            borderWidth: 0,
            borderColor: "#ffffff",
            rotation: 0,
          },
        }));
        
        toast.success("Image added");
      };
      img.src = url;
    }
  };

  const handleRemoveImage = () => {
    if (selectedOverlayId) {
      dispatch(removeImageOverlay(selectedOverlayId));
    }
  };

  const handleStyleChange = (style: Partial<{
    opacity: number;
    borderRadius: number;
    borderWidth: number;
    borderColor: string;
    rotation: number;
  }>) => {
    if (selectedOverlayId && selectedOverlay) {
      dispatch(updateImageStyle({
        id: selectedOverlayId,
        style,
      }));
    }
  };

  const handleTimingChange = (startTime: number, endTime: number) => {
    if (selectedOverlayId) {
      dispatch(updateImageTiming({
        id: selectedOverlayId,
        startTime,
        endTime,
      }));
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Image Overlays</h3>
        <Button
          size="sm"
          onClick={handleAddImage}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Image
        </Button>
      </div>

      {overlays.length > 0 ? (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Label>Image overlay:</Label>
            <Select
              value={selectedOverlayId || ""}
              onValueChange={(value) => dispatch({ type: "image/setSelectedImageOverlay", payload: value })}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select image overlay" />
              </SelectTrigger>
              <SelectContent>
                {overlays.map((overlay, index) => (
                  <SelectItem key={overlay.id} value={overlay.id}>
                    Image {index + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedOverlayId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveImage}
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>

          {selectedOverlay && (
            <Tabs defaultValue="style" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="style">
                  <Frame className="h-4 w-4 mr-2" />
                  Style
                </TabsTrigger>
                <TabsTrigger value="position">
                  <Move className="h-4 w-4 mr-2" />
                  Position
                </TabsTrigger>
                <TabsTrigger value="timing">
                  <Clock className="h-4 w-4 mr-2" />
                  Timing
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="style" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Opacity: {Math.round(selectedOverlay.style.opacity * 100)}%</Label>
                    <Slider
                      value={[selectedOverlay.style.opacity]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={(value) => handleStyleChange({ opacity: value[0] })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Border Radius: {selectedOverlay.style.borderRadius}px</Label>
                    <Slider
                      value={[selectedOverlay.style.borderRadius]}
                      min={0}
                      max={50}
                      step={1}
                      onValueChange={(value) => handleStyleChange({ borderRadius: value[0] })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Border Width: {selectedOverlay.style.borderWidth}px</Label>
                    <Slider
                      value={[selectedOverlay.style.borderWidth]}
                      min={0}
                      max={20}
                      step={1}
                      onValueChange={(value) => handleStyleChange({ borderWidth: value[0] })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Border Color</Label>
                    <div className="flex gap-2">
                      <div 
                        className="border rounded w-10 h-10" 
                        style={{ backgroundColor: selectedOverlay.style.borderColor }} 
                      />
                      <Input
                        type="color"
                        value={selectedOverlay.style.borderColor}
                        onChange={(e) => handleStyleChange({ borderColor: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Rotation: {selectedOverlay.style.rotation}°</Label>
                    <Slider
                      value={[selectedOverlay.style.rotation]}
                      min={0}
                      max={360}
                      step={1}
                      onValueChange={(value) => handleStyleChange({ rotation: value[0] })}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="position" className="space-y-4">
                <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                  <div className="relative aspect-video w-full max-w-md border border-dashed border-muted-foreground">
                    <img
                      src={selectedOverlay.url}
                      alt="Preview"
                      className="max-w-[200px] max-h-[200px] absolute"
                      style={{
                        left: `${selectedOverlay.position.x * 100}%`,
                        top: `${selectedOverlay.position.y * 100}%`,
                        borderRadius: `${selectedOverlay.style.borderRadius}px`,
                        borderWidth: `${selectedOverlay.style.borderWidth}px`,
                        borderStyle: selectedOverlay.style.borderWidth > 0 ? 'solid' : 'none',
                        borderColor: selectedOverlay.style.borderColor,
                        opacity: selectedOverlay.style.opacity,
                        transform: `translate(-50%, -50%) rotate(${selectedOverlay.style.rotation}deg)`,
                      }}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Drag the image in the preview area to position it
                </p>
              </TabsContent>
              
              <TabsContent value="timing" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Start Time: {selectedOverlay.startTime.toFixed(2)}s</Label>
                    <Slider
                      value={[selectedOverlay.startTime]}
                      min={0}
                      max={Math.min(selectedOverlay.endTime, duration)}
                      step={0.01}
                      onValueChange={(value) => handleTimingChange(value[0], selectedOverlay.endTime)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Time: {selectedOverlay.endTime.toFixed(2)}s</Label>
                    <Slider
                      value={[selectedOverlay.endTime]}
                      min={Math.max(selectedOverlay.startTime, 0.1)}
                      max={duration}
                      step={0.01}
                      onValueChange={(value) => handleTimingChange(selectedOverlay.startTime, value[0])}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTimingChange(currentTime, selectedOverlay.endTime)}
                    >
                      Set Start to Current
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTimingChange(selectedOverlay.startTime, currentTime)}
                    >
                      Set End to Current
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      ) : (
        <div className="text-center p-8 bg-muted rounded-lg">
          <Image className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="font-medium mb-1">No image overlays yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add images to overlay on your video
          </p>
          <Button onClick={handleAddImage}>
            <Plus className="h-4 w-4 mr-1" />
            Add Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageControls;