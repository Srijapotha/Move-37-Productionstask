import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Segment {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
}

export interface TimelineState {
  segments: Segment[];
  selectedSegmentId: string | null;
  zoom: number;
}

const initialState: TimelineState = {
  segments: [],
  selectedSegmentId: null,
  zoom: 1,
};

const timelineSlice = createSlice({
  name: "timeline",
  initialState,
  reducers: {
    initializeTimeline: (state, action: PayloadAction<number>) => {
      const duration = action.payload;
      state.segments = [{
        id: "segment-1",
        startTime: 0,
        endTime: duration,
        duration: duration,
      }];
    },
    addSegment: (state, action: PayloadAction<Segment>) => {
      state.segments.push(action.payload);
    },
    removeSegment: (state, action: PayloadAction<string>) => {
      state.segments = state.segments.filter(segment => segment.id !== action.payload);
    },
    updateSegment: (state, action: PayloadAction<{ id: string, changes: Partial<Segment> }>) => {
      const index = state.segments.findIndex(segment => segment.id === action.payload.id);
      if (index !== -1) {
        state.segments[index] = { ...state.segments[index], ...action.payload.changes };
      }
    },
    setSelectedSegment: (state, action: PayloadAction<string | null>) => {
      state.selectedSegmentId = action.payload;
    },
    reorderSegments: (state, action: PayloadAction<{ sourceIndex: number, destinationIndex: number }>) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const [removed] = state.segments.splice(sourceIndex, 1);
      state.segments.splice(destinationIndex, 0, removed);
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    resetTimeline: () => initialState,
  },
});

export const {
  initializeTimeline,
  addSegment,
  removeSegment,
  updateSegment,
  setSelectedSegment,
  reorderSegments,
  setZoom,
  resetTimeline,
} = timelineSlice.actions;

export default timelineSlice.reducer;