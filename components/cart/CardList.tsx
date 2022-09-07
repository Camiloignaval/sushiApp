import {
  Grid,
  Link,
  CardActionArea,
  CardMedia,
  Box,
  Typography,
  Button,
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
  udpateCartQuantity,
} from "../../store/Slices/CartSlice";

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}
export const CardList: FC<Props> = ({ editable = false, products }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state: RootState) => state.cart);
  const [productToShow, setproductToShow] = useState<
    IOrderItem[] | ICartProduct[]
  >([]);

  const onNewCartQty = (product: ICartProduct, newQty: number) => {
    const productClone = { ...product };
    productClone.quantity = newQty;
    dispatch(udpateCartQuantity(productClone));
  };

  const handleDelete = (product: ICartProduct) => {
    dispatch(removeFromCart(product));
  };

  useEffect(() => {
    if (products) {
      setproductToShow(products);
    } else {
      setproductToShow(cart);
    }
  }, [cart, products]);

  return (
    <>
      {productToShow.map((product) => (
        <Grid container spacing={3} key={product.slug + product.size}>
          <Grid item xs={3}>
            <NextLink href={`/product/${product.slug}`} passHref>
              <Link>
                <CardActionArea>
                  <CardMedia
                    image={product.image}
                    component="img"
                    sx={{ borderRadius: "5px" }}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">
                Talla: <strong>{product.size}</strong>
                {editable ? (
                  <ItemCounter
                    updatedQuantity={(qty) =>
                      onNewCartQty(product as ICartProduct, qty)
                    }
                    currentValue={product.quantity}
                    maxValue={10}
                  />
                ) : (
                  <Typography variant="h6">
                    {product.quantity}{" "}
                    {product.quantity > 1 ? "Productos" : "Producto"}
                  </Typography>
                )}
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
            <Typography variant="subtitle1">{`$${product.price}`}</Typography>
            {editable && (
              <Button
                onClick={() => handleDelete(product as ICartProduct)}
                variant="text"
                color="secondary"
              >
                Eliminar
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
