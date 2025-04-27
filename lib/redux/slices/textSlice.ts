import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TextOverlay {
  id: string;
  content: string;
  startTime: number;
  endTime: number;
  position: { x: number; y: number };
  style: {
    fontFamily: string;
    fontSize: number;
    color: string;
    backgroundColor: string;
    opacity: number;
    isBold: boolean;
    isItalic: boolean;
  };
  isSubtitle: boolean;
}

export interface TextState {
  overlays: TextOverlay[];
  selectedOverlayId: string | null;
}

const initialState: TextState = {
  overlays: [],
  selectedOverlayId: null,
};

const textSlice = createSlice({
  name: "text",
  initialState,
  reducers: {
    addTextOverlay: (state, action: PayloadAction<Omit<TextOverlay, "id">>) => {
      const id = `text-${Date.now()}`;
      state.overlays.push({ ...action.payload, id });
      state.selectedOverlayId = id;
    },
    removeTextOverlay: (state, action: PayloadAction<string>) => {
      state.overlays = state.overlays.filter(overlay => overlay.id !== action.payload);
      if (state.selectedOverlayId === action.payload) {
        state.selectedOverlayId = null;
      }
    },
    updateTextOverlay: (state, action: PayloadAction<{ id: string, changes: Partial<TextOverlay> }>) => {
      const overlay = state.overlays.find(overlay => overlay.id === action.payload.id);
      if (overlay) {
        Object.assign(overlay, action.payload.changes);
      }
    },
    updateTextContent: (state, action: PayloadAction<{ id: string, content: string }>) => {
      const overlay = state.overlays.find(overlay => overlay.id === action.payload.id);
      if (overlay) {
        overlay.content = action.payload.content;
      }
    },
    updateTextPosition: (state, action: PayloadAction<{ id: string, position: { x: number; y: number } }>) => {
      const overlay = state.overlays.find(overlay => overlay.id === action.payload.id);
      if (overlay) {
        overlay.position = action.payload.position;
      }
    },
    updateTextStyle: (state, action: PayloadAction<{ id: string, style: Partial<TextOverlay["style"]> }>) => {
      const overlay = state.overlays.find(overlay => overlay.id === action.payload.id);
      if (overlay) {
        overlay.style = { ...overlay.style, ...action.payload.style };
      }
    },
    updateTextTiming: (state, action: PayloadAction<{ id: string, startTime: number, endTime: number }>) => {
      const overlay = state.overlays.find(overlay => overlay.id === action.payload.id);
      if (overlay) {
        overlay.startTime = action.payload.startTime;
        overlay.endTime = action.payload.endTime;
      }
    },
    setSelectedOverlay: (state, action: PayloadAction<string | null>) => {
      state.selectedOverlayId = action.payload;
    },
    resetText: () => initialState,
  },
});

export const {
  addTextOverlay,
  removeTextOverlay,
  updateTextOverlay,
  updateTextContent,
  updateTextPosition,
  updateTextStyle,
  updateTextTiming,
  setSelectedOverlay,
  resetText,
} = textSlice.actions;

export default textSlice.reducer;