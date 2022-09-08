import { Box, FormControl, FormLabel, Grid } from "@mui/material";
import React from "react";
import { useGetProductsQuery } from "../../store/RTKQuery/productsApi";
import { FullScreenLoading } from "../ui";
import { AddExtraSauce } from "./AddExtraSauce";
import { CustomRollCategoryOption } from "./CustomRollCategoryOption";

export const FormCustomRoll = () => {
  const { data: productData } = useGetProductsQuery(null);

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
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormLabel component="legend" sx={{ mb: 3 }}>
            Envolturas (1 máx.)
          </FormLabel>
          <CustomRollCategoryOption listProducts={envelopeProduct!} />
        </FormControl>
      </Grid>

      {/* Proteinas */}
      <Grid container>
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormLabel component="legend" sx={{ mb: 3 }}>
            Proteína (1 máx.)
          </FormLabel>
          <CustomRollCategoryOption listProducts={proteinProduct!} />
        </FormControl>
      </Grid>
      {/* Vegetales */}
      <Grid container>
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormLabel component="legend" sx={{ mb: 3 }}>
            Vegetales (2 máx.)
          </FormLabel>
          <CustomRollCategoryOption listProducts={vegetableProduct!} />
        </FormControl>
      </Grid>

      {/* Salsas */}
      <Grid container>
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormLabel component="legend" sx={{ mb: 3 }}>
            Salsas (1 máx.)
          </FormLabel>
          <CustomRollCategoryOption listProducts={sauseProduct!} />
        </FormControl>
      </Grid>

      {/* Extras */}
      <Grid container>
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormLabel component="legend" sx={{ mb: 3 }}>
            Extras (2 máx.)
          </FormLabel>
          <CustomRollCategoryOption
            listProducts={[...proteinProduct!, ...vegetableProduct!]}
            showPrice
          />
        </FormControl>
      </Grid>

      {/* Salsas extras */}
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend" sx={{ mb: 3 }}>
          Agrega salsas extra
        </FormLabel>
        <AddExtraSauce sauceProducts={sauseProduct!} />
      </FormControl>
    </Box>
  );
};
