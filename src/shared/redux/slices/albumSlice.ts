import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Album } from "@/domain/types";
import albumService from "@/services/albumService";

interface AlbumState {
  albums: Album[];
  loading: boolean;
  error: string | null;
}

const initialState: AlbumState = {
  albums: [],
  loading: false,
  error: null,
};

export const fetchAlbumsByUserId = createAsyncThunk(
  "albums/fetchByUserId",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await albumService.getAlbumsByUserId(userId);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const albumSlice = createSlice({
  name: "albums",
  initialState,
  reducers: {
    addAlbum(state, action: PayloadAction<Album>) {
      state.albums.push(action.payload);
    },
    clearAlbums(state) {
      state.albums = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbumsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAlbumsByUserId.fulfilled,
        (state, action: PayloadAction<Album[]>) => {
          state.loading = false;
          state.albums = action.payload;
        }
      )
      .addCase(fetchAlbumsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addAlbum, clearAlbums } = albumSlice.actions;

export default albumSlice.reducer;
