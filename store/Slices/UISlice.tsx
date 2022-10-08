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
  filters: {
    status: [string] | [];
    startDate: string | null;
    endDate: string | null;
    phoneToFind: string;
  };
}

const initialState: UIState = {
  sideBarIsOpen: false,
  scrollIsDown: false,
  store: {
    isOpen: true,
    type: "open",
  },
  filters: {
    status: [],
    startDate: null,
    endDate: null,
    phoneToFind: "",
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

    setFilters: (
      state,
      action: PayloadAction<{
        status: [string] | [];
        startDate: string | null;
        endDate: string | null;
        phoneToFind: string;
      }>
    ) => {
      console.log({ actionn: action.payload });
      state.filters = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  toggleMenu,
  activeScrollDown,
  desactiveScrollDown,
  storeState,
  setFilters,
} = UISlice.actions;

export default UISlice.reducer;
