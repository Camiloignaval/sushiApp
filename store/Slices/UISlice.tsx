import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
  sideBarIsOpen: boolean;
  scrollIsDown: boolean;
  storeIsOpen: boolean;
}

const initialState: UIState = {
  sideBarIsOpen: false,
  scrollIsDown: false,
  storeIsOpen: false,
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
    openStore: (state) => {
      state.storeIsOpen = true;
    },
    closeStore: (state) => {
      state.storeIsOpen = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  toggleMenu,
  activeScrollDown,
  desactiveScrollDown,
  openStore,
  closeStore,
} = UISlice.actions;

export default UISlice.reducer;
