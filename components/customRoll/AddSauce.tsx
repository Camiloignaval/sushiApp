import { Box, Chip, Typography } from "@mui/material";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { IProduct, ICartProduct, IExtraProduct } from "../../interfaces";
import { RootState } from "../../store";
import { ItemCounter } from "../ui";

interface Props {
  sauce: IProduct;
  setPromoToSendCart?: Dispatch<SetStateAction<ICartProduct>>;
  idPromo: string;
}

export const AddSauce: FC<Props> = ({ sauce, setPromoToSendCart, idPromo }) => {
  const [extraToSendCart, setExtraToSendCart] = useState<IExtraProduct>({
    _id: sauce?._id!,
    image: sauce.image!,
    price: sauce.price!,
    name: sauce.name!,
    quantity: 0,
  });
  const { cart } = useSelector((state: RootState) => state.cart);
  const [qtyIsChanging, setQtyIsChanging] = useState(false);

  const updatedQuantity = (qty: number) => {
    setExtraToSendCart((prev) => ({ ...prev, quantity: qty }));
    setQtyIsChanging(true);
  };

  //   revisar si salsa esta en algun pedido
  useEffect(() => {
    const isInAnyOrder = (cart as ICartProduct[]).find(
      (item) =>
        item._id === idPromo &&
        item.extraProduct.find((e) => e._id === sauce._id)
    );
    const qty = isInAnyOrder
      ? isInAnyOrder.extraProduct.find((extra) => extra._id === sauce._id)
      : undefined;

    if (isInAnyOrder) {
      setExtraToSendCart((prev) => ({
        ...prev,
        quantity: qty?.quantity!,
      }));
    }
  }, [idPromo, cart]);

  // actualizar salsas extras
  useEffect(() => {
    if (qtyIsChanging && setPromoToSendCart) {
      setPromoToSendCart((prev): ICartProduct => {
        const extraCartClone = [...prev.extraProduct];
        const isAdded = extraCartClone.some((extra) => extra._id === sauce._id);
        const newExtraCart = extraCartClone.map((extra) => {
          if (extra._id === sauce._id) {
            return { ...extra, quantity: extraToSendCart.quantity };
          }
          return extra;
        });
        // Si no estaba, se le agrega a los extras
        !isAdded && newExtraCart.push(extraToSendCart);
        return {
          ...prev,
          extraProduct:
            extraCartClone?.length === 0 ? [extraToSendCart] : newExtraCart,
        };
      });
    }
  }, [extraToSendCart.quantity]);

  return (
    <Box width={"100%"} display="flex">
      <Box position={"relative"}>
        <img
          src={sauce.image}
          width="60px"
          height="60px"
          style={{
            display: "flex",

            justifyContent: "center",
            opacity: sauce.inStock ? 1 : 0.3,
          }}
        />
        <Chip
          label={`$${sauce.price}`}
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
        alignContent="center"
        alignItems="center"
        marginLeft={6}
        variant="subtitle2"
      >
        Salsa {sauce.name}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />

      <ItemCounter
        updatedQuantity={updatedQuantity}
        currentValue={extraToSendCart.quantity}
      />
    </Box>
  );
};
