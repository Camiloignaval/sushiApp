import { Box, Chip, Grid, Typography } from "@mui/material";
import React, { Dispatch, FC, SetStateAction } from "react";
import { ICartProduct, IProduct } from "../../interfaces";
import { ItemCounter } from "../ui";
import { AddSauce } from "./AddSauce";

interface Props {
  sauceProducts: IProduct[];
  setPromoToSendCart?: Dispatch<SetStateAction<ICartProduct>>;
  idPromo: string;
}

export const ExtraSauces: FC<Props> = ({
  sauceProducts,
  setPromoToSendCart,
  idPromo,
}) => {
  return (
    <>
      <Grid container>
        {sauceProducts.map((sauce) => (
          <AddSauce
            key={sauce._id}
            sauce={sauce}
            setPromoToSendCart={setPromoToSendCart}
            idPromo={idPromo}
          />
        ))}
      </Grid>
    </>
  );
};
