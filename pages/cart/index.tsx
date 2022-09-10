import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { CardList, OrdenSummary } from "../../components/cart";
import { AddressForm } from "../../components/cart/AddressForm";
import {
  ExtraProducts,
  ExtraSauces,
} from "../../components/customRoll/ExtraProducts";
import { ShopLayout } from "../../components/layouts";
import { IOrder } from "../../interfaces";
import { RootState } from "../../store";
import { useGetProductsQuery } from "../../store/RTKQuery/productsApi";
import { useGetAllPromotionsQuery } from "../../store/RTKQuery/promotionApi";

const CartPage = () => {
  const { data: productData, isLoading } = useGetProductsQuery(null);
  const { cart } = useSelector((state: RootState) => state);
  const { replace } = useRouter();

  useEffect(() => {
    if (cart.isLoaded && cart.cart.length === 0) {
      replace("/cart/empty");
    }
  }, [cart.numberOfItems, replace, cart.isLoaded, cart.cart.length]);

  const onSubmitOrder = () => {
    // Preparar orden para enviarla
    const cartToSend = { ...cart };
    delete cartToSend?.isLoaded;
    cartToSend.orderItems = cartToSend.cart;
    console.log({ cartToSend });
  };

  console.log({ productData });
  if (!cart.isLoaded || cart.cart.length === 0 || isLoading) {
    return <></>;
  }

  return (
    <ShopLayout
      title="Carrito de compras"
      pageDescription="Carrito de compras de la tienda"
    >
      <Typography variant="h1" component="h1">
        Carrito de compras
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          {/* card list */}
          <CardList editable />
          {/* Salsas extras */}
          <FormControl
            sx={{ m: 3, width: "100%" }}
            component="fieldset"
            variant="standard"
          >
            <FormLabel component="legend" sx={{ mb: 3 }}>
              Agrega salsas extra
            </FormLabel>
            {/* salsas extras */}
            <ExtraProducts
              products={productData!?.filter((prod) => prod.type === "sauce")}
            />
            {/* otros extras */}
            <FormLabel component="legend" sx={{ marginY: 3 }}>
              Agrega otros productos
            </FormLabel>
            <ExtraProducts
              products={productData!?.filter((prod) => prod.type === "other")}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={5}>
          {/* cart */}
          <Card className="summary-cart">
            <CardContent>
              <AddressForm />

              <Typography variant="h2" sx={{ marginBottom: 1 }}>
                Resumen del carrito
              </Typography>
              <Divider sx={{ my: 1 }} />
              <OrdenSummary />
              <Box sx={{ mt: 3 }}>
                <Button
                  // href="/checkout/adress"
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  disabled={cart.shippingAddress ? false : true}
                  onClick={onSubmitOrder}
                >
                  Enviar orden
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default CartPage;
