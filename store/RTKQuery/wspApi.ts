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
export const wspApi = createApi({
  reducerPath: "wspApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["wsp"],
  endpoints: (builder) => ({
    sendMessage: builder.mutation<
      IResponse,
      { phone: string; message: string }
    >({
      query: (body) => ({
        url: `/admin/wsp`,
        method: "post",
        body,
      }),
      onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Enviando mensaje...",
          success: "Mensaje enviado con éxito",
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
  }),
});

export const { useSendMessageMutation } = wspApi;
