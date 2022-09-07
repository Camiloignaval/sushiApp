import {
  Card,
  CardActionArea,
  Grid,
  CardMedia,
  Chip,
  Button,
  IconButton,
  Box,
} from "@mui/material";
// import NextLink from "next/link";
import React, { FC, useMemo, useState } from "react";
import style from "./PromotionCard.module.css";
import { IPromotion } from "../../interfaces";
import CardInfo from "./CardInfo";
import { DeleteOutline, Mode } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

interface Props {
  promotion: IPromotion;
}

export const PromotionCard: FC<Props> = ({ promotion }) => {
  const [isHovered, setisHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  console.log(promotion);
  const productImage = useMemo(() => {
    return isHovered && promotion.inStock
      ? promotion.images[1]
      : promotion.images[0];
  }, [isHovered, promotion.images]);

  const onClickCard = () => {
    setIsSelected(!isSelected);
  };

  return (
    <Grid
      container
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      position="relative"
      onMouseEnter={() => setisHovered(true)}
      onMouseLeave={() => setisHovered(false)}
    >
      <Card className={isSelected ? style["borderSelected"] : undefined}>
        <Grid item container display={"flex"} alignItems="stretch">
          <Grid item xs={12} /*  sm={6} */>
            <CardActionArea disabled={!promotion.inStock}>
              <Box
                className={style["glass-buttons"]}
                sx={{
                  position: "absolute",
                  zIndex: 50,
                  top: 0,
                  width: "100%",
                  height: "50px",
                }}
              ></Box>
              {!promotion.inStock ? (
                <>
                  <Box
                    className={style["withOutStock"]}
                    sx={{
                      position: "absolute",
                      zIndex: 150,
                      width: "100%",
                      height: "100%",
                    }}
                    display="flex"
                    flexDirection={"column"}
                    alignContent={"center"}
                    justifyContent={"center"}
                  >
                    <p className={style["labelWithoutStock"]}>Agotado</p>
                  </Box>
                </>
              ) : !isSelected ? (
                <Button
                  onClick={onClickCard}
                  variant="contained"
                  color="success"
                  sx={{
                    position: "absolute",
                    zIndex: 99,
                    top: 10,
                    right: 10,
                  }}
                >
                  Agregar
                </Button>
              ) : (
                <>
                  <Button
                    onClick={onClickCard}
                    color="error"
                    className={style["roundedButtonDelete"]}
                    sx={{
                      position: "absolute",
                      zIndex: 99,
                      top: 10,
                      right: 10,
                      // width: "5px",
                      // padding: "2px 0",
                      // borderRadius: "15px",
                    }}
                  >
                    {" "}
                    <DeleteIcon />
                  </Button>
                  <Button
                    onClick={onClickCard}
                    className={style["roundedButtonEdit"]}
                    color="warning"
                    sx={{
                      position: "absolute",
                      zIndex: 99,
                      top: 10,
                      right: 90,
                    }}
                  >
                    {" "}
                    <ModeEditIcon />
                  </Button>
                </>
              )}
              <CardMedia
                className="fadeIn"
                image={productImage}
                component="img"
                alt={promotion.name}
                sx={{
                  objectFit: "cover",
                }}
                height="300px"
                // onLoad={() => setIsImageLoaded(true)}
              />
            </CardActionArea>
          </Grid>
          <Grid item xs={12} /* sm={6} */>
            <CardInfo
              promotion={promotion}
              isSelected={isSelected}
              setIsSelected={setIsSelected}
            />
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};
