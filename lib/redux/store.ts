import { configureStore } from "@reduxjs/toolkit";
import videoReducer from "./slices/videoSlice";
import timelineReducer from "./slices/timelineSlice";
import audioReducer from "./slices/audioSlice";
import textReducer from "./slices/textSlice";
import imageReducer from "./slices/imageSlice";

export const store = configureStore({
  reducer: {
    video: videoReducer,
    timeline: timelineReducer,
    audio: audioReducer,
    text: textReducer,
    image: imageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;