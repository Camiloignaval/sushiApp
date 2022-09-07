import {
  Grid,
  CardContent,
  Typography,
  Divider,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import React, { FC, Dispatch, SetStateAction } from "react";
import { IPromotion } from "../../interfaces";

interface Props {
  promotion: IPromotion;
}

const CardInfo: FC<Props> = ({ promotion }) => {
  return (
    // <Box sx={{ px: 1 }}>
    <Grid container item>
      <CardContent>
        <Grid item xs={12}>
          <Typography
            display={"flex"}
            justifyContent="end"
            letterSpacing={4}
            gutterBottom
            variant="h5"
            fontWeight={500}
          >
            {promotion?.name}
          </Typography>
        </Grid>
        <Divider />
        <Grid item xs={12}>
          <Typography
            display={"flex"}
            justifyContent="end"
            gutterBottom
            variant="h6"
          >
            {promotion?.description}
          </Typography>
        </Grid>
        <Grid item xs={12} marginBottom={5}>
          <Typography variant="body2" color="text.secondary">
            <ul>
              {promotion?.promotionItems?.map((item) => (
                <li>{item}</li>
              ))}
            </ul>
          </Typography>
        </Grid>
      </CardContent>

      <CardActions sx={{ position: "absolute", bottom: 0, right: 0 }}>
        <Box>
          <Typography
            display={"flex"}
            justifyContent="end"
            variant="h5"
            fontWeight={500}
            fontStyle="italic"
          >{`$${promotion.price}`}</Typography>
        </Box>
        {/* </Grid> */}
      </CardActions>
    </Grid>
    // </Box>
  );
};

export default CardInfo;
