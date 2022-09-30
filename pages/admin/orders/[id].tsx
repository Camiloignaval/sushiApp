import {
  AirplaneTicketOutlined,
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import NextLink from "next/link";

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

import React, { FC, useEffect, useState } from "react";
import { CardList, OrdenSummary } from "../../../components/cart";
import { AdminLayout } from "../../../components/layouts";
import { GetServerSideProps } from "next";
import { dbOrders } from "../../../database";
import { IOrder, IProduct } from "../../../interfaces";
import { Extras } from "../../../components/cart/Extras";
import { FullScreenLoading } from "../../../components/ui";
import { useAnulateOrdersMutation } from "../../../store/RTKQuery/ordersApi";
import { useRouter } from "next/router";

interface Props {
  order: IOrder;
}

const OrderPage: FC<Props> = ({ order: orderFromServer }) => {
  const router = useRouter();
  const [order, setorder] = useState<IOrder>();
  const [anulateOrderQuery, anulateOrderStatus] = useAnulateOrdersMutation();

  useEffect(() => {
    setorder(orderFromServer);
  }, [orderFromServer]);

  const anulateOrder = async () => {
    try {
      await anulateOrderQuery([order?._id!]).unwrap();
      router.push("/admin/orders");
    } catch (error) {}
  };

  if (!order) {
    return <FullScreenLoading></FullScreenLoading>;
  }

  return (
    <AdminLayout
      title={`Detalles de orden`}
      subTitle={order._id}
      icon={<AirplaneTicketOutlined />}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <Typography variant="h2" sx={{ marginBottom: 1, mt: 2 }}>
            Resumen ({order.numberOfItems}{" "}
            {order.numberOfItems === 1 ? "producto" : "productos"})
          </Typography>
          {/* card list */}
          <CardList orderProduct={order.orderItems} />
          <Extras productData={order.orderExtraItems as IProduct[]} isAdmin />
        </Grid>
        <Grid item xs={12} sm={5}>
          {/* cart */}
          <Card className="summary-cart" sx={{ mt: 3 }}>
            <CardContent>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent={"space-between"}>
                <Typography variant="subtitle1">
                  Dirección de entrega
                </Typography>
                <NextLink href="/cart" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>
              <Typography>{order.shippingAddress?.username}</Typography>
              <Typography>{order.shippingAddress?.address}</Typography>
              <Typography>{order.shippingAddress?.phone}</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent={"end"}>
                <NextLink href="/cart" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>
              <OrdenSummary order={order} />
              <Box sx={{ mt: 3 }}>
                <Button
                  // disabled={anulateOrderStatus.isLoading}
                  onClick={anulateOrder}
                  color="error"
                  className="circular-btn"
                  fullWidth
                >
                  Anular orden
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query;

  const order = await dbOrders.getOrderById(id.toString());
  if (!order) {
    return {
      redirect: {
        destination: `/admin/orders`,
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
