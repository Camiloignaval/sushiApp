import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { IUser } from "../../interfaces";
import { LogIn } from "../Slices/AuthSlice";

interface IResponse {
  token: string;
  user: IUser;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    LogIn: builder.mutation<IResponse, { userName: string; password: string }>({
      query: (body) => ({
        url: `/user/login`,
        method: "post",
        body,
      }),
      onQueryStarted(_, { queryFulfilled, dispatch }) {
        toast.promise(queryFulfilled, {
          loading: "Iniciando sesión...",
          success: ({ data: { user, token } }) => {
            Cookies.set("token", token, { expires: 60 });
            dispatch(LogIn(user));
            return "Ingreso correcto";
          },
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
    checkToken: builder.mutation<IResponse, void>({
      query: (body) => ({
        url: `/user/validate-token`,
        method: "post",
        body,
      }),
      onQueryStarted(_, { queryFulfilled, dispatch }) {
        queryFulfilled
          .then(({ data: { token, user } }) => {
            Cookies.set("token", token, { expires: 60 });
            dispatch(LogIn(user));
          })
          .catch(() => {
            Cookies.remove("token");
          });
      },
    }),
  }),
});

export const { useLogInMutation, useCheckTokenMutation } = authApi;
