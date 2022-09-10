import { Grid } from "@mui/material";
import React, { FC } from "react";
import { IProduct } from "../../interfaces";

import { AddExtra } from "./AddExtra";

interface Props {
  products: IProduct[];
}

export const ExtraProducts: FC<Props> = ({ products }) => {
  return (
    <>
      <Grid container width={"100%"}>
        {products.map((prod) => (
          <AddExtra key={prod._id} prod={prod} />
        ))}
      </Grid>
    </>
  );
};
