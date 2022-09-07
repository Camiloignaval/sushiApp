import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import { IProduct } from "../../interfaces";

interface IResponse {
  data: {
    message: string;
    error?: object;
  };
}

// Define a service using a base URL and expected endpoints
export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getProducts: builder.query<IProduct[], null>({
      query: () => ({
        url: `/admin/products`,
        method: "get",
      }),
      providesTags: ["Products"],
      onQueryStarted(_, { queryFulfilled }) {
        queryFulfilled.catch(({ error }) => {
          toast.error("Ha ocurrido un error al obtener datos");
        });
      },
    }),
    updateProduct: builder.mutation<IProduct[], any>({
      query: (body) => ({
        url: `/admin/products`,
        method: body._id ? "put" : "post",
        body,
      }),
      invalidatesTags: ["Products"],
      onQueryStarted(data, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: data._id
            ? "Actualizando producto..."
            : "Creando producto...",
          success: data._id
            ? "Actualizado con éxito"
            : "Producto creado con éxito",
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
  }),
});

export const { useGetProductsQuery, useUpdateProductMutation } = productsApi;
