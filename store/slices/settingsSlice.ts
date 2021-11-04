import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Artist } from '../../types';

type SliceState = {
  allowNotifications: boolean
};

const initialState: SliceState = {
  allowNotifications: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialState,
  reducers: {
    setAllowNotifications(state, action: PayloadAction<boolean>) {
      state.allowNotifications = action.payload;
    },
  },
});

export const { setAllowNotifications } = settingsSlice.actions;

export default settingsSlice.reducer;
