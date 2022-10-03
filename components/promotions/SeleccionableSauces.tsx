import { Grid } from "@mui/material";
import React, { FC } from "react";
import { IProduct } from "../../interfaces";
import products from "../../pages/api/products";
import { AddExtra } from "../customRoll";
import { SauceSelectionable } from "./SauceSelectionable";

interface Props {
  sauces: IProduct[];
  setSaucesChoose: React.Dispatch<React.SetStateAction<{}>>;
  saucesChoose: object;
  blockPlusButton: boolean;
}

export const SeleccionableSauces: FC<Props> = ({
  sauces,
  saucesChoose,
  setSaucesChoose,
  blockPlusButton,
}) => {
  return (
    <Grid container width={"100%"}>
      {sauces!.map((sauce, i) => (
        <SauceSelectionable
          saucesChoose={saucesChoose}
          setSaucesChoose={setSaucesChoose}
          key={i}
          sauce={sauce}
          blockPlusButton={blockPlusButton}
        />
      ))}
    </Grid>
  );
};
