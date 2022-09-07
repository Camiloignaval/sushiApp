import { Grid } from "@mui/material";
import { FC } from "react";
import { IPromotion } from "../../interfaces";
import { IProduct } from "../../interfaces/products";
import { PromotionCard } from "./PromotionCard";

interface Props {
  promotions: IPromotion[];
}

export const PromotionsList: FC<Props> = ({ promotions }) => {
  console.log({ promotions });
  return (
    <Grid container spacing={3} flexGrow={1} display="flex">
      {(promotions ?? []).map((promotion, i) => (
        <PromotionCard key={i} promotion={promotion} />
      ))}
    </Grid>
  );
};
