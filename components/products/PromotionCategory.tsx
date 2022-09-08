import { Typography } from "@mui/material";
import React, { FC } from "react";
import { IPromotion } from "../../interfaces";
import promotions from "../../pages/api/promotions";
import { FullScreenLoading } from "../ui";
import { PromotionsList } from "./PromotionList";

interface Props {
  // todo arreglar tipo
  promotions: any;
}

export const PromotionCategory: FC<Props> = ({ promotions }) => {
  return (
    <>
      <Typography variant="h2" sx={{ marginBottom: 1, marginTop: 5 }}>
        {promotions[0]}
      </Typography>
      <PromotionsList promotions={promotions[1]} />
    </>
  );
};
