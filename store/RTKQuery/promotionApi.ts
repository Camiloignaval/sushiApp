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
  reducerPath: "promotionApi",
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
    updatePromotion: builder.mutation<IPromotion[], any>({
      query: (body) => ({
        url: `/admin/promotions`,
        method: body._id ? "put" : "post",
        body,
      }),
      invalidatesTags: ["Promotions"],
      onQueryStarted(data, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: data._id
            ? "Actualizando promoción..."
            : "Creando promoción...",
          success: data._id
            ? "Actualizado con éxito"
            : "promoción creada con éxito",
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
    deletePromotion: builder.mutation<IResponse, string>({
      query: (body) => ({
        url: `/admin/promotions`,
        method: "delete",
        body,
      }),
      invalidatesTags: ["Promotions"],
      onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Eliminando promoción...",
          success: "Eliminada con éxito",
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
    updatePromotionByProperty: builder.mutation<
      IPromotion[],
      { id: string; category: string; value: string | boolean | number }
    >({
      query: (body) => ({
        url: `/admin/promotion`,
        method: "put",
        body: body,
      }),
      invalidatesTags: ["Promotions"],
      onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Actualizando promoción...",
          success: `Promoción actualizado con éxito`,
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
    deleteImportanceNumber: builder.mutation<IPromotion[], { id: string }>({
      query: (body) => ({
        url: `/admin/promotion`,
        method: "delete",
        body: body,
      }),
      invalidatesTags: ["Promotions"],
      onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Eliminando  importancia...",
          success: `Promoción actualizado con éxito`,
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
  }),
});

export const {
  useGetAllPromotionsQuery,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
  useUpdatePromotionByPropertyMutation,
  useDeleteImportanceNumberMutation,
} = promotionApi;
