import {
  FormGroup,
  Grid,
  FormControlLabel,
  Checkbox,
  Chip,
} from "@mui/material";
import Image from "next/image";
import React, { FC } from "react";
import { ICartProduct, IProduct } from "../../interfaces";
import { SushiFilled } from "../../public/Icons/SushiFilled";
import { SushiOutlined } from "../../public/Icons/SushiOutlined";

interface Props {
  listProducts: IProduct[];
  showPrice?: boolean;
  setPromoToSendCart: React.Dispatch<React.SetStateAction<ICartProduct>>;
  label: Label;
  isVeggie?: boolean;
}

type Label =
  | "proteins"
  | "envelopes"
  | "sauces"
  | "vegetables"
  | "extraProduct";

const dictCategory: any = {
  Proteinas: "proteins",
  Envolturas: "envelopes",
  Salsas: "sauces",
  Vegetales: "vegetables",
  Extras: "extraProduct",
};

export const CustomRollCategoryOption: FC<Props> = ({
  listProducts,
  showPrice = false,
  isVeggie,
  setPromoToSendCart,
  label,
}) => {
  const handleChange = ({
    target: { name },
  }: React.ChangeEvent<HTMLInputElement>) => {
    addOrRemoveProduct(name);
  };

  const addOrRemoveProduct = (name: string) => {
    setPromoToSendCart((prev) => {
      const toSearch: IProduct[] | undefined =
        prev[dictCategory[label] as Label];
      const isInOrder = toSearch?.find((order) => order._id === name);
      const newArrayToSend = isInOrder
        ? toSearch!.filter((order) => order._id !== name)
        : [...toSearch!, ...listProducts.filter((prod) => prod._id === name)];
      return {
        ...prev,
        [dictCategory[label]]:
          toSearch?.length === 0
            ? listProducts.filter((prod) => prod._id === name)
            : newArrayToSend,
      };
    });
  };

  return (
    <FormGroup
      sx={{
        display: "flex",
      }}
    >
      <Grid
        container
        rowSpacing={2}
        rowGap={2}
        sx={{
          display: "flex",
          width: { xs: "100vw", sm: "70vw", md: "50vw", lg: "34vw" },
        }}
      >
        {listProducts?.map((product, i) => (
          <Grid key={i} item xs={6} sm={4} lg={3} sx={{ position: "relative" }}>
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
                  checkedIcon={<SushiFilled />}
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
          </Grid>
        ))}
      </Grid>
    </FormGroup>
  );
};
