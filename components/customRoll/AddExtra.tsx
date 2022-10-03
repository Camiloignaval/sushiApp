import { Box, Chip, Grid, Typography } from "@mui/material";
import { profile } from "console";
import Image from "next/image";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { ICartProduct, IOrderExtraItem, IProduct } from "../../interfaces";
import { RootState } from "../../store";
import { addOrUpdateExtraProducts } from "../../store/Slices/CartSlice";
import { ItemCounter } from "../ui";

interface Props {
  prod: IProduct | ICartProduct;
  editable?: boolean;
}

export const AddExtra: FC<Props> = ({ prod, editable = false }) => {
  const { extraProduct } = useSelector((state: RootState) => state.cart);
  const { isLoggedIn: isAdmin } = useSelector((state: RootState) => state.auth);
  const [extraToSendCart, setExtraToSendCart] = useState<ICartProduct>({
    _id: prod?._id!,
    image: prod.image!,
    price: prod.price!,
    name: prod.name!,
    type: prod.type!,
    inStock: prod.inStock!,
    quantity: extraProduct?.find((e) => e._id === prod._id)?.quantity ?? 0,
  });
  // const [qty, setQty] = useState(0);
  const dispatch = useDispatch();

  const updatedQuantity = (qty: number) => {
    setExtraToSendCart((prev) => ({ ...prev, quantity: qty }));
  };

  useEffect(() => {
    const cloneExtras = [...extraProduct];
    const isInCart = extraProduct!.find((p) => p._id === prod._id);
    if (!isInCart) {
      dispatch(addOrUpdateExtraProducts([...cloneExtras, extraToSendCart]));
    } else {
      let newExtraCart = [];
      if (extraToSendCart.quantity === 0) {
        newExtraCart = cloneExtras.filter((e) => e._id !== prod._id);
      } else {
        newExtraCart = cloneExtras.map((e) => {
          if (e._id === prod._id) {
            return { ...e, quantity: extraToSendCart.quantity };
          }
          return e;
        });
      }

      dispatch(addOrUpdateExtraProducts(newExtraCart));
    }
  }, [extraToSendCart.quantity]);

  return (
    <Grid item xs={6} md={4} lg={3}>
      <Box position={"relative"} display={"flex"} justifyContent={"center"}>
        <img
          src={prod!.image.toString()}
          alt="Producto Extra"
          width="60px"
          height="60px"
          style={{
            display: "flex",

            justifyContent: "center",
            opacity: prod.inStock || isAdmin ? 1 : 0.3,
          }}
          // loading="lazy"
        />
        <Chip
          label={`$${prod.price}`}
          variant="outlined"
          size="small"
          sx={{
            position: "absolute",
            marginLeft: "40px",
            zIndex: 100,
            top: 0,
            fontWeight: "500",
            backdropFilter: "blur(5.8px)",
          }}
        />
      </Box>

      <Typography
        display={"flex"}
        justifyContent="center"
        alignItems="center"
        marginLeft={1}
        variant="subtitle2"
      >
        {prod.name}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />

      {editable ? (
        <Box display={"flex"} justifyContent="center">
          <ItemCounter
            updatedQuantity={updatedQuantity}
            currentValue={+extraToSendCart.quantity}
            isPossibleZero
          />
        </Box>
      ) : (
        <Typography
          display={"flex"}
          justifyContent="center"
          alignItems="center"
          variant="subtitle2"
        >
          {isAdmin ? (
            <>
              {`${(prod as any).quantity} ${
                (prod as any)?.quantity === 1 ? "unidad" : "unidades"
              }`}
            </>
          ) : (
            <>
              {extraProduct.find((e) => e._id === prod._id)?.quantity}{" "}
              {extraProduct.find((e) => e._id === prod._id)?.quantity === 1
                ? "unidad"
                : "unidades"}
            </>
          )}
        </Typography>
      )}
    </Grid>
  );
};
