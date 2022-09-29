import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import { ICoupon, IProduct, ISettingsStore } from "../../interfaces";
import { addCoupon } from "../Slices/CartSlice";

interface IResponse {
  data?: {
    message: string;
    cupon?: ICoupon;
    error?: object;
  };
  settings?: ISettingsStore;
}

// Define a service using a base URL and expected endpoints
export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Settings"],
  endpoints: (builder) => ({
    getSettingsStore: builder.query<ISettingsStore, void>({
      query: (body) => ({
        url: `/admin/settings`,
        method: "get",
        body,
      }),
      onQueryStarted(data, { queryFulfilled }) {
        queryFulfilled.catch(() => {
          toast.error("Ha ocurrido un error obteniendo configuraciones");
        });
      },
    }),
    updateConfig: builder.mutation<IResponse, ISettingsStore>({
      query: (body) => ({
        url: `/admin/settings`,
        method: "put",
        body,
      }),
      onQueryStarted(data, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Guardando configuración...",
          success: "Configuración guardada",
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
    // updateCoupon: builder.mutation<ICoupon, ICoupon>({
    //   query: (body) => ({
    //     url: `/admin/coupons`,
    //     method: body._id ? "put" : "post",
    //     body,
    //   }),
    //   invalidatesTags: ["Coupons"],
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

export const { useUpdateConfigMutation, useGetSettingsStoreQuery } =
  settingsApi;
