import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
  sideBarIsOpen: boolean;
  scrollIsDown: boolean;
}

const initialState: UIState = {
  sideBarIsOpen: false,
  scrollIsDown: false,
};

export const UISlice = createSlice({
  name: "UI",
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.sideBarIsOpen = !state.sideBarIsOpen;
    },
    activeScrollDown: (state) => {
      state.scrollIsDown = true;
    },
    desactiveScrollDown: (state) => {
      state.scrollIsDown = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleMenu, activeScrollDown, desactiveScrollDown } =
  UISlice.actions;

export default UISlice.reducer;
