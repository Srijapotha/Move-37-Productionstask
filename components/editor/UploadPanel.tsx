"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setVideoFile, updateUploadProgress } from "@/lib/redux/slices/videoSlice";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileVideo, X } from "lucide-react";
import { toast } from "sonner";

const UploadPanel = () => {
  const dispatch = useAppDispatch();
  const { isUploading, uploadProgress } = useAppSelector((state) => state.video);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) return;
    
    // Check if it's a video file
    if (!file.type.startsWith("video/")) {
      toast.error("Please upload a video file");
      return;
    }
    
    // Set the file in Redux
    dispatch(setVideoFile(file));
    
    // Simulate upload progress
    const interval = setInterval(() => {
      dispatch(updateUploadProgress(Math.min(uploadProgress + 10, 100)));
      
      if (uploadProgress + 10 >= 100) {
        clearInterval(interval);
        toast.success("Video uploaded successfully");
      }
    }, 300);
  }, [dispatch, uploadProgress]);
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.webm', '.mov', '.avi']
    },
    maxFiles: 1,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });
  
  const cancelUpload = () => {
    dispatch(setVideoFile(null));
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-2xl">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-12 transition-colors 
            flex flex-col items-center space-y-4 cursor-pointer
            ${dragActive 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50 hover:bg-muted"
            }
          `}
        >
          <input {...getInputProps()} />
          
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <FileVideo className="h-8 w-8 text-primary" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Drag & drop your video</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Upload MP4, WebM, or MOV files up to 1GB
            </p>
          </div>
          
          <Button variant="outline" className="mt-4">
            <Upload className="mr-2 h-4 w-4" />
            Select Video
          </Button>
        </div>
        
        {isUploading && (
          <div className="mt-8 bg-card p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Uploading video...</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={cancelUpload}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Progress value={uploadProgress} className="h-2 mb-2" />
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{Math.round(uploadProgress)}%</span>
              <span>
                {uploadProgress < 100 ? "Uploading..." : "Processing..."}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPanel;