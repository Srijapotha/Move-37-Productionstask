import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface VideoState {
  videoFile: File | null;
  videoUrl: string | null;
  uploadProgress: number;
  isUploading: boolean;
  duration: number;
  isPlaying: boolean;
  currentTime: number;
}

const initialState: VideoState = {
  videoFile: null,
  videoUrl: null,
  uploadProgress: 0,
  isUploading: false,
  duration: 0,
  isPlaying: false,
  currentTime: 0,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideoFile: (state, action: PayloadAction<File | null>) => {
      state.videoFile = action.payload;
      if (state.videoFile) {
        state.videoUrl = URL.createObjectURL(action.payload as File);
        state.isUploading = true;
        state.uploadProgress = 0;
      } else {
        state.videoUrl = null;
        state.isUploading = false;
        state.uploadProgress = 0;
      }
    },
    updateUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
      if (state.uploadProgress >= 100) {
        state.isUploading = false;
      }
    },
    setVideoDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    togglePlayback: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    resetVideo: (state) => {
      if (state.videoUrl) {
        URL.revokeObjectURL(state.videoUrl);
      }
      return initialState;
    }
  },
});

export const {
  setVideoFile,
  updateUploadProgress,
  setVideoDuration,
  togglePlayback,
  setCurrentTime,
  resetVideo,
} = videoSlice.actions;

export default videoSlice.reducer;