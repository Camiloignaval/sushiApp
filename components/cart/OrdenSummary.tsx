import { RemoveCircleOutline, Search } from "@mui/icons-material";
import {
  Button,
  Divider,
  FormGroup,
  Grid,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { currency } from "../../utils";
import { format } from "../../utils/currency";
import { HiOutlineTicket } from "react-icons/hi";
import { useValidateCouponMutation } from "../../store/RTKQuery/couponApi";
import { addCoupon, removeCoupon } from "../../store/Slices/CartSlice";
import { useRouter } from "next/router";
import { IOrder } from "../../interfaces";
import { toast } from "react-hot-toast";

interface Props {
  editable?: boolean;
  infoPrices?: {
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    deliverPrice: number;
  };
  order?: IOrder | undefined;
}

export const OrdenSummary: FC<Props> = ({
  infoPrices,
  editable = false,
  order = undefined,
}) => {
  const { cart } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const { asPath } = useRouter();
  const [validateCoupon] = useValidateCouponMutation();
  const [inputCoupon, setInputCoupon] = useState("");
  const [infoToShow, setinfoToShow] = useState({
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    deliverPrice: 0,
  });

  const onQueryCoupon = async () => {
    try {
      if (!cart?.shippingAddress) {
        return toast.error("Favor primero ingresar datos de dirección");
      }
      await validateCoupon({
        code: inputCoupon,
        amount: cart.subTotal,
        phone: cart?.shippingAddress!.phone!,
      }).unwrap();
    } catch (error) {
      console.log({ error });
    }
    setInputCoupon("");
  };

  useEffect(() => {
    if (infoPrices) {
      setinfoToShow(infoPrices);
    } else {
      setinfoToShow({
        numberOfItems: cart.numberOfItems,
        subTotal: cart.subTotal,
        tax: cart.tax,
        total: cart.total,
        deliverPrice: cart.deliverPrice,
      });
    }
  }, [cart, infoPrices]);

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>
          {(order ? order : infoToShow).numberOfItems}{" "}
          {(order ? order : infoToShow).numberOfItems > 1 ? "items" : "item"}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Extras</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>
          {currency.format(
            (order ? order.orderExtraItems! : cart.extraProduct).reduce(
              (acc, curr) => +acc + +curr.price * +curr.quantity,
              0
            )
          )}
        </Typography>
      </Grid>
      <Divider />
      {/* subtotal */}
      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>
          {currency.format((order ? order : infoToShow).subTotal)}
        </Typography>
      </Grid>
      {/* impuestos
      <Grid item xs={6}>
        <Typography>Impuestos ({process.env.NEXT_PUBLIC_TAX_RATE}%)</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(infoToShow.tax)}</Typography>
      </Grid> */}

      {/* descuentos */}
      {(cart?.coupon || asPath === "/cart") && (
        <Grid item xs={6} mt={2}>
          <Typography variant="subtitle1">Cupón descuento</Typography>
        </Grid>
      )}
      {editable ? (
        !cart?.coupon ? (
          <Grid item xs={6} mt={2} display="flex" justifyContent="end">
            <Grid spacing={1} container>
              {/* <Typography>{currency.format(infoToShow.tax)}</Typography> */}
              <Grid
                item
                xs={6}
                md={8}
                lg={9}
                display="flex"
                justifyContent="end"
              >
                <TextField
                  label="Ingrese"
                  variant="standard"
                  onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                  onKeyDown={({ code }) =>
                    code === "Enter" ? onQueryCoupon() : undefined
                  }
                  value={inputCoupon}
                  sx={{
                    position: "relative",
                    top: -20,
                    width: "80px",
                  }}
                />
              </Grid>{" "}
              <Grid item xs={6} md={4} lg={3}>
                <Button
                  disabled={inputCoupon === ""}
                  onClick={onQueryCoupon}
                  size="small"
                  color="primary"
                >
                  {/* <HiOutlineTicket fontSize="inherit" /> */}
                  Canjear
                </Button>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          // si ya ingreso cupon
          <Grid item xs={6} mt={2} display="flex" justifyContent="end">
            <Grid container>
              {/* <Typography>{currency.format(infoToShow.tax)}</Typography> */}
              <Grid item xs display="flex" justifyContent="end">
                <Typography>{cart.coupon.code}</Typography>
              </Grid>{" "}
              <Grid item xs={1}>
                <IconButton
                  onClick={() => {
                    dispatch(removeCoupon());
                    localStorage.removeItem("coupon");
                  }}
                  size="small"
                  sx={{ position: "relative", top: -3 }}
                >
                  <RemoveCircleOutline fontSize="inherit" />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        )
      ) : (
        (cart?.coupon || asPath === "/cart") && (
          <Grid item xs={6} mt={2} display="flex" justifyContent="end">
            <Typography>{cart?.coupon?.code}</Typography>
          </Grid>
        )
      )}

      {/* descuentos */}
      <Grid item xs={6}>
        <Typography>Descuentos</Typography>
        {cart?.coupon && (
          <Typography variant="caption">
            Cupon {cart.coupon?.name}{" "}
            {cart.coupon?.type === "percentage"
              ? `${cart.coupon.discount}% dscto.`
              : `${currency.format(cart.coupon!.discount)} dscto.`}
          </Typography>
        )}
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>
          {currency.format((order ? order : cart).discount)}
        </Typography>
      </Grid>
      <Divider sx={{ my: 2 }} />
      {/* despacho */}
      <Grid item xs={6} sx={{ marginTop: 5 }}>
        <Typography>Despacho</Typography>
      </Grid>
      <Grid
        sx={{ marginTop: 5 }}
        item
        xs={6}
        display="flex"
        justifyContent="end"
      >
        <Typography>
          {currency.format((order ? order : infoToShow).deliverPrice)}
        </Typography>
      </Grid>

      {/* total */}
      <Grid item xs={6} sx={{ marginTop: 5 }}>
        <Typography variant="subtitle1">Total</Typography>
      </Grid>
      <Grid
        sx={{ marginTop: 5 }}
        item
        xs={6}
        display="flex"
        justifyContent="end"
      >
        <Typography variant="subtitle1">
          {currency.format((order ? order : infoToShow).total)}
        </Typography>
      </Grid>
    </Grid>
  );
};
