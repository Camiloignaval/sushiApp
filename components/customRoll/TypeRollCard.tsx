import { Card } from "@mui/material";
import React from "react";

interface Props {
  rollType: any;
}

export const TypeRollCard = ({ rollType }) => {
  return <Card>{rollType}</Card>;
};
