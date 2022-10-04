import { Grid } from "@mui/material";
import React, { FC } from "react";
import { ICartProduct, IProduct } from "../../interfaces";

import { AddExtra } from "./AddExtra";

interface Props {
  products: IProduct[] | ICartProduct[];
  editable?: boolean;
}

export const ExtraProducts: FC<Props> = ({ products, editable = false }) => {
  return (
    <>
      <Grid container width={"100%"}>
        {(products! ?? []).map((prod, i) => (
          <AddExtra editable={editable} key={i} prod={prod} />
        ))}
      </Grid>
    </>
  );
};
