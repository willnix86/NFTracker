import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Artist } from '../../types';

type SliceState = {
  artists: Artist[],
  newDropAccounts: string[],
};

const initialState: SliceState = {
  artists: [],
  newDropAccounts: ['0xdcd49761c86547a18936cdcb46eb3cd65a34e617'],
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
