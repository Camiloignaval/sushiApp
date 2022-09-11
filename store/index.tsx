import { configureStore } from "@reduxjs/toolkit";
import UIReducer from "./Slices/UISlice";
import CartReducer from "./Slices/CartSlice";
import AuthReducer from "./Slices/AuthSlice";
import { authApi } from "./RTKQuery/authApi";
import { ordersApi } from "./RTKQuery/ordersApi";
import { adminApi } from "./RTKQuery/adminApi";
import { productsApi } from "./RTKQuery/productsApi";
import { uploadApi } from "./RTKQuery/uploadApi";
import { promotionApi } from "./RTKQuery/promotionApi";
import { couponApi } from "./RTKQuery/couponApi";

const apisMiddlewares = [
  authApi.middleware,
  ordersApi.middleware,
  adminApi.middleware,
  productsApi.middleware,
  uploadApi.middleware,
  promotionApi.middleware,
  couponApi.middleware,
];

export const store = configureStore({
  reducer: {
    ui: UIReducer,
    cart: CartReducer,
    auth: AuthReducer,
    [authApi.reducerPath]: authApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [promotionApi.reducerPath]: promotionApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apisMiddlewares),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
