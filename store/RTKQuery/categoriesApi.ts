import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import { ICategory } from "../../interfaces";

interface IResponse {
  data?: {
    message: string;
    categories?: ICategory[];
    error?: object;
  };
}

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Categories", "Category"],
  endpoints: (builder) => ({
    getCategories: builder.query<ICategory[], void>({
      query: (body) => ({
        url: `/admin/categories`,
        method: "get",
        body,
      }),
      providesTags: ["Categories"],
      onQueryStarted(_, { queryFulfilled }) {
        queryFulfilled.catch(({ error }) => {
          toast.error(`${(error as any).data.message.toString()}`);
        });
      },
    }),
    changeNameCategory: builder.mutation<IResponse, { id: any; name: string }>({
      query: (body) => ({
        url: `/admin/categories`,
        method: "put",
        body,
      }),
      invalidatesTags: ["Categories"],
      onQueryStarted(_, { queryFulfilled }) {
        queryFulfilled.catch(({ error }) => {
          toast.error(`${(error as any).data.message.toString()}`);
        });
      },
    }),
    newCategory: builder.mutation<IResponse, string>({
      query: (body) => ({
        url: `/admin/categories`,
        method: "post",
        body,
      }),
      invalidatesTags: ["Categories"],
      onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Creando categoria...",
          success: "Categoria creada con éxito",
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
    deleteCategory: builder.mutation<ICategory[], string>({
      query: (body) => ({
        url: `/admin/categories`,
        method: "delete",
        body,
      }),
      invalidatesTags: ["Categories"],
      onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Eliminando categoría...",
          success: "Eliminada con éxito",
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
    updateCategoryByProperty: builder.mutation<
      IResponse,
      { id: string; category: string; value: string | boolean | number }
    >({
      query: (body) => ({
        url: `/admin/category`,
        method: "put",
        body: body,
      }),
      invalidatesTags: ["Categories"],
      onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Actualizando categoría...",
          success: `Categoría actualizada con éxito`,
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
    deleteImportanceNumber: builder.mutation<IResponse, { id: string }>({
      query: (body) => ({
        url: `/admin/category`,
        method: "delete",
        body: body,
      }),
      invalidatesTags: ["Categories"],
      onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Eliminando  importancia...",
          success: `Categoría actualizada con éxito`,
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
  }),
});

export const {
  useChangeNameCategoryMutation,
  useGetCategoriesQuery,
  useNewCategoryMutation,
  useDeleteCategoryMutation,
  useDeleteImportanceNumberMutation,
  useUpdateCategoryByPropertyMutation,
} = categoriesApi;
