import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { PayPalButtons } from "@paypal/react-paypal-js";

import React, { FC, useState } from "react";
import { CardList, OrdenSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces";
import { toast } from "react-hot-toast";
import {
  useGetOrderQuery,
  usePayOrderMutation,
} from "../../store/RTKQuery/ordersApi";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  order: IOrder;
}

interface OrderResponseBody {
  id: string;
  status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "PAYER_ACTION_REQUIRED";
}

const OrderPage: FC<Props> = ({ order }) => {
  const router = useRouter();
  const { shippingAddress: sa } = order;
  const [isAlreadyPay, setIsAlreadyPay] = useState(order.isPaid);
  const [payOrder, payOrderStatus] = usePayOrderMutation();

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== "COMPLETED") {
      return toast.error("No hay pago en Paypal");
    }
    try {
      // cambiar state en un futuro
      await payOrder({
        transactionId: details.id,
        orderId: order._id!,
      }).unwrap();
      setIsAlreadyPay(true);
    } catch (err) {
      return;
    }
  };

  return (
    <ShopLayout
      title={`Resumen de la orden`}
      pageDescription="Resumen de orden en la tienda"
    >
      <Typography variant="h1" component="h1">
        Orden: {order?._id}
      </Typography>
      {isAlreadyPay ? (
        <Chip
          className="fadeIn"
          sx={{ my: 2 }}
          label="Orden ya pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          className="fadeIn"
          sx={{ my: 2 }}
          label="Pendiente de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Grid container spacing={3} className="fadeIn">
        <Grid item xs={12} sm={7}>
          {/* card list */}
          <CardList products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          {/* cart */}
          <Card className="summary-cart">
            <CardContent>
              <Typography variant="h2" sx={{ marginBottom: 1 }}>
                Resumen ({order.numberOfItems}{" "}
                {order.numberOfItems === 1 ? "Producto" : "Productos"})
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent={"space-between"}>
                <Typography variant="subtitle1">
                  Dirección de entrega
                </Typography>
              </Box>
              <Typography>{sa.firstName}</Typography>
              <Typography>{sa.lastName}</Typography>
              <Typography>{sa.adress}</Typography>
              {sa.adress2 && <Typography>{sa.adress2}</Typography>}
              <Typography>{sa.city}</Typography>
              <Typography>{sa.phone}</Typography>
              <Divider sx={{ my: 1 }} />

              <OrdenSummary
                infoPrices={{
                  numberOfItems: order.numberOfItems,
                  subTotal: order.subTotal,
                  tax: order.tax,
                  total: order.total,
                }}
              />
              <Box sx={{ mt: 3, display: "flex", flexDirection: "column" }}>
                {payOrderStatus.isLoading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    className="fadeIn"
                  >
                    <CircularProgress />
                  </Box>
                ) : isAlreadyPay ? (
                  <Chip
                    className="fadeIn"
                    sx={{ my: 2 }}
                    label="Orden ya pagada"
                    variant="outlined"
                    color="success"
                    icon={<CreditScoreOutlined />}
                  />
                ) : (
                  <PayPalButtons
                    className="fadeIn"
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: order.total.toString(),
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order!.capture().then((details) => {
                        onOrderCompleted(details);
                      });
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query;

  const session: any = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderById(id.toString());
  if (!order || order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
