import { Box, FormControl, FormLabel, Grid } from "@mui/material";
import React, { useState, FC, useEffect } from "react";
import { ICartProduct } from "../../interfaces";
import { useGetProductsQuery } from "../../store/RTKQuery/productsApi";
import { FullScreenLoading } from "../ui";
import { CustomRollCategoryOption } from "./CustomRollCategoryOption";
import { FormControlByCategory } from "./FormControlByCategory";

interface Props {
  setisError: React.Dispatch<React.SetStateAction<boolean>>;
  promoToSendCart: ICartProduct;
  setPromoToSendCart: React.Dispatch<React.SetStateAction<ICartProduct>>;
}

const maxQty = {
  proteins: 1,
  vegetables: 2,
  envelopes: 1,
  sauces: 1,
  extraProduct: 2,
};

export const FormCustomRoll: FC<Props> = ({
  setisError,
  promoToSendCart,
  setPromoToSendCart,
}) => {
  const { data: productData } = useGetProductsQuery(null);

  useEffect(() => {
    const { extraProduct, proteins, vegetables, envelopes, sauces } =
      promoToSendCart;
    if (
      extraProduct.length > maxQty.extraProduct ||
      proteins!.length > maxQty.proteins ||
      vegetables!.length > maxQty.vegetables ||
      sauces!.length > maxQty.sauces ||
      envelopes!.length > maxQty.envelopes
    ) {
      setisError(true);
    } else {
      setisError(false);
    }
  }, [promoToSendCart]);

  const proteinProduct = productData?.filter(
    (product) =>
      product?.type === "filling" && product.fillingType === "protein"
  );
  const vegetableProduct = productData?.filter(
    (product) =>
      product?.type === "filling" && product.fillingType === "vegetable"
  );
  const envelopeProduct = productData?.filter(
    (product) => product?.type === "envelope"
  );
  const sauseProduct = productData?.filter(
    (product) => product?.type === "sauce"
  );

  if (!productData) {
    return <FullScreenLoading />;
  }

  return (
    <Box>
      {/* envolturas */}
      <Grid container>
        <FormControlByCategory
          setPromoToSendCart={setPromoToSendCart}
          promoToSendCart={promoToSendCart}
          label={"Envolturas"}
          maxQty={maxQty.envelopes}
          productList={envelopeProduct!}
        />
      </Grid>

      {/* Proteinas */}
      <Grid container>
        <FormControlByCategory
          promoToSendCart={promoToSendCart}
          setPromoToSendCart={setPromoToSendCart}
          label={"Proteinas"}
          maxQty={maxQty.proteins}
          productList={proteinProduct!}
        />
      </Grid>
      {/* Vegetales */}
      <Grid container>
        <FormControlByCategory
          promoToSendCart={promoToSendCart}
          setPromoToSendCart={setPromoToSendCart}
          label={"Vegetales"}
          maxQty={maxQty.vegetables}
          productList={vegetableProduct!}
        />
      </Grid>

      {/* Salsas */}
      <Grid container>
        <FormControlByCategory
          promoToSendCart={promoToSendCart}
          setPromoToSendCart={setPromoToSendCart}
          label={"Salsas"}
          maxQty={maxQty.sauces}
          productList={sauseProduct!}
        />
      </Grid>

      {/* Extras */}
      <Grid container>
        <FormControlByCategory
          promoToSendCart={promoToSendCart}
          setPromoToSendCart={setPromoToSendCart}
          label={"Extras"}
          maxQty={maxQty.extraProduct}
          productList={[...proteinProduct!, ...vegetableProduct!]}
        />
      </Grid>
    </Box>
  );
};