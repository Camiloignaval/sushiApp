import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import { ICoupon, IProduct } from "../../interfaces";
import { addCoupon } from "../Slices/CartSlice";

interface IResponse {
  data?: {
    message: string;
    cupon?: ICoupon;
    error?: object;
  };
  cupon?: ICoupon;
}

// Define a service using a base URL and expected endpoints
export const couponApi = createApi({
  reducerPath: "couponApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Coupon"],
  endpoints: (builder) => ({
    validateCoupon: builder.mutation<
      IResponse,
      { code: string; amount: number }
    >({
      query: (data) => ({
        url: `/coupon?c=${data.code}&a=${data.amount}`,
        method: "post",
      }),
      onQueryStarted(data, { queryFulfilled, dispatch }) {
        queryFulfilled.then(({ data }) => {
          dispatch(addCoupon(data.cupon!));
        });
        toast.promise(queryFulfilled, {
          loading: "Validando cupón...",
          success: "Cupón cargado",
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
    // updateProduct: builder.mutation<IProduct[], any>({
    //   query: (body) => ({
    //     url: `/admin/products`,
    //     method: body._id ? "put" : "post",
    //     body,
    //   }),
    //   invalidatesTags: ["Products"],
    //   onQueryStarted(data, { queryFulfilled }) {
    //     toast.promise(queryFulfilled, {
    //       loading: data._id
    //         ? "Actualizando producto..."
    //         : "Creando producto...",
    //       success: data._id
    //         ? "Actualizado con éxito"
    //         : "Producto creado con éxito",
    //       error: ({ error }) => error.data.message.toString(),
    //     });
    //   },
    // }),
  }),
});

export const { useValidateCouponMutation } = couponApi;
