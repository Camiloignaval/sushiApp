import { FormControlLabel, Checkbox, Grid, Chip, Box } from "@mui/material";
import React, { FC, useEffect } from "react";
import { ICartProduct, IProduct } from "../../interfaces";
import product from "../../pages/api/admin/product";
import { SushiFilled } from "../../public/Icons/SushiFilled";
import { SushiOutlined } from "../../public/Icons/SushiOutlined";
import { ItemCounter } from "../ui";

interface Props {
  product: IProduct;
  isVeggie?: boolean;
  label: string;
  addOrRemoveProduct: (name: string) => void;
  promoToSendCart: ICartProduct[];
  setPromoToSendCart: React.Dispatch<React.SetStateAction<ICartProduct>>;
}

const dictCategory: any = {
  Proteinas: "proteins",
  Envolturas: "envelopes",
  Salsas: "sauces",
  Vegetales: "vegetables",
  Extras: "extraProduct",
};

export const ProductWithCounter: FC<Props> = ({
  product,
  isVeggie = false,
  label,
  addOrRemoveProduct,
  promoToSendCart,
  setPromoToSendCart,
}) => {
  const updatedQuantity = (qty: number) => {
    const copySendCart: any = { ...promoToSendCart };
    const newCategory = copySendCart[dictCategory[label]].map(
      (p: ICartProduct) => {
        if (p._id === product._id) {
          return { ...p, qty };
        }
        return p;
      }
    );
    console.log({
      prueba: ((promoToSendCart[dictCategory[label]] as any) ?? [])?.find(
        (p: ICartProduct) => p._id === product._id
      ),
    });
    copySendCart[dictCategory[label]] = newCategory;
    console.log({ copySendCart });

    setPromoToSendCart((prev) => copySendCart);
  };

  //   eliminar de productandqty si lo desmarca
  useEffect(() => {
    //   if (
    //     !((promoToSendCart[dictCategory[label]] as any) ?? []).find(
    //       (p: ICartProduct) => p._id === product._id
    //     )
    //   ) {
    //     setproductAndQty((prev) => {
    //       const newValues = prev[dictCategory[label] as keyof object] as object;
    //       console.log({ newValues });
    //       // delete newValues[product?.name as keyof object];
    //       return {
    //         ...prev,
    //         [dictCategory[label]]: newValues,
    //       };
    //     });
    //   }
  }, [promoToSendCart]);

  const handleChange = ({
    target: { name },
  }: React.ChangeEvent<HTMLInputElement>) => {
    addOrRemoveProduct(name);
  };

  //   useEffect(() => {
  //     if (isVeggie && label === "Proteinas") {
  //       addOrRemoveProduct(product.name);
  //       // deseleccionar todas las proteinas
  //     }
  //   }, [isVeggie]);

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            onChange={handleChange}
            disabled={
              !product.inStock ||
              (isVeggie === true &&
                product.type === "filling" &&
                product.fillingType === "protein")
            }
            name={product._id}
            icon={
              product.inStock &&
              !(
                isVeggie === true &&
                product.type === "filling" &&
                product.fillingType === "protein"
              ) ? (
                <SushiOutlined />
              ) : (
                <SushiOutlined color={"#E0E0E0"} />
              )
            }
            checkedIcon={
              //   product.inStock &&
              //   !(
              //     isVeggie === true &&
              //     product.type === "filling" &&
              //     product.fillingType === "protein"
              //   ) ? (
              <SushiFilled />
              //   ) : (
              //     <SushiOutlined color={"#E0E0E0"} />
              //   )
            }
          />
        }
        label={
          <Grid container>
            <Grid item xs={12}>
              <img
                src={product.image}
                key={product._id}
                width="60px"
                height="60px"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  opacity:
                    product.inStock &&
                    !(
                      isVeggie === true &&
                      product.type === "filling" &&
                      product.fillingType === "protein"
                    )
                      ? 1
                      : 0.3,
                }}
                // layout="fixed"
                // loading="lazy"
              />
            </Grid>
            <Grid
              item
              sx={{
                marginTop: "-20px",
                textAlign: "center",
                width: "0px",
                fontSize: ".9rem",
                backdropFilter: "blur(5.8px)",
                fontWeight: 800,
                userSelect: "none",
                textShadow: "0px 5px 6px #FFFFFF",
              }}
              xs={12}
            >
              {product.name}
            </Grid>
            {dictCategory[label] === "extraProduct" && (
              <Chip
                label={`$${product.price}`}
                variant="outlined"
                size="small"
                sx={{
                  position: "absolute",
                  marginLeft: "40px",

                  fontWeight: "500",
                  backdropFilter: "blur(5.8px)",
                }}
              />
            )}
          </Grid>
        }
      />
      {
        /* promoToSendCart[dictCategory[label]]?.find(
        (p) => p._id === product._id
      ) && */
        !["envelopes"].includes(dictCategory[label]) &&
          ((promoToSendCart[dictCategory[label]] as any) ?? [])?.find(
            (p: ICartProduct) => p._id === product._id
          ) && (
            <Box display={"flex"} justifyContent="start">
              <ItemCounter
                updatedQuantity={updatedQuantity}
                currentValue={
                  ((promoToSendCart[dictCategory[label]] as any) ?? [])?.find(
                    (p: ICartProduct) => p._id === product._id
                  ).qty ?? 1
                }
                // blockButtonPlus={blockPlusButton}
              />
            </Box>
          )
      }
    </>
  );
};
