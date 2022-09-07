import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../interfaces";

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

export const UISlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    LogIn: (state, action: PayloadAction<IUser>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    LogOut: (state) => {
      state.isLoggedIn = false;
      state.user = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const { LogIn, LogOut } = UISlice.actions;

export default UISlice.reducer;
