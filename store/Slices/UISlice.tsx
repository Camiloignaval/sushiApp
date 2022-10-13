import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type storeOpen = "close" | "soon" | "open";

export interface UIState {
  sideBarIsOpen: boolean;
  scrollIsDown: boolean;
  newNotifications: number;
  ordersviews: number | null;
  actualOrders: number;
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
  newNotifications: 0,
  ordersviews: null,
  actualOrders: 0,
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
      state.filters = action.payload;
    },
    changeTotalOrders: (state, action: PayloadAction<number>) => {
      state.actualOrders = action.payload;
    },
    changeordersViews: (state, action: PayloadAction<number>) => {
      state.ordersviews = action.payload;
    },
    changeNewNotifications: (state, action: PayloadAction<number>) => {
      state.newNotifications = action.payload;
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
  changeNewNotifications,
  changeTotalOrders,
  changeordersViews,
} = UISlice.actions;

export default UISlice.reducer;
