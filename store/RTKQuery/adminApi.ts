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
  tagTypes: ["Dashboard", "Users"],
  endpoints: (builder) => ({
    getDashboardData: builder.query<IDashboard, null>({
      query: () => ({
        url: `/admin/dashboard`,
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
    updateUserRole: builder.mutation<IUser[], { userId: string; role: string }>(
      {
        query: (body) => ({
          url: `/admin/users`,
          method: "put",
          body,
        }),
        invalidatesTags: ["Users"],
        onQueryStarted(_, { queryFulfilled }) {
          toast.promise(queryFulfilled, {
            loading: "Actualizando rol...",
            success: "Actualizado con éxito",
            error: ({ error }) => error.data.message.toString(),
          });
        },
      }
    ),
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} = adminApi;
