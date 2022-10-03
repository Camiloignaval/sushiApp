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
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CardList, OrdenSummary } from "../../components/cart";
import { AddressForm } from "../../components/cart/AddressForm";
import { Extras } from "../../components/cart/Extras";
import { ExtraProducts } from "../../components/customRoll/ExtraProducts";
import { ShopLayout } from "../../components/layouts";
import { RootState } from "../../store";
import { useGetProductsQuery } from "../../store/RTKQuery/productsApi";

const CartPage = () => {
  const { data: productData, isLoading } = useGetProductsQuery(null);
  const { cart } = useSelector((state: RootState) => state);
  const { replace, push } = useRouter();
  const [isModificable, setIsModificable] = useState(true);

  useEffect(() => {
    if (cart.isLoaded && cart.cart.length === 0) {
      replace("/cart/empty");
    }
  }, [cart.numberOfItems, replace, cart.isLoaded, cart.cart.length]);

  const onSubmitOrder = () => {
    push("/checkout/summary");
  };

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
          <Extras editable productData={productData!} />
        </Grid>
        <Grid item xs={12} sm={5}>
          {/* cart */}
          <Card className="summary-cart">
            <CardContent>
              <AddressForm
                isModificable={isModificable}
                setIsModificable={setIsModificable}
              />

              <Typography variant="h2" sx={{ marginBottom: 1 }}>
                Resumen del carrito
              </Typography>
              <Divider sx={{ my: 1 }} />
              <OrdenSummary editable />
              <Box sx={{ mt: 3 }}>
                <Button
                  // href="/checkout/adress"
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  disabled={
                    cart.shippingAddress && !isModificable ? false : true
                  }
                  onClick={onSubmitOrder}
                >
                  {cart.shippingAddress && !isModificable
                    ? "Confirmar datos"
                    : "Favor guardar dirección"}
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
