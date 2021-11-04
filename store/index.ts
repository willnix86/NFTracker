import { combineReducers, configureStore, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

import artistsReducer from './slices/artistsSlice';
import settingsReducer from './slices/settingsSlice';

const rootReducer = combineReducers({
  artistsReducer,
  settingsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default configureStore({
  reducer: rootReducer,
});

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
