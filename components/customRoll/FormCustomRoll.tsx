import { HelpOutline } from "@mui/icons-material";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Switch,
  Tooltip,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import React, { useState, FC, useEffect } from "react";
import { ICartProduct } from "../../interfaces";
import { useGetProductsQuery } from "../../store/RTKQuery/productsApi";
import { useGetSettingsStoreQuery } from "../../store/RTKQuery/settings";
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
  const { data: productData, isLoading: isLoadingProducts } =
    useGetProductsQuery(null);
  const { data: settingsData, isLoading: isLoadingSettings } =
    useGetSettingsStoreQuery();
  const [maxQty, setMaxQty] = useState({
    proteins: settingsData?.customRoll!.proteins ?? 1,
    vegetables: settingsData?.customRoll!.vegetables ?? 1,
    envelopes: 1,
    sauces: settingsData?.customRoll!.sauces ?? 1,
    extraProduct: settingsData?.customRoll!.extraProducts ?? 1,
  });
  const [qtyProteiMoreVeg, setQtyProteiMoreVeg] = useState(0);
  const [isVeggie, setIsVeggie] = useState(false);

  useEffect(() => {
    if (settingsData) {
      setQtyProteiMoreVeg(
        settingsData?.customRoll?.proteins +
          settingsData?.customRoll?.vegetables
      );
    }
  }, [settingsData]);

  useEffect(() => {
    const { extraProduct, proteins, vegetables, envelopes, sauces } =
      promoToSendCart;

    if (isVeggie) {
      if (
        extraProduct!.length > maxQty.extraProduct ||
        vegetables!.length > qtyProteiMoreVeg ||
        sauces!.length > maxQty.sauces ||
        envelopes!.length > maxQty.envelopes
      ) {
        setisError(true);
      } else {
        setisError(false);
      }
    } else {
      if (
        extraProduct!.length > maxQty.extraProduct ||
        proteins!.length > maxQty.proteins ||
        vegetables!.length > maxQty.vegetables ||
        sauces!.length > maxQty.sauces ||
        envelopes!.length > maxQty.envelopes
      ) {
        setisError(true);
      } else {
        setisError(false);
      }
    }
  }, [promoToSendCart, isVeggie, qtyProteiMoreVeg]);

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
    (product) =>
      product?.type === "sauce" &&
      (product.name.toLowerCase().includes("soja") ||
        product.name.toLowerCase().includes("agridulce") ||
        product.name.toLowerCase().includes("soya") ||
        product.name.toLowerCase().includes("teriyaki"))
  );

  if (!productData || !settingsData || isLoadingProducts || isLoadingSettings) {
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
      <Grid container mt={2} ml={2}>
        <Grid item xs>
          <Typography variant="h5">
            Ingredientes{" "}
            <Tooltip title="En caso de querer doble porción de un producto, seleccionar menos cantidad, e indicar en notas extras">
              <IconButton size="small" sx={{ opacity: 0.7 }}>
                <HelpOutline />
              </IconButton>
            </Tooltip>
          </Typography>
        </Grid>
        <Grid item xs>
          <FormControlLabel
            label="Soy vegetariano!"
            labelPlacement="start"
            control={
              <Switch
                onChange={(e) => setIsVeggie((prev) => !prev)}
                checked={isVeggie}
              />
            }
          />
        </Grid>
      </Grid>

      {/* Proteinas */}
      <Grid container>
        <FormControlByCategory
          isVeggie={isVeggie}
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
          qtyProteiMoreVeg={qtyProteiMoreVeg}
          isVeggie={isVeggie}
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
