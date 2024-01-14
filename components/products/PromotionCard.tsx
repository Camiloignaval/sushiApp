import {
  Card,
  CardActionArea,
  Grid,
  CardMedia,
  Chip,
  Button,
  IconButton,
  Box,
} from "@mui/material";
// import NextLink from "next/link";
import React, { FC, useEffect, useMemo, useState } from "react";
import style from "./PromotionCard.module.css";
import { IPromotion } from "../../interfaces";
import CardInfo from "./CardInfo";
import { DeleteOutline, Mode } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { ModalOptions } from "./ModalOptions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import Swal from "sweetalert2";
import { removeFromCart } from "../../store/Slices/CartSlice";
import { toast } from "react-hot-toast";
import { ProductSlideShow } from "./ProductSlideShow";

interface Props {
  promotion: IPromotion;
}

export const PromotionCard: FC<Props> = ({ promotion }) => {
  const { cart } = useSelector((state: RootState) => state.cart);
  const [open, setOpen] = React.useState(false);
  const [isHovered, setisHovered] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const { store } = useSelector((state: RootState) => state.ui);

  const dispatch = useDispatch();
  const productImage = useMemo(() => {
    return isHovered && promotion.inStock
      ? promotion.images[1]
      : promotion.images[0];
  }, [isHovered, promotion.images, promotion.inStock]);

  const onDelete = () => {
    Swal.fire({
      title: `Eliminaras de la orden ${promotion.name}`,
      text: "¿Estás seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        // eliminar del carrito
        dispatch(removeFromCart(promotion._id!));
        toast.success(`${promotion.name} ha sido eliminada`, {
          duration: 3000,
        });
      }
    });
  };

  useEffect(() => {
    const promoFindInCart = cart.find((promo) => promo?._id === promotion._id);
    promoFindInCart ? setIsInCart(true) : setIsInCart(false);
  }, [cart, promotion._id]);

  return (
    <>
      <ModalOptions open={open} setOpen={setOpen} promotion={promotion} />
      <Grid
        container
        item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        position="relative"
        onMouseEnter={() => setisHovered(true)}
        onMouseLeave={() => setisHovered(false)}
      >
        <Box className="itemAos" data-aos="fade-up">
          <Card className={isInCart ? style["borderSelected"] : undefined}>
            <Grid item container display={"flex"} alignItems="stretch">
              <Grid item xs={12} /*  sm={6} */>
                <CardActionArea disabled={!promotion.inStock}>
                  <Box
                    className={style["glass-buttons"]}
                    sx={{
                      position: "absolute",
                      zIndex: 50,
                      top: 0,
                      width: "100%",
                      height: "50px",
                    }}
                  ></Box>
                  {/* si esta en oferta */}
                  {promotion?.inOffer && (
                    <Chip
                      variant="outlined"
                      color="error"
                      icon={<LocalOfferIcon />}
                      label="OFERTA"
                      size="small"
                      sx={{
                        position: "absolute",
                        zIndex: 99,
                        top: 10,
                        left: 10,
                        fontWeight: "600",
                      }}
                    />
                  )}
                  {!promotion.inStock ? (
                    <>
                      <Box
                        className={style["withOutStock"]}
                        sx={{
                          position: "absolute",
                          zIndex: 150,
                          width: "100%",
                          height: "100%",
                        }}
                        display="flex"
                        flexDirection={"column"}
                        alignContent={"center"}
                        justifyContent={"center"}
                      >
                        <p className={style["labelWithoutStock"]}>Agotado</p>
                      </Box>
                    </>
                  ) : !isInCart ? (
                    <Button
                      disabled={!store.isOpen && store.type === "close"}
                      onClick={() => setOpen((prev) => !prev)}
                      variant="contained"
                      color="success"
                      sx={{
                        position: "absolute",
                        zIndex: 99,
                        top: 10,
                        right: 10,
                      }}
                    >
                      Agregar
                    </Button>
                  ) : (
                    <>
                      <Button
                        disabled={!store.isOpen && store.type === "close"}
                        onClick={onDelete}
                        color="error"
                        className={style["roundedButtonDelete"]}
                        sx={{
                          position: "absolute",
                          zIndex: 99,
                          top: 10,
                          right: 10,
                        }}
                      >
                        {" "}
                        <DeleteIcon color="info" />
                      </Button>
                      <Button
                        disabled={!store.isOpen && store.type === "close"}
                        onClick={() => setOpen((prev) => !prev)}
                        className={style["roundedButtonEdit"]}
                        color="warning"
                        sx={{
                          position: "absolute",
                          zIndex: 99,
                          top: 10,
                          right: 90,
                        }}
                      >
                        <ModeEditIcon color="info" />
                      </Button>
                    </>
                  )}
                  {/* <CardMedia
                  className="fadeIn"
                  image={productImage}
                  component="img"
                  alt={promotion.name}
                  sx={{
                    objectFit: "cover",
                  }}
                  height="300px"
                  // onLoad={() => setIsImageLoaded(true)}
                /> */}
                  <ProductSlideShow images={promotion.images as string[]} />
                </CardActionArea>
              </Grid>
              <Grid item xs={12} /* sm={6} */>
                <CardInfo
                  promotion={promotion}
                  // isSelected={isSelected}
                  // setIsSelected={setIsSelected}
                />
              </Grid>
            </Grid>
          </Card>
        </Box>
      </Grid>
    </>
  );
};
