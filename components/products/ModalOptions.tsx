import {
  Box,
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Drawer,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { FC } from "react";
import { IPromotion } from "../../interfaces";
import { ItemCounter } from "../ui";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  //   border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "5px",
  //   p: 4,
};

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  promotion: IPromotion;
}

export const ModalOptions: FC<Props> = ({ open, setOpen, promotion }) => {
  const handleClose = () => setOpen(false);
  console.log(promotion);

  const onConfirm = () => {
    setOpen(false);
  };
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{
        backdropFilter: "blur(4px)",
        transition: "all 0.5s ease-out",
        // width: "100px",
      }}
    >
      <Box sx={{ width: { xs: "100%", md: "550px" } }}>
        <CardMedia
          className="fadeIn"
          image={promotion.images[0]}
          component="img"
          alt={promotion.name}
          sx={{
            objectFit: "cover",
          }}
          height="300px"
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
            Opciones para {promotion.name}
          </Typography>
          <Divider sx={{ mb: 5 }} />

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
