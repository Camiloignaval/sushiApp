import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import { IDashboard, IOrder, IUser } from "../../interfaces";
import { useRouter } from "next/router";
import { redirect } from "next/dist/server/api-utils";

interface IResponse {
  data: {
    message: string;
    error?: object;
  };
}

// Define a service using a base URL and expected endpoints
export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Dashboard", "Users", "Admins"],
  endpoints: (builder) => ({
    getDashboardData: builder.query<IDashboard, null | string>({
      query: (dateRange) => ({
        url: `/admin/dashboard${dateRange !== null ? dateRange : ""}`,
        method: "get",
      }),
      providesTags: ["Dashboard"],
      onQueryStarted(_, { queryFulfilled }) {
        queryFulfilled.catch(({ error }) => {
          toast.error("Ha ocurrido un error al obtener datos");
        });
      },
    }),
    getUsers: builder.query<IUser[], null>({
      query: () => ({
        url: `/admin/users`,
        method: "get",
      }),
      providesTags: ["Users"],
      onQueryStarted(_, { queryFulfilled }) {
        queryFulfilled.catch(({ error }) => {
          toast.error("Ha ocurrido un error al obtener datos");
        });
      },
    }),
    newAdminUser: builder.mutation<IUser, IUser>({
      query: (body) => ({
        url: `/admin/admins`,
        method: "post",
        body,
      }),
      invalidatesTags: ["Admins"],
      onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Creando usuario...",
          success: "Usuario creado con éxito",
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
    updateAdminUser: builder.mutation<IUser, IUser>({
      query: (body) => ({
        url: `/admin/admins`,
        method: "put",
        body,
      }),
      invalidatesTags: ["Admins"],
      onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Actualizando usuario...",
          success: "Usuario actualizado con éxito",
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
    getAdmins: builder.query<IUser[], null>({
      query: () => ({
        url: `/admin/admins`,
        method: "get",
      }),
      providesTags: ["Admins"],
      onQueryStarted(_, { queryFulfilled }) {
        queryFulfilled.catch(({ error }) => {
          toast.error("Ha ocurrido un error al obtener datos");
        });
      },
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetUsersQuery,
  useGetAdminsQuery,
  useUpdateAdminUserMutation,
  useNewAdminUserMutation,
} = adminApi;
