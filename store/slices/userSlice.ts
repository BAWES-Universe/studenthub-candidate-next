import { Candidate } from '@/models/candidate';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: Candidate | null;
  isProfileCompleted: boolean;
  invitationCount: number;
}

const initialState: UserState = {
  user: null,
  isProfileCompleted: false,
  invitationCount: 0
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: any }>) => {
      state.user = action.payload.user;
    },
    setIsProfileCompleted: (state, action: PayloadAction<{ isProfileCompleted: boolean }>) => {
      state.isProfileCompleted = action.payload.isProfileCompleted;
    },
    setInvitationCount: (state, action: PayloadAction<{ invitationCount: number }>) => {
      state.invitationCount = action.payload.invitationCount;
    },
  },
});

export const { setUser, setIsProfileCompleted, setInvitationCount } = userSlice.actions;
export default userSlice.reducer;