import { FormControl, FormHelperText, FormLabel } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { ICartProduct, IProduct } from "../../interfaces";
import { CustomRollCategoryOption } from "./CustomRollCategoryOption";

interface Props {
  label: any;
  maxQty: number;
  productList: IProduct[];
  setPromoToSendCart: React.Dispatch<React.SetStateAction<ICartProduct>>;
  promoToSendCart: any;
}

// type Labels =
//   | "proteins"
//   | "envelopes"
//   | "sauces"
//   | "vegetables"
//   | "extraProduct";

const dictCategory: indexType = {
  Proteinas: "proteins",
  Envolturas: "envelopes",
  Salsas: "sauces",
  Vegetales: "vegetables",
  Extras: "extraProduct",
};

interface indexType {
  [key: string]: string;
}

export const FormControlByCategory: FC<Props> = ({
  label,
  maxQty,
  productList,
  setPromoToSendCart,
  promoToSendCart,
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    const isLessThanMax = promoToSendCart[dictCategory[label]].length > maxQty;
    setError(isLessThanMax);
  }, [promoToSendCart[dictCategory[label]]]);

  return (
    <FormControl
      error={error}
      sx={{ m: 3 }}
      component="fieldset"
      variant="standard"
    >
      <FormLabel component="legend" sx={{ mb: 3 }}>
        {label} ({maxQty} máx.)
      </FormLabel>
      <CustomRollCategoryOption
        listProducts={productList!}
        setPromoToSendCart={setPromoToSendCart}
        label={label}
      />
      <FormHelperText
        // sx={{ display: "flex", justifyContent: "end" }}
        id="my-helper-text"
      >
        {`Favor seleccione máximo ${maxQty}`}
      </FormHelperText>
    </FormControl>
  );
};
