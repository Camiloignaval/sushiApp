import {
  Box,
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { FC } from "react";
import { ItemCounter } from "../ui";
import { FormCustomRoll } from "./FormCustomRoll";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DrawerCustomRoll: FC<Props> = ({ open, setOpen }) => {
  const handleClose = () => setOpen(false);

  const onConfirm = () => {
    setOpen(false);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        backdropFilter: "blur(4px)",
        transition: "all 0.5s ease-out",
      }}
    >
      <Box
        sx={{
          width: { xs: "100vw", sm: "70vw", md: "50vw", lg: "40vw" },
        }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          size="large"
          sx={{ position: "absolute", zIndex: "200" }}
        >
          <CloseIcon />
        </IconButton>

        <CardMedia
          className="fadeIn"
          image="https://res.cloudinary.com/dc6vako2z/image/upload/v1662584500/SushiApp/concept-tasty-food-with-sushi-rolls-white-background_185193-75532_irognb.jpg"
          component="img"
          alt={"handrollImage"}
          sx={{
            objectFit: "cover",
            maxHeight: "400px",
          }}
          // onLoad={() => setIsImageLoaded(true)}
        />
        <CardContent>
          <Typography
            display={"flex"}
            justifyContent={"center"}
            id="modal-modal-title"
            variant="h5"
            component="h2"
          >
            Escoge tus ingredientes
          </Typography>
          {/* <Divider sx={{ mb: 5 }} /> */}

          <FormCustomRoll />
          <Divider sx={{ mb: 4 }} />
          <Grid
            container
            display={"flex"}
            justifyContent="space-between"
            // paddingX={2}
          >
            <Grid item xs={8}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Cantidad
              </Typography>
            </Grid>
            <Grid xs item>
              <ItemCounter currentValue={1} maxValue={5} />
            </Grid>
          </Grid>
          <TextField
            id="outlined-multiline-flexible"
            label="Notas extras"
            multiline
            maxRows={4}
            fullWidth
            sx={{ marginTop: "7px" }}
            //   value={value}
            //   onChange={handleChange}
          />
        </CardContent>
        <CardActions sx={{ margin: "0 20px" }}>
          <Button
            onClick={onConfirm}
            fullWidth
            color="primary"
            sx={{ fontSize: "1.2rem" }}
          >
            Confirmar
          </Button>
        </CardActions>
      </Box>
    </Drawer>
  );
};
