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
import { TbDiscount2 } from "react-icons/tb";
import { currency } from "../../utils";

interface Props {
  promotion: IPromotion;
}

const CardInfo: FC<Props> = ({ promotion }) => {
  return (
    // <Box sx={{ px: 1 }}>
    <Grid container item>
      <CardContent sx={{ mb: 3 }}>
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
              {promotion?.promotionItems?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Typography>
        </Grid>
      </CardContent>

      <CardActions sx={{ position: "absolute", bottom: 0, right: 0 }}>
        {promotion?.inOffer ? (
          <Box>
            <Typography
              display={"flex"}
              justifyContent="end"
              variant="h6"
              fontWeight={500}
              sx={{
                textDecoration: "line-through",
              }}
              // fontStyle="italic"
            >{`Antes ${currency.format(+promotion?.price!)}`}</Typography>

            <Typography
              display={"flex"}
              justifyContent="end"
              variant="h5"
              fontWeight={500}
              // fontStyle="italic"
              color={"red"}
            >
              {<TbDiscount2 style={{ marginRight: "5px", fontSize: "2rem" }} />}
              {`Precio oferta ${currency.format(+promotion?.offerPrice!)}`}
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography
              display={"flex"}
              justifyContent="end"
              variant="h5"
              fontWeight={500}
              // fontStyle="italic"
            >{`${currency.format(+promotion.price)}`}</Typography>
          </Box>
        )}

        {/* </Grid> */}
      </CardActions>
    </Grid>
    // </Box>
  );
};

export default CardInfo;
