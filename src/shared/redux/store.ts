import { configureStore } from "@reduxjs/toolkit";
import albumReducer from "./slices/albumSlice";
import photoReducer from "./slices/photoSlice";

export const store = configureStore({
  reducer: {
    albums: albumReducer,
    photos: photoReducer,
  },
});
