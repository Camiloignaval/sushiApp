import { FormControl, FormHelperText, FormLabel } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { ICartProduct, IProduct } from "../../interfaces";
import { CustomRollCategoryOption } from "./CustomRollCategoryOption";

interface Props {
  label: string;
  maxQty: number;
  productList: IProduct[];
  setPromoToSendCart: React.Dispatch<React.SetStateAction<ICartProduct>>;
  promoToSendCart: ICartProduct;
}

const dictCategory = {
  Proteinas: "proteins",
  Envolturas: "envelopes",
  Salsas: "sauces",
  Vegetales: "vegetables",
  Extras: "extraProduct",
};

export const FormControlByCategory: FC<Props> = ({
  label,
  maxQty,
  productList,
  setPromoToSendCart,
  promoToSendCart,
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    const isLessThanMax: boolean =
      promoToSendCart[dictCategory[label]].length > maxQty;
    setError(isLessThanMax);
    // isLessThanMax ? setisError(true) : setisError(false);
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
