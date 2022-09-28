import {
  Box,
  Button,
  CardActions,
  CardContent,
  Divider,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import React, { FC, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ICartProduct, IPromotion } from "../../interfaces";
import { RootState } from "../../store";
import { useGetProductsQuery } from "../../store/RTKQuery/productsApi";
import { addOrUpdateCart } from "../../store/Slices/CartSlice";
import { currency } from "../../utils";
import { FullScreenLoading, ItemCounter } from "../ui";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  promotion: IPromotion;
}

export const ModalOptions: FC<Props> = ({ open, setOpen, promotion }) => {
  const dispatch = useDispatch();
  const [note, setNote] = useState("");
  const { data: productData } = useGetProductsQuery(null);
  const { cart } = useSelector((state: RootState) => state.cart);
  const [isInCart, setisInCart] = useState(false);
  const [promoToSendCart, setPromoToSendCart] = useState<ICartProduct>({
    _id: promotion?._id!,
    image: promotion.images[0]!,
    price: promotion.price!,
    name: promotion.name!,
    quantity: 1,
    extraProduct: [],
  });

  //TODO avisar que guarde cambios antes de cerrar modal

  // revisar si esta en carrito
  useEffect(() => {
    const promoFindInCart = cart.find((promo) => promo?._id === promotion._id);
    if (promoFindInCart) {
      setPromoToSendCart((prev) => ({
        ...prev,
        quantity: promoFindInCart?.quantity,
        extraProduct: promoFindInCart.extraProduct,
        note: promoFindInCart.note ? promoFindInCart.note : undefined,
      }));
      setisInCart(true);
    } else {
      setisInCart(false);
      setPromoToSendCart({
        _id: promotion?._id!,
        image: promotion.images[0]!,
        price: promotion.inOffer ? promotion.offerPrice! : promotion.price!,
        name: promotion.name!,
        quantity: 1,
        extraProduct: [],
      });
    }
  }, [cart, promotion]);

  const onConfirm = () => {
    // Buscar siesque ya existe en el carro para actualizarlo y no sobreescribirlo si esque esta
    const cloneCart = [...cart];
    const isInCart = cloneCart.some((promo) => promo._id === promotion._id);
    const newCart = cloneCart.map((promo) => {
      if (promo._id === promotion._id) {
        return promoToSendCart;
      }
      return promo;
    });
    // Si no estaba, se le agrega al carrito
    !isInCart && newCart.push(promoToSendCart);

    dispatch(addOrUpdateCart(newCart));
    setOpen(false);
    setisInCart(true);
    toast.success(`${promotion.name} agregada con éxito`, { duration: 3000 });
  };

  const updatedQuantity = (num: number) => {
    setPromoToSendCart((prev) => ({ ...prev, quantity: num }));
  };

  if (!productData) {
    return <FullScreenLoading />;
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        backdropFilter: "blur(4px)",
        transition: "all 0.5s ease-out",
        // width: "100px",
      }}
    >
      <Box sx={{ width: { xs: "100%", md: "550px" } }}>
        <Button
          onClick={() => setOpen(false)}
          size="large"
          sx={{ position: "absolute", zIndex: "200" }}
          variant="text"
        >
          <CloseIcon />
        </Button>
        <Image
          className="fadeIn"
          // image={promotion?.images[0].toString() ?? ""}
          src={promotion?.images[0].toString()}
          // component="img"
          alt={promotion.name.toString()}
          // sx={{
          //   objectFit: "cover",
          // }}
          layout="responsive"
          width="100%"
          objectFit="cover"
          height="70px"
          priority
          // loading="eager"
          // onLoad={() => setIsImageLoaded(true)}
        />
        <CardContent>
          <Typography
            display={"flex"}
            justifyContent={"center"}
            id="modal-modal-title"
            variant="h5"
            component="h2"
          >
            Opciones para {promotion.name}
          </Typography>
          <Divider sx={{ mb: 5 }} />
          <Box display={"flex"} paddingX={3.3}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Cantidad
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <ItemCounter
              updatedQuantity={updatedQuantity}
              currentValue={+promoToSendCart.quantity}
            />
          </Box>

          <Box justifyContent={"end"} display="flex" marginX={4}>
            <Typography variant="h6">
              {promotion.inOffer
                ? currency.format(
                    +promotion!.offerPrice! * +promoToSendCart.quantity
                  )
                : currency.format(+promotion.price * +promoToSendCart.quantity)}
            </Typography>
          </Box>

          <TextField
            id="outlined-multiline-flexible"
            label="Notas extras"
            multiline
            maxRows={4}
            fullWidth
            sx={{ marginTop: "7px" }}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={() => setPromoToSendCart((prev) => ({ ...prev, note }))}
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
        </CardContent>
        <CardActions sx={{ margin: "0 20px" }}>
          <Button
            onClick={onConfirm}
            fullWidth
            color="primary"
            sx={{ fontSize: "1.2rem" }}
          >
            {isInCart ? "Actualizar" : "Agregar"}
          </Button>
        </CardActions>
        {/* <img
          width={"100%"}
          alt="Logo"
          src="/logos/logo-sushi-panko.png"
          style={{ opacity: 0.5, marginTop: 20 }}
        /> */}
        <Image
          width={"100%"}
          height={"100%"}
          alt="Logo"
          // src="/logos/logo-sushi-panko.jpf"
          src="https://res.cloudinary.com/dc6vako2z/image/upload/v1664357167/SushiApp/logo-sushi-panko_qtifjs.webp"
          style={{ opacity: 0.5, marginTop: 20 }}
          layout="responsive"
          // loading="eager"
          priority
        ></Image>
      </Box>
    </Drawer>
  );
};
