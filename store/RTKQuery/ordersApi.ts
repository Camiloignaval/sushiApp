import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import { IOrder } from "../../interfaces";
import { useRouter } from "next/router";

interface IResponse {
  data: {
    message: string;
    error?: object;
  };
}

// Define a service using a base URL and expected endpoints
export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Orders", "Order"],
  endpoints: (builder) => ({
    getAllOrders: builder.query<IOrder[], null>({
      query: () => ({
        url: `/admin/orders`,
        method: "get",
      }),
      providesTags: ["Orders"],
      onQueryStarted(_, { queryFulfilled }) {
        queryFulfilled.catch(() => {
          toast.error("Ha ocurrido un error al obtener ordenes");
        });
      },
    }),
    // getOrder: builder.query<IResponse, IOrder>({
    //   query: (orderId) => ({
    //     url: `/orders/${orderId}`,
    //     method: "get",
    //   }),
    //   onQueryStarted(_, { queryFulfilled }) {
    //     queryFulfilled.catch(() => {
    //       toast.error("Ha ocurrido un error al obtener orden");
    //     });
    //   },
    // }),
    // createOrder: builder.mutation<IResponse, IOrder>({
    //   query: (body) => ({
    //     url: `/orders`,
    //     method: "post",
    //     body,
    //   }),
    //   onQueryStarted(_, { queryFulfilled, dispatch }) {
    //     toast.promise(queryFulfilled, {
    //       loading: "Creando orden...",
    //       success: ({ data }) => {
    //         // limpiar el carrito y sacarlo de la pagina
    //         // const router = useRouter();
    //         // console.log(router);
    //         return "Orden creada con éxito";
    //       },
    //       error: ({ error }) => error.data.message.toString(),
    //     });
    //   },
    // }),
    // payOrder: builder.mutation<
    //   IResponse,
    //   { transactionId: string; orderId: string }
    // >({
    //   query: (body) => ({
    //     url: `/orders/pay`,
    //     method: "post",
    //     body,
    //   }),
    //   onQueryStarted(_, { queryFulfilled, dispatch }) {
    //     toast.promise(queryFulfilled, {
    //       loading: "Finalizando pago...",
    //       success: "Orden pagada con éxito",
    //       error: ({ error }) => error.data.message.toString(),
    //     });
    //   },
    // }),
  }),
});

export const {
  // useCreateOrderMutation,
  // useGetOrderQuery,
  // usePayOrderMutation,
  useGetAllOrdersQuery,
} = ordersApi;
