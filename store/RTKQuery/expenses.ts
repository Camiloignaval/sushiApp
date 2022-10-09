import { IExpense } from "./../../interfaces/expense";
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
}

// Define a service using a base URL and expected endpoints
export const expensesApi = createApi({
  reducerPath: "expensesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Expenses"],
  endpoints: (builder) => ({
    getExpensesOfWeek: builder.query<IExpense, string>({
      query: (day) => ({
        url: `/admin/bills?startOfWeek=${day}`,
        method: "get",
      }),
      onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Obteniendo gastos...",
          success: "Gastos encontrados",
          error: ({ error }) => error?.data?.message?.toString() ?? "",
        });
      },
    }),
    updateExpenses: builder.mutation<IResponse, IExpense>({
      query: (body) => ({
        url: `/admin/bills`,
        method: "put",
        body,
      }),
      onQueryStarted(data, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Guardando gastos...",
          success: "Gastos actualizados",
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
  }),
});

export const { useGetExpensesOfWeekQuery, useUpdateExpensesMutation } =
  expensesApi;
