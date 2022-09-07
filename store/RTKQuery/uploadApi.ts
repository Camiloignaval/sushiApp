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
export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Files"],
  endpoints: (builder) => ({
    uploadFiles: builder.mutation<{ message: string }, any>({
      query: (body) => ({
        url: `/admin/upload`,
        method: "post",
        body,
      }),
      // onQueryStarted(data, { queryFulfilled }) {
      //   queryFulfilled.catch(() => {
      //     toast.error("Ha ocurrido un error.subiendo la imágen..");
      //   });
      //   // toast.promise(queryFulfilled, {
      //   //   loading: "Subiendo fotos...",
      //   //   success: "Fotos subidas con éxito",
      //   //   error: ({ error }) =>
      //   //     error?.data?.message?.toString() ?? "Ha ocurrido un error",
      //   // });
      // },
    }),
  }),
});

export const { useUploadFilesMutation } = uploadApi;
