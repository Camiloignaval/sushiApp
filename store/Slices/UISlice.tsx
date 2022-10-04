import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type storeOpen = "close" | "soon" | "open";

export interface UIState {
  sideBarIsOpen: boolean;
  scrollIsDown: boolean;
  store: {
    isOpen: boolean;
    type: storeOpen;
  };
}

const initialState: UIState = {
  sideBarIsOpen: false,
  scrollIsDown: false,
  store: {
    isOpen: true,
    type: "open",
  },
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
    storeState: (
      state,
      action: PayloadAction<{ type: storeOpen; isOpen: boolean }>
    ) => {
      state.store = action.payload;
    },
    // closeStore: (state) => {
    //   state.store = {
    //     isOpen: false,
    //     type: "close",
    //   };
    // },
    // openSoon: (state) => {
    //   state.store = {
    //     isOpen: false,
    //     type: "soon",
    //   };
    // },
  },
});

// Action creators are generated for each case reducer function
export const { toggleMenu, activeScrollDown, desactiveScrollDown, storeState } =
  UISlice.actions;

export default UISlice.reducer;
