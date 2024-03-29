import {
  Box,
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import React, { FC, useEffect, useState } from "react";
import { ItemCounter } from "../ui";
import { FormCustomRoll } from "./FormCustomRoll";
import CloseIcon from "@mui/icons-material/Close";
import { ICartProduct } from "../../interfaces";
import { currency } from "../../utils";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { addOrUpdateCart } from "../../store/Slices/CartSlice";
import { useGetProductsQuery } from "../../store/RTKQuery/productsApi";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DrawerCustomRoll: FC<Props> = ({ open, setOpen }) => {
  const [isError, setisError] = useState(false);
  const dispatch = useDispatch();
  const { cart } = useSelector((state: RootState) => state.cart);
  const { store } = useSelector((state: RootState) => state.ui);

  const [promoToSendCart, setPromoToSendCart] = useState<ICartProduct>({
    _id: uuidv4(),
    image: "",
    price: 0,
    name: "Roll personalizado",
    quantity: 1,
    extraProduct: [],
    proteins: [],
    vegetables: [],
    envelopes: [],
    sauces: [],
  });

  useEffect(() => {
    if (open === false) {
      setPromoToSendCart({
        _id: uuidv4(),
        image: "",
        price: 0,
        name: "Roll personalizado",
        quantity: 1,
        extraProduct: [],
        proteins: [],
        vegetables: [],
        envelopes: [],
        sauces: [],
      });
    }
  }, [open]);

  // cambiar imagen de promo
  useEffect(() => {
    if (promoToSendCart.envelopes!.length > 0) {
      setPromoToSendCart((prev) => ({
        ...prev,
        image: promoToSendCart.envelopes![0].image!,
      }));
    }
  }, [promoToSendCart.envelopes]);

  const onConfirm = () => {
    const cloneCart = [...cart];
    const newCart = [...cloneCart, promoToSendCart];

    dispatch(addOrUpdateCart(newCart));
    setOpen(false);
    setPromoToSendCart({
      _id: uuidv4(),
      image: "",
      price: 0,
      name: "Roll personalizado",
      quantity: 1,
      extraProduct: [],
      proteins: [],
      vegetables: [],
      envelopes: [],
      sauces: [],
    });
    // setisInCart(true);
    toast.success(`Roll agregado con éxito`, { duration: 3000 });
  };

  // calcular precio
  useEffect(() => {
    if (promoToSendCart.envelopes!?.length > 0 && !isError) {
      const priceExtras = promoToSendCart.extraProduct!.reduce(
        (acc, curr) => acc + curr.price * curr.qty!,
        0
      );

      setPromoToSendCart((prev) => ({
        ...prev,
        price: +promoToSendCart.envelopes![0].price + priceExtras,
      }));
    } else {
      setPromoToSendCart((prev) => ({
        ...prev,
        price: 0,
      }));
    }
  }, [
    promoToSendCart.envelopes,
    promoToSendCart!.quantity,
    isError,
    promoToSendCart.extraProduct,
  ]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        backdropFilter: "blur(4px)",
        transition: "all 0.5s ease-out",
      }}
    >
      <Box
        sx={{
          width: {
            xs: "100vw",
            sm: "70vw",
            md: "50vw",
            lg: "37vw",
            overflowX: "none",
          },
        }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          size="large"
          sx={{ position: "absolute", zIndex: "200" }}
        >
          <CloseIcon />
        </IconButton>

        <CardMedia
          className="fadeIn"
          image="/images/logocustomroll.png"
          component="img"
          alt={"handrollImage"}
          sx={{
            objectFit: "cover",
            maxHeight: "400px",
          }}
          loading="eager"
          // onLoad={() => setIsImageLoaded(true)}
        />
        <CardContent>
          <Typography
            display={"flex"}
            justifyContent={"center"}
            id="modal-modal-title"
            variant="h4"
            component="h2"
          >
            Arma tu Roll
          </Typography>

          <FormCustomRoll
            setisError={setisError}
            promoToSendCart={promoToSendCart}
            setPromoToSendCart={setPromoToSendCart}
          />
          <Divider sx={{ mb: 4 }} />
          <Box display={"flex"} paddingX={3.3}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Cantidad
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <ItemCounter
              updatedQuantity={(qty) =>
                setPromoToSendCart((prev) => ({ ...prev, quantity: qty }))
              }
              currentValue={+promoToSendCart.quantity}
              // maxValue={5}
            />
          </Box>
          <Typography
            display={"flex"}
            justifyContent="end"
            id="modal-modal-title"
            variant="caption"
          >
            Si modifica cantidad, favor revisar salsas*
          </Typography>
          <TextField
            id="outlined-multiline-flexible"
            label="Notas extras"
            multiline
            maxRows={4}
            fullWidth
            sx={{ marginTop: "7px" }}
            value={promoToSendCart.note}
            onChange={(e) =>
              setPromoToSendCart((prev) => ({ ...prev, note: e.target.value }))
            }
          />
          <Typography
            variant="caption"
            color="grey"
            sx={{ fontStyle: "italic", mt: 2 }}
            display="flex"
            justifyContent={"end"}
          >
            Salsas extra podrán ser agregadas en el carrito*
          </Typography>
          {/* {!isError && ( */}
          <Box
            // sx={{ visibility: isError ? "hidden" : undefined }}
            // className="fadeIn"
            // justifyContent={"end"}
            // display="flex"
            // marginX={4}
            sx={{
              visibility: isError ? "hidden" : undefined,
              background:
                "linear-gradient(270deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 27%, rgba(255,255,255,1) 40%, rgba(255,255,255,1) 53%, rgba(255,255,255,1) 67%, rgba(255,255,255,1) 81%, rgba(255,255,255,0) 100%)",
            }}
            className="fadeIn"
            justifyContent={"center"}
            display="flex"
            marginX={4}
            position="sticky"
            bottom={0}
            right={10}
            height={50}
          >
            <Typography position="relative" top={15} variant="h5">
              Total{" "}
              {currency.format(
                +promoToSendCart.price * +promoToSendCart.quantity
              )}
            </Typography>
          </Box>
          {/* )} */}
        </CardContent>
        <CardActions sx={{ margin: "0 20px" }}>
          <Button
            disabled={
              isError ||
              promoToSendCart.envelopes?.length === 0 ||
              (!store.isOpen && store.type === "close")
            }
            onClick={onConfirm}
            fullWidth
            color="primary"
            sx={{ fontSize: "1.2rem" }}
          >
            Agregar
          </Button>
        </CardActions>
      </Box>
    </Drawer>
  );
};
