import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import { IOrder, IPromotion } from "../../interfaces";
import { useRouter } from "next/router";

interface IResponse {
  data: {
    message: string;
    error?: object;
  };
}

// Define a service using a base URL and expected endpoints
export const promotionApi = createApi({
  reducerPath: "prpomotionApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Promotions", "Promotion"],
  endpoints: (builder) => ({
    getAllPromotions: builder.query<IPromotion[], null>({
      query: () => ({
        url: `/promotions`,
        method: "get",
      }),
      providesTags: ["Promotions"],
      onQueryStarted(_, { queryFulfilled }) {
        queryFulfilled.catch(() => {
          toast.error("Ha ocurrido un error al obtener promociones");
        });
      },
    }),
    // getOrder: builder.query<IResponse, IOrder>({
    //   query: (orderId) => ({
    //     url: `/orders/${orderId}`,
    //     method: "get",
    //   }),
    //   onQueryStarted(_, { queryFulfilled }) {
    //     queryFulfilled.catch(() => {
    //       toast.error("Ha ocurrido un error al obtener orden");
    //     });
    //   },
    // }),
  }),
});

export const { useGetAllPromotionsQuery } = promotionApi;
