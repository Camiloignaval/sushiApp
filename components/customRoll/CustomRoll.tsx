import { Box, Button, Grid } from "@mui/material";
import React, { useState } from "react";
import { GiSushis } from "react-icons/gi";
import { SushiFilled } from "../../public/Icons/SushiFilled";
import { SushiOutlined } from "../../public/Icons/SushiOutlined";
import { DrawerCustomRoll } from "./DrawerCustomRoll";

export const CustomRoll = () => {
  const [typeRoll, setTypeRoll] = useState(undefined);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <DrawerCustomRoll open={open} setOpen={setOpen} />

      <Box marginTop={10} display="flex" justifyContent="end">
        <Button
          onClick={() => setOpen((prev) => !prev)}
          sx={{ fontSize: "1.5rem" }}
          variant="contained"
          color="primary"
          endIcon={<SushiFilled color={"white"} />}
        >
          Arma tu HandRoll
        </Button>
      </Box>
    </>
  );
};
