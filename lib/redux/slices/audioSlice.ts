import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AudioTrack {
  id: string;
  name: string;
  type: "main" | "background" | "voiceover";
  volume: number;
  isMuted: boolean;
  file?: File;
  url?: string;
}

export interface AudioState {
  tracks: AudioTrack[];
  selectedTrackId: string | null;
}

const initialState: AudioState = {
  tracks: [
    {
      id: "main-audio",
      name: "Main Audio",
      type: "main",
      volume: 1,
      isMuted: false,
    },
  ],
  selectedTrackId: null,
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    addAudioTrack: (state, action: PayloadAction<Omit<AudioTrack, "id">>) => {
      const id = `audio-${Date.now()}`;
      state.tracks.push({ ...action.payload, id });
    },
    removeAudioTrack: (state, action: PayloadAction<string>) => {
      state.tracks = state.tracks.filter(track => track.id !== action.payload);
    },
    updateAudioTrack: (state, action: PayloadAction<{ id: string, changes: Partial<AudioTrack> }>) => {
      const track = state.tracks.find(track => track.id === action.payload.id);
      if (track) {
        Object.assign(track, action.payload.changes);
      }
    },
    setAudioFile: (state, action: PayloadAction<{ id: string, file: File }>) => {
      const track = state.tracks.find(track => track.id === action.payload.id);
      if (track) {
        if (track.url) {
          URL.revokeObjectURL(track.url);
        }
        track.file = action.payload.file;
        track.url = URL.createObjectURL(action.payload.file);
      }
    },
    toggleMute: (state, action: PayloadAction<string>) => {
      const track = state.tracks.find(track => track.id === action.payload);
      if (track) {
        track.isMuted = !track.isMuted;
      }
    },
    setVolume: (state, action: PayloadAction<{ id: string, volume: number }>) => {
      const track = state.tracks.find(track => track.id === action.payload.id);
      if (track) {
        track.volume = action.payload.volume;
      }
    },
    setSelectedTrack: (state, action: PayloadAction<string | null>) => {
      state.selectedTrackId = action.payload;
    },
    resetAudio: (state) => {
      state.tracks.forEach(track => {
        if (track.url && track.type !== "main") {
          URL.revokeObjectURL(track.url);
        }
      });
      return initialState;
    },
  },
});

export const {
  addAudioTrack,
  removeAudioTrack,
  updateAudioTrack,
  setAudioFile,
  toggleMute,
  setVolume,
  setSelectedTrack,
  resetAudio,
} = audioSlice.actions;

export default audioSlice.reducer;