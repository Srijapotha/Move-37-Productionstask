import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ImageOverlay {
  id: string;
  file?: File;
  url: string;
  startTime: number;
  endTime: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    opacity: number;
    borderRadius: number;
    borderWidth: number;
    borderColor: string;
    rotation: number;
  };
}

export interface ImageState {
  overlays: ImageOverlay[];
  selectedOverlayId: string | null;
}

const initialState: ImageState = {
  overlays: [],
  selectedOverlayId: null,
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    addImageOverlay: (state, action: PayloadAction<Omit<ImageOverlay, "id">>) => {
      const id = `image-${Date.now()}`;
      state.overlays.push({ ...action.payload, id });
      state.selectedOverlayId = id;
    },
    removeImageOverlay: (state, action: PayloadAction<string>) => {
      state.overlays = state.overlays.filter(overlay => overlay.id !== action.payload);
      if (state.selectedOverlayId === action.payload) {
        state.selectedOverlayId = null;
      }
    },
    updateImageOverlay: (state, action: PayloadAction<{ id: string, changes: Partial<ImageOverlay> }>) => {
      const overlay = state.overlays.find(overlay => overlay.id === action.payload.id);
      if (overlay) {
        Object.assign(overlay, action.payload.changes);
      }
    },
    updateImagePosition: (state, action: PayloadAction<{ id: string, position: { x: number; y: number } }>) => {
      const overlay = state.overlays.find(overlay => overlay.id === action.payload.id);
      if (overlay) {
        overlay.position = action.payload.position;
      }
    },
    updateImageSize: (state, action: PayloadAction<{ id: string, size: { width: number; height: number } }>) => {
      const overlay = state.overlays.find(overlay => overlay.id === action.payload.id);
      if (overlay) {
        overlay.size = action.payload.size;
      }
    },
    updateImageStyle: (state, action: PayloadAction<{ id: string, style: Partial<ImageOverlay["style"]> }>) => {
      const overlay = state.overlays.find(overlay => overlay.id === action.payload.id);
      if (overlay) {
        overlay.style = { ...overlay.style, ...action.payload.style };
      }
    },
    updateImageTiming: (state, action: PayloadAction<{ id: string, startTime: number, endTime: number }>) => {
      const overlay = state.overlays.find(overlay => overlay.id === action.payload.id);
      if (overlay) {
        overlay.startTime = action.payload.startTime;
        overlay.endTime = action.payload.endTime;
      }
    },
    setSelectedImageOverlay: (state, action: PayloadAction<string | null>) => {
      state.selectedOverlayId = action.payload;
    },
    resetImage: (state) => {
      state.overlays.forEach(overlay => {
        if (overlay.url && overlay.file) {
          URL.revokeObjectURL(overlay.url);
        }
      });
      return initialState;
    },
  },
});

export const {
  addImageOverlay,
  removeImageOverlay,
  updateImageOverlay,
  updateImagePosition,
  updateImageSize,
  updateImageStyle,
  updateImageTiming,
  setSelectedImageOverlay,
  resetImage,
} = imageSlice.actions;

export default imageSlice.reducer;