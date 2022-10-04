import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { IUser } from "../../interfaces";
import { LogIn } from "../Slices/AuthSlice";

interface IResponse {
  token: string;
  user: IUser;
}

// Define a service using a base URL and expected endpoints
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
            Cookies.set("token", token);
            dispatch(LogIn(user));
            return "Ingreso correcto";
          },
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
    Register: builder.mutation<
      IResponse,
      { email: string; password: string; name: string }
    >({
      query: (body) => ({
        url: `/user/register`,
        method: "post",
        body,
      }),
      onQueryStarted(_, { queryFulfilled, dispatch }) {
        toast.promise(queryFulfilled, {
          loading: "Registrando usuario...",
          success: ({ data: { user, token } }) => {
            Cookies.set("token", token);
            dispatch(LogIn(user));
            return "Registro exitoso";
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
            Cookies.set("token", token);
            dispatch(LogIn(user));
          })
          .catch(() => {
            // ! arroja error al recargar
            Cookies.remove("token");
          });
      },
    }),
  }),
});

export const { useLogInMutation, useRegisterMutation, useCheckTokenMutation } =
  authApi;
