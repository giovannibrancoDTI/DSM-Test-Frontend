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
  "albums/fetchAlbumsByUserId",
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

export const createAlbum = createAsyncThunk(
  "albums/createAlbum",
  async (
    { userId, title }: { userId: number; title: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await albumService.createAlbum(userId, title);
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
    clearAlbums(state) {
      state.albums = [];
    },
    addAlbum(state, action: PayloadAction<Album>) {
      state.albums.push(action.payload);
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
          const fetchedAlbums = action.payload;
          const existingIds = new Set(state.albums.map((album) => album.id));
          const newAlbums = fetchedAlbums.filter(
            (album) => !existingIds.has(album.id)
          );
          state.albums = [...state.albums, ...newAlbums];
        }
      )
      .addCase(fetchAlbumsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createAlbum.fulfilled, (state, action: PayloadAction<Album>) => {
        state.albums.push(action.payload);
      });
  },
});

export const { addAlbum, clearAlbums } = albumSlice.actions;

export default albumSlice.reducer;
