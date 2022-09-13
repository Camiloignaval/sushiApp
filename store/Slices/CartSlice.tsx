import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ICartProduct } from "../../interfaces/cart";
import { ICoupon, IProduct, IShippingAdress } from "../../interfaces";

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  extraProduct: ICartProduct[];
  numberOfItems: number;
  coupon: ICoupon | undefined;
  note: string | undefined;
  subTotal: number;
  discount: number;
  tax: number;
  total: number;
  shippingAddress?: IShippingAdress;
}

const initialState: CartState = {
  isLoaded: false,
  cart: [],
  note: undefined,
  extraProduct: [],
  numberOfItems: 0,
  coupon: undefined,
  discount: 0,
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
    addOrUpdateExtraProducts: (
      state,
      action: PayloadAction<ICartProduct[]>
    ) => {
      state.extraProduct = action.payload;
    },
    // udpateCartQuantity: (state, action: PayloadAction<ICartProduct>) => {
    //   state.cart = state.cart.map((p) => {
    //     if (p._id !== action.payload._id) return p;
    //     if (p.size !== action.payload.size) return p;
    //     return action.payload;
    //   });
    // },
    removeFromCart: (state, action: PayloadAction<String>) => {
      state.cart = state.cart.filter((p) => !(p._id === action.payload));
    },
    updateSummary: (
      state,
      action: PayloadAction<{
        numberOfItems: number;
        subTotal: number;
        total: number;
        discount: number;
      }>
    ) => {
      (state.numberOfItems = action.payload.numberOfItems),
        (state.subTotal = action.payload.subTotal),
        (state.discount = action.payload.discount),
        (state.total = action.payload.total);
    },
    updateAdress: (state, action: PayloadAction<IShippingAdress>) => {
      state.shippingAddress = action.payload;
    },
    addCoupon: (state, action: PayloadAction<any>) => {
      state.coupon = action.payload;
    },
    removeCoupon: (state) => {
      state.coupon = undefined;
    },
    cleanCart: (state) => {
      state.isLoaded = false;
      state.cart = [];
      state.note = undefined;
      state.extraProduct = [];
      state.numberOfItems = 0;
      state.coupon = undefined;
      state.discount = 0;
      state.subTotal = 0;
      state.tax = 0;
      state.total = 0;
      state.shippingAddress = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addOrUpdateCart,
  // udpateCartQuantity,
  addOrUpdateExtraProducts,
  removeFromCart,
  updateSummary,
  updateAdress,
  cleanCart,
  addCoupon,
  removeCoupon,
} = CartSlice.actions;

export default CartSlice.reducer;
