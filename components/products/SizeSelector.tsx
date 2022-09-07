import { Box, Button } from "@mui/material";
import { FC } from "react";
import { ISize } from "../../interfaces";

interface Props {
  selectedSize?: ISize;
  sizes: ISize[];
  onSizeClick: (size: ISize) => void;
}

export const SizeSelector: FC<Props> = ({
  selectedSize,
  sizes,
  onSizeClick,
}) => {
  return (
    <Box>
      {sizes.map((size) => (
        <Button
          key={size}
          size="small"
          color={selectedSize === size ? "primary" : "info"}
          onClick={() => onSizeClick(size)}
          //   sx={{
          //     backgroundColor: selectedSize === size ? "primary" : "info",
          //   }}
        >
          {size}
        </Button>
      ))}
    </Box>
  );
};
