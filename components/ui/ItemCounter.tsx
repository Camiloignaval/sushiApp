import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FC, useState, useEffect } from "react";

interface Props {
  currentValue: number;
  maxValue?: number;
  updatedQuantity: (quantity: number) => void;
  isPossibleZero?: boolean;
}

export const ItemCounter: FC<Props> = ({
  currentValue,
  maxValue = undefined,
  updatedQuantity,
  isPossibleZero = false,
}) => {
  const [quantity, setQuantity] = useState(currentValue ?? 0);

  useEffect(() => {
    updatedQuantity(quantity);
  }, [quantity, updatedQuantity]);

  return (
    <Box display="flex" alignItems="center">
      <IconButton
        disabled={isPossibleZero ? quantity <= 0 : quantity <= 1}
        onClick={() => setQuantity((prev) => prev - 1)}
      >
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: "center" }}>
        {currentValue}
      </Typography>
      <IconButton
        disabled={maxValue ? maxValue === quantity : false}
        onClick={() => setQuantity((prev) => prev + 1)}
      >
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
