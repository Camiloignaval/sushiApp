import {
  DeleteOutlineOutlined,
  EditOutlined,
  TextSnippetOutlined,
} from "@mui/icons-material";
import esLocale from "date-fns/locale/es";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AgendarOrden, CardList, OrdenSummary } from "../../components/cart";
import { AddressForm } from "../../components/cart/AddressForm";
import { Extras } from "../../components/cart/Extras";
import { ExtraProducts } from "../../components/customRoll/ExtraProducts";
import { ShopLayout } from "../../components/layouts";
import { RootState } from "../../store";
import { useGetProductsQuery } from "../../store/RTKQuery/productsApi";
import { cancelReserve } from "../../store/Slices/CartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const { data: productData, isLoading } = useGetProductsQuery(null);
  const { cart } = useSelector((state: RootState) => state);
  const { replace, push } = useRouter();
  const [isModificable, setIsModificable] = useState(true);
  const [showReserveHour, setShowReserveHour] = useState(false);

  useEffect(() => {
    if (cart.reservedHour) {
      setShowReserveHour(false);
    }
  }, [cart.reservedHour]);

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
              <Divider sx={{ my: 2 }} />
              {cart.reservedHour && (
                <Grid container>
                  <Grid item xs>
                    <Typography>
                      Reserva para el{" "}
                      {format(
                        new Date(cart.reservedHour!),
                        "dd MMMM yyyy HH:mm",
                        { locale: esLocale }
                      )}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    display="flex"
                    justifyContent="end"
                    position="relative"
                    bottom={6}
                  >
                    <IconButton
                      color="secondary"
                      onClick={() => setShowReserveHour(true)}
                      aria-label="delete"
                    >
                      <EditOutlined />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        localStorage.removeItem("reserverHour");
                        dispatch(cancelReserve());
                      }}
                      aria-label="delete"
                    >
                      <DeleteOutlineOutlined />
                    </IconButton>
                  </Grid>
                </Grid>
              )}
              {(!cart.reservedHour || showReserveHour) &&
                (!showReserveHour ? (
                  <Button
                    disabled // TODO sacar para desarrollar
                    className="circular-btn"
                    fullWidth
                    color="secondary"
                    /* variant="h2" */ sx={{ marginBottom: 1 }}
                    onClick={() => setShowReserveHour(true)}
                  >
                    Agendar para otro Día/Hora
                  </Button>
                ) : (
                  <AgendarOrden setShowReserveHour={setShowReserveHour} />
                ))}
              <Divider sx={{ my: 1 }} />

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
