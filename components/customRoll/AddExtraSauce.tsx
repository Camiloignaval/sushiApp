import { Box, Chip, Grid, Typography } from "@mui/material";
import React, { FC } from "react";
import { IProduct } from "../../interfaces";
import { ItemCounter } from "../ui";

interface Props {
  sauceProducts: IProduct[];
}

export const AddExtraSauce: FC<Props> = ({ sauceProducts }) => {
  console.log(sauceProducts);
  return (
    <>
      <Grid container>
        {sauceProducts.map((sauce) => (
          <Box width={"100%"} display="flex">
            <Box position={"relative"}>
              <img
                src={sauce.image}
                width="60px"
                height="60px"
                style={{
                  display: "flex",

                  justifyContent: "center",
                  opacity: sauce.inStock ? 1 : 0.3,
                }}
              />
              <Chip
                label={`$${sauce.price}`}
                variant="outlined"
                size="small"
                sx={{
                  position: "absolute",
                  marginLeft: "40px",
                  zIndex: 100,
                  top: 0,
                  fontWeight: "500",
                  backdropFilter: "blur(5.8px)",
                }}
              />
            </Box>

            <Typography
              display={"flex"}
              alignContent="center"
              alignItems="center"
              marginLeft={6}
              variant="subtitle2"
            >
              Salsa {sauce.name}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />

            <ItemCounter currentValue={0} maxValue={10} />
          </Box>
        ))}
      </Grid>
    </>
  );
};
