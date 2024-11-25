import { Candidate } from '@/models/candidate';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: Candidate | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: any }>) => {
      state.user = action.payload.user;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;