"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { 
  addTextOverlay, 
  removeTextOverlay, 
  updateTextContent,
  updateTextStyle,
  updateTextTiming,
  TextOverlay
} from "@/lib/redux/slices/textSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bold, 
  Italic, 
  AlignCenter, 
  Clock, 
  Type, 
  Plus, 
  Trash
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const TextControls = () => {
  const dispatch = useAppDispatch();
  const { overlays, selectedOverlayId } = useAppSelector((state) => state.text);
  const { duration, currentTime } = useAppSelector((state) => state.video);
  const selectedOverlay = overlays.find(overlay => overlay.id === selectedOverlayId);
  
  const [activeTab, setActiveTab] = useState("content");

  const handleAddSubtitle = () => {
    dispatch(addTextOverlay({
      content: "New subtitle",
      startTime: Math.max(0, currentTime - 0.5),
      endTime: Math.min(duration, currentTime + 2.5),
      position: { x: 0.5, y: 0.9 },
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#FFFFFF",
        backgroundColor: "#00000080",
        opacity: 1,
        isBold: false,
        isItalic: false,
      },
      isSubtitle: true,
    }));
  };

  const handleAddTextOverlay = () => {
    dispatch(addTextOverlay({
      content: "Text overlay",
      startTime: Math.max(0, currentTime - 0.5),
      endTime: Math.min(duration, currentTime + 2.5),
      position: { x: 0.5, y: 0.5 },
      style: {
        fontFamily: "Arial",
        fontSize: 32,
        color: "#FFFFFF",
        backgroundColor: "transparent",
        opacity: 1,
        isBold: true,
        isItalic: false,
      },
      isSubtitle: false,
    }));
  };

  const handleDeleteOverlay = () => {
    if (selectedOverlayId) {
      dispatch(removeTextOverlay(selectedOverlayId));
    }
  };

  const handleContentChange = (content: string) => {
    if (selectedOverlayId) {
      dispatch(updateTextContent({
        id: selectedOverlayId,
        content,
      }));
    }
  };

  const handleStyleChange = (style: Partial<TextOverlay["style"]>) => {
    if (selectedOverlayId) {
      dispatch(updateTextStyle({
        id: selectedOverlayId,
        style,
      }));
    }
  };

  const handleTimingChange = (startTime: number, endTime: number) => {
    if (selectedOverlayId) {
      dispatch(updateTextTiming({
        id: selectedOverlayId,
        startTime,
        endTime,
      }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Text & Subtitles</h3>
        <div className="space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddSubtitle}
          >
            <Plus className="h-4 w-4 mr-1" />
            Subtitle
          </Button>
          <Button
            size="sm"
            onClick={handleAddTextOverlay}
          >
            <Plus className="h-4 w-4 mr-1" />
            Text
          </Button>
        </div>
      </div>

      {overlays.length > 0 ? (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Label>Text overlay:</Label>
            <Select
              value={selectedOverlayId || ""}
              onValueChange={(value) => dispatch({ type: "text/setSelectedOverlay", payload: value })}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select text overlay" />
              </SelectTrigger>
              <SelectContent>
                {overlays.map(overlay => (
                  <SelectItem key={overlay.id} value={overlay.id}>
                    {overlay.isSubtitle ? "Subtitle: " : "Text: "}
                    {overlay.content.substring(0, 20)}
                    {overlay.content.length > 20 ? "..." : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedOverlayId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteOverlay}
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>

          {selectedOverlay && (
            <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="content">
                  <Type className="h-4 w-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="style">
                  <AlignCenter className="h-4 w-4 mr-2" />
                  Style
                </TabsTrigger>
                <TabsTrigger value="timing">
                  <Clock className="h-4 w-4 mr-2" />
                  Timing
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4">
                <Textarea
                  placeholder="Enter text content"
                  value={selectedOverlay.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  rows={3}
                />
              </TabsContent>
              
              <TabsContent value="style" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Font</Label>
                    <Select
                      value={selectedOverlay.style.fontFamily}
                      onValueChange={(value) => handleStyleChange({ fontFamily: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Courier New">Courier New</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Size: {selectedOverlay.style.fontSize}px</Label>
                    <Slider
                      value={[selectedOverlay.style.fontSize]}
                      min={12}
                      max={72}
                      step={1}
                      onValueChange={(value) => handleStyleChange({ fontSize: value[0] })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <div className="border rounded w-10 h-10" style={{ backgroundColor: selectedOverlay.style.color }} />
                      <Input
                        type="color"
                        value={selectedOverlay.style.color}
                        onChange={(e) => handleStyleChange({ color: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <div className="border rounded w-10 h-10" style={{ backgroundColor: selectedOverlay.style.backgroundColor }} />
                      <Input
                        type="color"
                        value={selectedOverlay.style.backgroundColor}
                        onChange={(e) => handleStyleChange({ backgroundColor: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedOverlay.style.isBold}
                        onCheckedChange={(checked) => handleStyleChange({ isBold: checked })}
                      />
                      <Label><Bold className="h-4 w-4" /></Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedOverlay.style.isItalic}
                        onCheckedChange={(checked) => handleStyleChange({ isItalic: checked })}
                      />
                      <Label><Italic className="h-4 w-4" /></Label>
                    </div>
                  </div>
                  
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
                </div>
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
          <Type className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="font-medium mb-1">No text overlays yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add subtitles or text overlays to your video
          </p>
          <div className="flex justify-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddSubtitle}
            >
              <Plus className="h-4 w-4 mr-1" />
              Subtitle
            </Button>
            <Button
              size="sm"
              onClick={handleAddTextOverlay}
            >
              <Plus className="h-4 w-4 mr-1" />
              Text
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextControls;