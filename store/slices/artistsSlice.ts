import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnyObject } from '../../types';

type SliceState = {
  artists: AnyObject[]
};

const initialState: SliceState = {
  artists: [],
};

const artistsSlice = createSlice({
  name: 'artists',
  initialState: initialState,
  reducers: {
    setArtists(state, action: PayloadAction<AnyObject[]>) {
      state.artists = action.payload;
    },
  },
});

export const { setArtists } = artistsSlice.actions;

export default artistsSlice.reducer;
