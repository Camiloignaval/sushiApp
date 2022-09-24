import {
  AirplaneTicketOutlined,
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import React, { FC } from "react";
import { CardList, OrdenSummary } from "../../../components/cart";
import { AdminLayout } from "../../../components/layouts";
import { GetServerSideProps } from "next";
import { dbOrders } from "../../../database";
import { IOrder } from "../../../interfaces";

interface Props {
  order: IOrder;
}

const OrderPage: FC<Props> = ({ order }) => {
  const { shippingAddress: sa } = order;

  return (
    <AdminLayout
      title={`Resumen de orden`}
      subTitle={order._id}
      icon={<AirplaneTicketOutlined />}
    >
      {order.isPaid ? (
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
          {/* <CardList products={order.orderItems} /> */}
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
              {/* <Typography>{sa.firstName}</Typography>
              <Typography>{sa.lastName}</Typography>
              <Typography>{sa.adress}</Typography>
              {sa.adress2 && <Typography>{sa.adress2}</Typography>} */}
              <Typography>{sa.phone}</Typography>
              <Divider sx={{ my: 1 }} />

              {/* <OrdenSummary
                infoPrices={{
                  numberOfItems: order.numberOfItems,
                  subTotal: order.subTotal,
                  total: order.total,
                }}
              /> */}
              <Box sx={{ mt: 3, display: "flex", flexDirection: "column" }}>
                {order.isPaid ? (
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
