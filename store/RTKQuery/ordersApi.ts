import { IOrderWithPaginate } from "./../../interfaces/order";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import { IOrder } from "../../interfaces";
import { useRouter } from "next/router";
import { GridRowId } from "@mui/x-data-grid";

type IResponse =
  | IOrder
  | {
      data: {
        message: string;
        error?: object;
      };
    };

// Define a service using a base URL and expected endpoints
export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Orders", "Order"],
  endpoints: (builder) => ({
    getAllOrders: builder.query<IOrderWithPaginate, null | string>({
      query: (query) => ({
        url: `/admin/orders?${query}`,
        method: "get",
      }),
      providesTags: ["Orders"],
      onQueryStarted(_, { queryFulfilled }) {
        queryFulfilled.catch(() => {
          toast.error("Ha ocurrido un error al obtener ordenes");
        });
      },
    }),
    createOrder: builder.mutation<IResponse, IOrder>({
      query: (body) => ({
        url: `/orders`,
        method: "post",
        body,
      }),
      onQueryStarted(_, { queryFulfilled, dispatch }) {
        toast.promise(queryFulfilled, {
          loading: "Creando orden...",
          success: ({ data }) => "Orden creada con éxito",
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),

    changeOrderStatus: builder.mutation<
      IResponse,
      { ids: GridRowId[]; newStatus: string }
    >({
      query: (body) => ({
        url: `/admin/orders`,
        method: "put",
        body,
      }),
      invalidatesTags: ["Orders"],
      onQueryStarted(body, { queryFulfilled, dispatch }) {
        toast.promise(queryFulfilled, {
          loading: "Cambiando estado de ordenes...",
          success: ({ data }) =>
            `Orden(es) ${
              body.newStatus === "inprocess"
                ? "procesada(s)"
                : body.newStatus === "dispatched"
                ? "despachada(s)"
                : "entregada(s)"
            } con éxito`,
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
    retryConfirmOrder: builder.mutation<
      IResponse,
      { phone: string; orderId: string }
    >({
      query: (body) => ({
        url: `/admin/order`,
        method: "post",
        body,
      }),
      invalidatesTags: ["Orders"],
      onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Confirmando orden...",
          success: "Orden confirmada con éxito",
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
    anulateOrders: builder.mutation<IResponse, string[] | GridRowId[]>({
      query: (body) => ({
        url: `/admin/orders`,
        method: "delete",
        body,
      }),
      invalidatesTags: ["Orders"],
      onQueryStarted(_, { queryFulfilled }) {
        toast.promise(queryFulfilled, {
          loading: "Anulando orden(es)...",
          success: "Orden(es) anulada(s) con éxito",
          error: ({ error }) => error.data.message.toString(),
        });
      },
    }),
    searchOrderById: builder.query<IOrder, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "get",
      }),
      providesTags: ["Order"],
    }),
    countOrdersNumber: builder.query<number, null>({
      query: () => ({
        url: `/admin/ordersnumber`,
        method: "get",
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useChangeOrderStatusMutation,
  useRetryConfirmOrderMutation,
  useAnulateOrdersMutation,
  useSearchOrderByIdQuery,
  useCountOrdersNumberQuery,
} = ordersApi;
