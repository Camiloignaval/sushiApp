import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  LinearProgress,
  Link,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CardList, OrdenSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { RootState } from "../../store";
import { countries } from "../../utils";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useCreateOrderMutation } from "../../store/RTKQuery/ordersApi";
import { IOrder } from "../../interfaces";
import toast from "react-hot-toast";
import { cleanCart } from "../../store/Slices/CartSlice";
import { Extras } from "../../components/cart/Extras";
import { useGetProductsQuery } from "../../store/RTKQuery/productsApi";

const SummaryPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { shippingAddress, numberOfItems, cart, subTotal, tax, total } =
    useSelector((state: RootState) => state.cart);
  const [createNewOrder, createNewOrderState] = useCreateOrderMutation();
  const { data: productData, isLoading } = useGetProductsQuery(null);

  useEffect(() => {
    if (!Cookies.get("address")) {
      router.push("/checkout/adress");
    }
  }, [router]);

  if (!shippingAddress) {
    return <LinearProgress color="success" />;
  }

  const createOrder = async () => {
    if (!shippingAddress) {
      toast.error("No hay dirección de entrega");
    }
    const orderToSend: IOrder = {
      orderItems: cart.map((c) => ({ ...c, size: c.size! })),
      shippingAddress,
      numberOfItems,
      subTotal,
      tax,
      total,
      isPaid: false,
    };
    const resp: any = await createNewOrder(orderToSend);
    if (!resp?.error) {
      router.replace(`/orders/${resp?.data?._id}`);
      dispatch(cleanCart());
    }
  };
  if (isLoading || !productData) {
    return <></>;
  }

  return (
    <ShopLayout
      title="Resumen de compras"
      pageDescription="Resumen de compra en la tienda"
    >
      <Typography variant="h1" component="h1">
        Resumen de compras
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          {/* card list */}
          <CardList />
          <Extras productData={productData!} />
        </Grid>
        <Grid item xs={12} sm={5}>
          {/* cart */}
          <Card className="summary-cart">
            <CardContent>
              <Typography variant="h2" sx={{ marginBottom: 1 }}>
                Resumen ({numberOfItems}{" "}
                {numberOfItems === 1 ? "producto" : "productos"})
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent={"space-between"}>
                <Typography variant="subtitle1">
                  Dirección de entrega
                </Typography>
                <NextLink href="/cart" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>
              <Typography>{shippingAddress?.username}</Typography>
              <Typography>{shippingAddress?.address}</Typography>
              <Typography>{shippingAddress?.city}</Typography>
              <Typography>{shippingAddress?.phone}</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent={"end"}>
                <NextLink href="/cart" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>
              <OrdenSummary />
              <Box sx={{ mt: 3 }}>
                <Button
                  disabled={createNewOrderState.isLoading}
                  onClick={createOrder}
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                >
                  Confirmar orden{" "}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
