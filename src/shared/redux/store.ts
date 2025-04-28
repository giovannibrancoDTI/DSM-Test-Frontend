import { configureStore } from "@reduxjs/toolkit";
import albumReducer from "./slices/albumSlice";
import photoReducer from "./slices/photoSlice";

export const store = configureStore({
  reducer: {
    albums: albumReducer,
    photos: photoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
