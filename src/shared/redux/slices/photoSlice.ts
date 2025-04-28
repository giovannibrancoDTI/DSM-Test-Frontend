import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Photo } from "@/domain/types";
import photoService from "@/services/photoService";

interface PhotoState {
  photos: Photo[];
  loading: boolean;
  error: string | null;
}

const initialState: PhotoState = {
  photos: [],
  loading: false,
  error: null,
};

export const fetchPhotosByAlbumId = createAsyncThunk(
  "photos/fetchByAlbumId",
  async (albumId: number, { rejectWithValue }) => {
    try {
      const response = await photoService.getPhotosByAlbumId(albumId);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const photoSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    addPhoto(state, action: PayloadAction<Photo>) {
      state.photos.push(action.payload);
    },
    clearPhotos(state) {
      state.photos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotosByAlbumId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPhotosByAlbumId.fulfilled,
        (state, action: PayloadAction<Photo[]>) => {
          state.loading = false;
          state.photos = action.payload;
        }
      )
      .addCase(fetchPhotosByAlbumId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addPhoto, clearPhotos } = photoSlice.actions;

export default photoSlice.reducer;
