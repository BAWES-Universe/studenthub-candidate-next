import { userLogin$ } from '@/providers/event.service';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Dispatch } from 'redux';
//import { cookies } from 'next/headers';
import Cookies from 'js-cookie';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  unVerifiedToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  unVerifiedToken: null,
};

//const cookieStore = await cookies();
        
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    _setCredentials: (state, action: PayloadAction<{ token: string }>) =>  {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      /*cookies().then(cookieStore => {
        cookieStore.set('isAuthenticated', 'true');
      });*/

      Cookies.set('isAuthenticated', "1");
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      /*cookies().then(cookieStore => {
        cookieStore.delete('isAuthenticated');
      });*/

      Cookies.remove('isAuthenticated');
    },
    setUnVerifiedToken: (state, action: PayloadAction<{ token: string | null }>) => {
      state.unVerifiedToken = action.payload.token;
    },
  },
});

const { _setCredentials, logout, setUnVerifiedToken } = authSlice.actions;
export { logout, setUnVerifiedToken };

/**
 * Thunk that updates auth state first (via pure reducer), then emits the
 * userLogin$ event. This avoids the Redux Error #9 "Reducers may not dispatch
 * actions" that occurred when userLogin$.next() was called inside the reducer
 * body and its subscriber synchronously dispatched another action.
 */
export const setCredentials =
  (payload: { token: string }) =>
  (dispatch: Dispatch) => {
    dispatch(_setCredentials(payload));
    userLogin$.next({});
  };

export default authSlice.reducer;