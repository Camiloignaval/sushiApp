import { Box, Typography } from "@mui/material";
import React, { FC } from "react";
import { IPromotion } from "../../interfaces";
import promotions from "../../pages/api/promotions";
import { FullScreenLoading } from "../ui";
import { PromotionsList } from "./PromotionList";
import { BiCategory } from "react-icons/bi";
import { relative } from "path";

interface Props {
  // todo arreglar tipo
  promotions: any;
}

export const PromotionCategory: FC<Props> = ({ promotions }) => {
  return (
    <div id={promotions[0]}>
      <Typography
        variant="h1"
        sx={{ marginBottom: 3, marginTop: 5, letterSpacing: 4 }}
      >
        <BiCategory style={{ position: "relative", top: 4 }} /> {promotions[0]}
      </Typography>
      <PromotionsList promotions={promotions[1]} />
    </div>
  );
};
