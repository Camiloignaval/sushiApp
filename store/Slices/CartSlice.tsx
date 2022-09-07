import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ICartProduct } from "../../interfaces/cart";
import { IProduct, IShippingAdress, ISize } from "../../interfaces";

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: IShippingAdress;
}

const initialState: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

export const CartSlice = createSlice({
  name: "Cart",
  initialState,
  reducers: {
    addOrUpdateCart: (state, action: PayloadAction<ICartProduct[]>) => {
      state.cart = action.payload;
      state.isLoaded = true;
    },
    udpateCartQuantity: (state, action: PayloadAction<ICartProduct>) => {
      state.cart = state.cart.map((p) => {
        if (p._id !== action.payload._id) return p;
        if (p.size !== action.payload.size) return p;
        return action.payload;
      });
    },
    removeFromCart: (state, action: PayloadAction<ICartProduct>) => {
      state.cart = state.cart.filter(
        (p) => !(p._id === action.payload._id && p.size === action.payload.size)
      );
    },
    updateSummary: (
      state,
      action: PayloadAction<{
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      }>
    ) => {
      (state.numberOfItems = action.payload.numberOfItems),
        (state.subTotal = action.payload.subTotal),
        (state.tax = action.payload.tax),
        (state.total = action.payload.total);
    },
    updateAdress: (state, action: PayloadAction<IShippingAdress>) => {
      state.shippingAddress = action.payload;
    },
    cleanCart: (state) => {
      state.cart = [];
      state.numberOfItems = 0;
      state.subTotal = 0;
      state.tax = 0;
      state.total = 0;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addOrUpdateCart,
  udpateCartQuantity,
  removeFromCart,
  updateSummary,
  updateAdress,
  cleanCart,
} = CartSlice.actions;

export default CartSlice.reducer;
