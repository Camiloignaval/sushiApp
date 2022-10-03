import { Grid, Box, Chip, Typography } from "@mui/material";
import React, { FC, useState } from "react";
import { IProduct } from "../../interfaces";
import { ItemCounter } from "../ui";

interface Props {
  sauce: IProduct;
  saucesChoose: IProduct[];
  setSaucesChoose: React.Dispatch<React.SetStateAction<IProduct[]>>;
  blockPlusButton: boolean;
}

interface qty {
  name: number;
}

export const SauceSelectionable: FC<Props> = ({
  sauce,
  saucesChoose,
  setSaucesChoose,
  blockPlusButton,
}) => {
  console.log({ sauce });

  const updatedQuantity = (qty: number) => {
    setSaucesChoose((prev) =>
      prev.map((p) => {
        if (p.name !== sauce.name) {
          return p;
        }
        const copySauce = { ...p };
        copySauce.qty = qty;
        return copySauce;
      })
    );
  };
  return (
    <Grid item xs={6} md={4} lg={3}>
      <Box position={"relative"} display={"flex"} justifyContent={"center"}>
        <img
          src={sauce.image!.toString() ?? ""}
          alt="Producto Extra"
          width="60px"
          height="60px"
          style={{
            display: "flex",

            justifyContent: "center",
            opacity: sauce.inStock ? 1 : 0.3,
          }}
        />
      </Box>

      <Typography
        display={"flex"}
        justifyContent="center"
        alignItems="center"
        marginLeft={1}
        variant="subtitle2"
      >
        {sauce.name}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />

      {
        <Box display={"flex"} justifyContent="center">
          <ItemCounter
            updatedQuantity={updatedQuantity}
            currentValue={
              saucesChoose.find((s) => s.name === sauce.name)?.qty ?? 0
            }
            isPossibleZero
            blockButtonPlus={blockPlusButton}
          />
        </Box>
      }
    </Grid>
  );
};
