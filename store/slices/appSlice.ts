import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mixpanel from "mixpanel-browser";

interface AppState {
  language: string;
  mixpanel_distinct_id: string | null;
  temp_bucket: string;
  utm_uuid: string;
  currentLocation: any;
  showOneSignalPrompt: boolean,
  canGoForward: boolean
}

const initialState: AppState = {
  language: "ar",
  mixpanel_distinct_id: null,//mixpanel.get_distinct_id()
  temp_bucket: "studenthub-public-anyone-can-upload-24hr-expiry",
  utm_uuid: "",
  currentLocation: null,
  showOneSignalPrompt: true,
  canGoForward: false
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<{ language: string }>) => {
      state.language = action.payload.language;
    },
    setTempBucket: (state, action: PayloadAction<{ temp_bucket: string }>) => {
      state.temp_bucket = action.payload.temp_bucket;
    },
    setCampaignId: (state, action: PayloadAction<{ utm_uuid: string }>) => {
      state.utm_uuid = action.payload.utm_uuid;
    },
    setCurrentLocation: (state, action: PayloadAction<{ currentLocation: any }>) => {
      state.currentLocation = action.payload.currentLocation;
    },
    setShowOneSignalPrompt: (state, action: PayloadAction<{ showOneSignalPrompt: boolean }>) => {
      state.showOneSignalPrompt = action.payload.showOneSignalPrompt;
    },
    setCanGoForward: (state, action: PayloadAction<{ canGoForward: boolean }>) => {
      state.canGoForward = action.payload.canGoForward;
    },
  },
});

export const { setLanguage, setTempBucket, setCampaignId, setCurrentLocation, 
  setShowOneSignalPrompt, setCanGoForward } = appSlice.actions;
export default appSlice.reducer;