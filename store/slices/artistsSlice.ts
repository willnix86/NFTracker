import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Artist } from '../../types';

type SliceState = {
  artists: Artist[]
};

const initialState: SliceState = {
  artists: [],
};

const artistsSlice = createSlice({
  name: 'artists',
  initialState: initialState,
  reducers: {
    setArtists(state, action: PayloadAction<Artist[]>) {
      state.artists = action.payload;
    },
  },
});

export const { setArtists } = artistsSlice.actions;

export default artistsSlice.reducer;
