import { Search } from "@mui/icons-material";
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
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { currency } from "../../utils";
import { format } from "../../utils/currency";
import { HiOutlineTicket } from "react-icons/hi";

interface Props {
  editable?: boolean;
  infoPrices?: {
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
  };
}

export const OrdenSummary: FC<Props> = ({ infoPrices, editable = false }) => {
  const { cart } = useSelector((state: RootState) => state);
  const [infoToShow, setinfoToShow] = useState({
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
  });

  useEffect(() => {
    if (infoPrices) {
      setinfoToShow(infoPrices);
    } else {
      setinfoToShow({
        numberOfItems: cart.numberOfItems,
        subTotal: cart.subTotal,
        tax: cart.tax,
        total: cart.total,
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
          {infoToShow.numberOfItems}{" "}
          {infoToShow.numberOfItems > 1 ? "items" : "item"}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Extras</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>
          {currency.format(
            cart.extraProduct.reduce(
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
        <Typography>{currency.format(infoToShow.subTotal)}</Typography>
      </Grid>
      {/* impuestos
      <Grid item xs={6}>
        <Typography>Impuestos ({process.env.NEXT_PUBLIC_TAX_RATE}%)</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(infoToShow.tax)}</Typography>
      </Grid> */}

      {/* descuentos */}
      <Grid item xs={6} mt={2}>
        <Typography variant="subtitle1">Cupón descuento</Typography>
      </Grid>
      {editable ? (
        <Grid item xs={6} mt={2} display="flex" justifyContent="end">
          <Grid container>
            {/* <Typography>{currency.format(infoToShow.tax)}</Typography> */}
            <Grid item xs display="flex" justifyContent="end">
              <TextField
                label="Ingrese"
                variant="standard"
                sx={{
                  position: "relative",
                  top: -20,
                  width: "80px",
                }}
              />
            </Grid>{" "}
            <Grid item xs={1}>
              <IconButton size="small">
                <HiOutlineTicket fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid item xs={6} mt={2} display="flex" justifyContent="end">
          <Typography>EXAMPLE</Typography>
        </Grid>
      )}

      {/* descuentos */}
      <Grid item xs={6}>
        <Typography>Descuentos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(0)}</Typography>
      </Grid>
      <Divider />
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
          {currency.format(infoToShow.total)}
        </Typography>
      </Grid>
    </Grid>
  );
};
