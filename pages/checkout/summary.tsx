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
import esLocale from "date-fns/locale/es";

import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CardList, OrdenSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { RootState } from "../../store";
import { countries } from "../../utils";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useCreateOrderMutation } from "../../store/RTKQuery/ordersApi";
import { IOrder, IProduct } from "../../interfaces";
import toast from "react-hot-toast";
import { cleanCart } from "../../store/Slices/CartSlice";
import { Extras } from "../../components/cart/Extras";
import { useGetProductsQuery } from "../../store/RTKQuery/productsApi";
import Swal from "sweetalert2";
import { format } from "date-fns";

const SummaryPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    shippingAddress,
    numberOfItems,
    cart,
    subTotal,
    total,
    extraProduct,
    note,
    coupon,
    deliverPrice,
    discount,
    reservedHour,
  } = useSelector((state: RootState) => state.cart);
  const [createNewOrder, createNewOrderState] = useCreateOrderMutation();
  const { data: productData, isLoading } = useGetProductsQuery(null);
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  const { store } = useSelector((state: RootState) => state.ui);
  // const { cart: generalCart } = useSelector((state: RootState) => state);

  useEffect(() => {
    if (!Cookies.get("address")) {
      router.push("/checkout/adress");
    }
  }, [router]);

  if (!shippingAddress) {
    return <LinearProgress color="success" />;
  }

  const createOrder = async () => {
    // let confirm = true;

    // if (!confirm) return;

    if (!shippingAddress) {
      toast.error("No hay dirección de entrega");
      return;
    }
    // const coords = JSON.parse(localStorage?.getItem("coords") ?? "")
    // const coordsToSave = `${coords?.lat ?? ""},${coords?.lng ?? ""}`

    const orderToSend: IOrder = {
      shippingAddress,
      numberOfItems,
      subTotal,
      total,
      discount,
      isPaid: false,
      reservedHour,
      orderItems: cart.map((item) => {
        if (item.name !== "Roll personalizado")
          return {
            ...item,
            sauces: (item.sauces ?? []).map((p) => ({
              name: p.name,
              price: p.price,
              _id: p._id,
              qty: p.qty,
            })),
          };
        const itemClone = { ...item };
        itemClone.proteins = itemClone?.proteins
          ? (itemClone.proteins?.map((p) => ({
              name: p.name,
              price: p.price,
              _id: p._id,
              qty: p.qty,
            })) as any)
          : undefined;
        itemClone.vegetables = itemClone?.vegetables
          ? (itemClone.vegetables?.map((p) => ({
              name: p.name,
              price: p.price,
              _id: p._id,
              qty: p.qty,
            })) as any)
          : undefined;
        itemClone.sauces = itemClone?.sauces
          ? ((itemClone.sauces as IProduct[])?.map((p) => ({
              name: p.name,
              price: p.price,
              _id: p._id,
              qty: p.qty,
            })) as any)
          : undefined;
        itemClone.extraProduct = itemClone?.sauces
          ? (itemClone.extraProduct?.map((p) => ({
              name: p.name,
              price: p.price,
              _id: p._id,
              qty: p.qty,
            })) as any)
          : undefined;
        itemClone.envelopes = itemClone?.envelopes
          ? (itemClone.envelopes?.map((p) => ({
              name: p.name,
              price: p.price,
              _id: p._id,
              qty: 1,
            })) as any)
          : undefined;
        return itemClone;
      }),
      orderExtraItems:
        extraProduct.length > 0
          ? extraProduct.filter((e) => e.quantity !== 0)
          : undefined,
      status: "ingested",
      note: !["", undefined].includes(note) ? note : undefined,
      deliverPrice,
      coupon: coupon,
    };
    orderToSend.shippingAddress = {
      ...orderToSend.shippingAddress,
      phone: "+56" + orderToSend.shippingAddress.phone,
    };

    try {
      if (!store.isOpen && store.type === "soon") {
        Swal.fire({
          title: "Recuerda!",
          text: "Aún no abrimos, tu pedido sera tomado apenas abramos!",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, enviar",
          cancelButtonText: "Cancelar",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await createNewOrder(orderToSend)
              .unwrap()
              .then(() => {
                dispatch(cleanCart());
                Cookies.remove("address");
                router.replace("/");
                setDisabledSubmit(true);
                localStorage.removeItem("coords");
              })
              .catch((e) => {
                if (
                  e?.data?.message ===
                  "Ha ocurrido un error, valores han sido alterados, favor reingrese orden"
                ) {
                  dispatch(cleanCart());
                  Cookies.remove("address");
                  router.replace("/");
                  setDisabledSubmit(true);
                  localStorage.removeItem("coords");
                }
              });
          } else {
            return;
          }
        });
      } else {
        await createNewOrder(orderToSend)
          .unwrap()
          .then(() => {
            dispatch(cleanCart());
            Cookies.remove("address");
            router.replace("/");
            setDisabledSubmit(true);
            localStorage.removeItem("coords");
          })
          .catch((e) => {
            if (
              e?.data?.message ===
              "Ha ocurrido un error, valores han sido alterados, favor reingrese orden"
            ) {
              dispatch(cleanCart());
              Cookies.remove("address");
              router.replace("/");
              setDisabledSubmit(true);
              localStorage.removeItem("coords");
            }
          });
      }
    } catch (error) {
      console.log({ error });
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
              <Typography>{"+56" + shippingAddress?.phone}</Typography>
              <Divider sx={{ my: 1 }} />
              {reservedHour && (
                // <>
                <Box display="flex" justifyContent={"space-between"} mb={4}>
                  <Typography>
                    Reserva para el{" "}
                    {format(new Date(reservedHour!), "dd MMMM yyyy HH:mm", {
                      locale: esLocale,
                    })}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <NextLink href="/cart" passHref>
                    <Link underline="always">Editar</Link>
                  </NextLink>
                  <Divider sx={{ my: 1, display: "flex" }} />
                </Box>
              )}
              {/* <Box display="flex" justifyContent={"end"}>
                <NextLink href="/cart" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box> */}
              <OrdenSummary />
              <Box sx={{ mt: 3 }}>
                <Button
                  disabled={createNewOrderState.isLoading || disabledSubmit}
                  onClick={createOrder}
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                >
                  Confirmar orden
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
