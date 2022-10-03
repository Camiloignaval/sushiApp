import {
  FormGroup,
  Grid,
  FormControlLabel,
  Checkbox,
  Chip,
  Box,
} from "@mui/material";
import Image from "next/image";
import React, { FC } from "react";
import { ICartProduct, IProduct } from "../../interfaces";
import { SushiFilled } from "../../public/Icons/SushiFilled";
import { SushiOutlined } from "../../public/Icons/SushiOutlined";
import { ItemCounter } from "../ui";
import { ProductWithCounter } from "./ProductWithCounter";

interface Props {
  listProducts: IProduct[];
  showPrice?: boolean;
  setPromoToSendCart: React.Dispatch<React.SetStateAction<ICartProduct>>;
  label: Label;
  isVeggie?: boolean;
  promoToSendCart: ICartProduct[];
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
  promoToSendCart,
}) => {
  const addOrRemoveProduct = (name: string) => {
    setPromoToSendCart((prev) => {
      const toSearch: any = prev[dictCategory[label] as Label];
      const isInOrder = toSearch?.find((order: any) => order._id === name);
      const newArrayToSend = isInOrder
        ? toSearch!.filter((order: any) => order._id !== name)
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
            <ProductWithCounter
              setPromoToSendCart={setPromoToSendCart}
              promoToSendCart={promoToSendCart}
              product={product}
              isVeggie={isVeggie}
              label={label}
              addOrRemoveProduct={addOrRemoveProduct}
            />
          </Grid>
        ))}
      </Grid>
    </FormGroup>
  );
};
