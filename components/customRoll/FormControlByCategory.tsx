import { HelpOutline } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { ICartProduct, IProduct } from "../../interfaces";
import { useGetSettingsStoreQuery } from "../../store/RTKQuery/settings";
import { CustomRollCategoryOption } from "./CustomRollCategoryOption";

interface Props {
  label: any;
  maxQty: number;
  productList: IProduct[];
  setPromoToSendCart: React.Dispatch<React.SetStateAction<ICartProduct>>;
  promoToSendCart: any;
  isVeggie?: boolean;
  qtyProteiMoreVeg?: number;
}

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
  isVeggie,
  qtyProteiMoreVeg,
  // productAndQty,
  // setproductAndQty,
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    let isLessThanMax = false;
    if (label === "Envolturas") {
      console.log("entre aqui");
      isLessThanMax = promoToSendCart[dictCategory[label]].length > maxQty!;
    } else if (!isVeggie || label !== "Vegetales") {
      isLessThanMax =
        promoToSendCart[dictCategory[label]].reduce(
          (acc: number, curr: IProduct) => +acc + +(curr?.qty ?? 0),
          0
        ) > maxQty;
    } else {
      isLessThanMax =
        promoToSendCart[dictCategory[label]].reduce(
          (acc: number, curr: IProduct) => +acc + +(curr?.qty ?? 0),
          0
        ) > qtyProteiMoreVeg!;
    }
    setError(isLessThanMax);
  }, [
    promoToSendCart[dictCategory[label]],
    maxQty,
    label,
    promoToSendCart,
    isVeggie,
    qtyProteiMoreVeg,
  ]);

  return (
    <FormControl
      error={error}
      sx={{ m: 3 }}
      component="fieldset"
      variant="standard"
    >
      <FormLabel component="legend" sx={{ mb: 3 }}>
        {label === "Vegetales" ? "Vegetales y otros" : label}{" "}
        {!isVeggie || label !== "Proteinas" ? "(" : ""}
        {isVeggie ? qtyProteiMoreVeg : maxQty}{" "}
        {!isVeggie || label !== "Proteinas" ? "máx.)" : ""}
      </FormLabel>
      <CustomRollCategoryOption
        promoToSendCart={promoToSendCart}
        isVeggie={isVeggie}
        listProducts={productList!}
        setPromoToSendCart={setPromoToSendCart}
        label={label}
      />
      <FormHelperText id="my-helper-text">
        {(!isVeggie || label !== "Proteinas") &&
          `Favor seleccione máximo ${isVeggie ? qtyProteiMoreVeg : maxQty}`}
        {label == "Salsas" && "incluida(s) en roll"}
        {label == "Salsas" && (
          <Tooltip title="En el carrito podrá incluir más salsas">
            <IconButton size="small" sx={{ opacity: 0.5 }}>
              <HelpOutline />
            </IconButton>
          </Tooltip>
        )}
      </FormHelperText>
    </FormControl>
  );
};
