import { FormControl, FormLabel } from "@mui/material";
import React, { FC } from "react";
import { useSelector } from "react-redux";
import { IProduct } from "../../interfaces";
import { RootState } from "../../store";
import { ExtraProducts } from "../customRoll";

interface Props {
  productData: IProduct[];
  editable?: boolean;
  isAdmin?: boolean;
}

const isAdmin = true;

export const Extras: FC<Props> = ({
  productData,
  editable = false,
  isAdmin = false,
}) => {
  const { extraProduct } = useSelector((state: RootState) => state.cart);
  return (
    <FormControl
      sx={{ m: 3, width: "100%" }}
      component="fieldset"
      variant="standard"
    >
      {extraProduct.find((e) => e.type === "sauce" || editable || isAdmin) && (
        <FormLabel component="legend" sx={{ mb: 3 }}>
          {editable ? "Agrega salsas extra" : "Salsas extra"}
        </FormLabel>
      )}
      {/* salsas extras */}
      <ExtraProducts
        editable
        products={
          editable || isAdmin
            ? productData!?.filter((prod) => prod.type === "sauce")
            : extraProduct!?.filter(
                (prod) => prod.type === "sauce" && prod.quantity > 0
              )
        }
      />
      {/* otros extras */}
      {extraProduct.find((e) => e.type === "other" || editable || isAdmin) && (
        <FormLabel component="legend" sx={{ marginY: 3 }}>
          {editable ? "Agrega otros productos" : "Otros productos"}
        </FormLabel>
      )}
      <ExtraProducts
        editable={editable}
        products={
          editable || isAdmin
            ? productData!?.filter((prod) => prod.type === "other")
            : extraProduct!?.filter(
                (prod) => prod.type === "other" && prod.quantity > 0
              )
        }
      />
    </FormControl>
  );
};
