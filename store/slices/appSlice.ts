import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mixpanel from "mixpanel-browser";

interface AppState {
  language: string;
  mixpanel_distinct_id: string | null;
}

const initialState: AppState = {
  language: "ar",
  mixpanel_distinct_id: mixpanel.get_distinct_id(),
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<{ language: string }>) => {
      state.language = action.payload.language;
    },
  },
});

export const { setLanguage } = appSlice.actions;
export default appSlice.reducer;