import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

export const FullScreenLoading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="calc(100vh - 200px)"
    >
      <Typography sx={{ mb: 3 }} fontSize={40} fontWeight={200}>
        Cargando...
      </Typography>
      <CircularProgress size={100} thickness={2} />
    </Box>
  );
};
