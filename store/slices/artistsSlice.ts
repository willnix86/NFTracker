import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Artist } from '../../types';

type SliceState = {
  artists: Artist[],
  newDropAccounts: string[],
};

const initialState: SliceState = {
  artists: [],
  newDropAccounts: [],
};

const artistsSlice = createSlice({
  name: 'artists',
  initialState: initialState,
  reducers: {
    setArtists(state, action: PayloadAction<Artist[]>) {
      state.artists = action.payload;
    },
    setNewDrops(state, action: PayloadAction<string[]>) {
      state.newDropAccounts = action.payload;
    },
  },
});

export const { setArtists, setNewDrops } = artistsSlice.actions;

export default artistsSlice.reducer;
