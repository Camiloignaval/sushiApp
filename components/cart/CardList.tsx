import {
  Grid,
  Link,
  CardActionArea,
  CardMedia,
  Box,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import NextLink from "next/link";
import { FC, useEffect, useState } from "react";
import { ItemCounter } from "../ui";
import { IProduct } from "../../interfaces/products";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { ICartProduct, IOrderItem } from "../../interfaces";
import {
  removeFromCart,
  // udpateCartQuantity,
} from "../../store/Slices/CartSlice";
import { currency } from "../../utils";
import { VscDebugBreakpointLog } from "react-icons/vsc";

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}
export const CardList: FC<Props> = ({ editable = false, products }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state: RootState) => state.cart);
  // const [productToShow, setproductToShow] = useState<
  //   IOrderItem[] | ICartProduct[]
  // >([]);

  const onNewCartQty = (product: ICartProduct, newQty: number) => {
    // const productClone = { ...product };
    // productClone.quantity = newQty;
    // dispatch(udpateCartQuantity(productClone));
  };

  const handleDelete = (product: ICartProduct) => {
    // dispatch(removeFromCart(product));
  };

  // useEffect(() => {
  //   if (products) {
  //     setproductToShow(products);
  //   } else {
  //     setproductToShow(cart);
  //   }
  // }, [cart, products]);

  return (
    <>
      {cart.map((product, i) => (
        <>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={3} marginBottom={2} key={i}>
            <Grid item xs={3}>
              {/* <NextLink href={`/product/${product.slug}`} passHref> */}
              {/* <Link> */}
              <CardActionArea>
                <CardMedia
                  image={product.image}
                  component="img"
                  sx={{ borderRadius: "5px" }}
                />
              </CardActionArea>
              {/* </Link>
            </NextLink> */}
            </Grid>
            <Grid item xs={7}>
              <Box display="flex" flexDirection="column">
                <Typography variant="body1">{product.name}</Typography>
                <Typography variant="body1">
                  {/* {editable ? ( */}
                  {product.name === "Roll personalizado" && (
                    <Box>
                      <Typography variant="subtitle2" marginBottom={-1}>
                        Envoltura
                      </Typography>
                      <Grid container style={{ margin: "0", display: "flex" }}>
                        {product.envelopes!.map((env, i) => (
                          <Grid item style={{ margin: "0 30px 0 0" }}>
                            <Typography variant="caption">
                              <VscDebugBreakpointLog /> {env.name}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                      <Typography variant="subtitle2" marginBottom={-1}>
                        Relleno
                      </Typography>
                      <Grid container style={{ margin: "0", display: "flex" }}>
                        {[...product.proteins!, ...product.vegetables!]!.map(
                          (env, i) => (
                            <Grid item style={{ margin: "0 30px 0 0" }}>
                              <Typography variant="caption">
                                <VscDebugBreakpointLog /> {env.name}
                              </Typography>
                            </Grid>
                          )
                        )}
                      </Grid>
                      {product.extraProduct.length > 0 && (
                        <>
                          <Typography variant="subtitle2" marginBottom={-1}>
                            Extras
                          </Typography>
                          <Grid
                            container
                            style={{ margin: "0", display: "flex" }}
                          >
                            {[...product.extraProduct!]!.map((env, i) => (
                              <Grid item style={{ margin: "0 30px 0 0" }}>
                                <Typography variant="caption">
                                  <VscDebugBreakpointLog /> {env.name}
                                </Typography>
                              </Grid>
                            ))}
                          </Grid>
                        </>
                      )}
                    </Box>
                  )}

                  {/* ) : (
                  <Typography variant="h6">
                    {product.quantity}
                    {product.quantity > 1 ? "Productos" : "Producto"}
                  </Typography>
                )} */}
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={2}
              display="flex"
              alignItems="center"
              flexDirection="column"
            >
              <Typography variant="subtitle1">
                {currency.format(+product.price)}
              </Typography>

              {editable && (
                <Button
                  onClick={() => handleDelete(product as ICartProduct)}
                  variant="text"
                  color="secondary"
                >
                  Eliminar
                </Button>
              )}
              {/* <ItemCounter
                updatedQuantity={(qty) =>
                  onNewCartQty(product as ICartProduct, qty)
                }
                currentValue={+product.quantity}
                // maxValue={10}
              /> */}
            </Grid>
          </Grid>
        </>
      ))}
    </>
  );
};
