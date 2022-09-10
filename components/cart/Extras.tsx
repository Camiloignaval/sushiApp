import { FormControl, FormLabel } from "@mui/material";
import React, { FC } from "react";
import { useSelector } from "react-redux";
import { IProduct } from "../../interfaces";
import { RootState } from "../../store";
import { ExtraProducts } from "../customRoll";

interface Props {
  productData: IProduct[];
  editable?: boolean;
}

export const Extras: FC<Props> = ({ productData, editable = false }) => {
  const { extraProduct } = useSelector((state: RootState) => state.cart);

  console.log({ extraProduct });
  return (
    <FormControl
      sx={{ m: 3, width: "100%" }}
      component="fieldset"
      variant="standard"
    >
      <FormLabel component="legend" sx={{ mb: 3 }}>
        {editable ? "Agrega salsas extra" : "Salsas extra"}
      </FormLabel>
      {/* salsas extras */}
      <ExtraProducts
        editable={editable}
        products={
          editable
            ? productData!?.filter((prod) => prod.type === "sauce")
            : extraProduct!?.filter(
                (prod) => prod.type === "sauce" && prod.quantity > 0
              )
        }
      />
      {/* otros extras */}
      <FormLabel component="legend" sx={{ marginY: 3 }}>
        {editable ? "Agrega otros productos" : "Otros productos"}
      </FormLabel>
      <ExtraProducts
        editable={editable}
        products={
          editable
            ? productData!?.filter((prod) => prod.type === "other")
            : extraProduct!?.filter(
                (prod) => prod.type === "other" && prod.quantity > 0
              )
        }
      />
    </FormControl>
  );
};
