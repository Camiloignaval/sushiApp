import { FormGroup, Grid, FormControlLabel, Checkbox } from "@mui/material";
import React, { FC } from "react";
import { IProduct } from "../../interfaces";
import { SushiFilled } from "../../public/Icons/SushiFilled";
import { SushiOutlined } from "../../public/Icons/SushiOutlined";

interface Props {
  listProducts: IProduct[];
  showPrice?: boolean;
}

export const CustomRollCategoryOption: FC<Props> = ({
  listProducts,
  showPrice = false,
}) => {
  return (
    <FormGroup
      sx={{
        display: "flex",
      }}
    >
      <Grid
        container
        rowSpacing={2}
        rowGap={2}
        sx={{
          display: "flex",
          width: { xs: "100vw", sm: "70vw", md: "50vw", lg: "40vw" },
          //   justifyContent: "space-evenly",
        }}
      >
        {listProducts?.map((product) => (
          <Grid item xs={6} sm={4} md={3} sx={{ position: "relative" }}>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={!product.inStock}
                  icon={
                    product.inStock ? (
                      <SushiOutlined />
                    ) : (
                      <SushiOutlined color={"#E0E0E0"} />
                    )
                  }
                  checkedIcon={<SushiFilled />}
                />
              }
              label={
                <Grid container>
                  <Grid item xs={12}>
                    <img
                      src={product.image}
                      key={product._id}
                      width="60px"
                      height="60px"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        opacity: product.inStock ? 1 : 0.3,
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    sx={{
                      marginTop: "-20px",
                      textAlign: "center",
                      width: "0px",
                      fontSize: ".9rem",
                      backdropFilter: "blur(5.8px)",
                      fontWeight: 800,
                      userSelect: "none",
                      textShadow: "0px 5px 6px #FFFFFF;",
                    }}
                    xs={12}
                  >
                    {product.name}
                  </Grid>
                  {showPrice && (
                    <Grid
                      item
                      sx={{
                        position: "absolute",
                        marginTop: "-20px",
                        left: -8,
                        bottom: 0,
                        textAlign: "center",
                        width: "0px",
                        fontSize: ".9rem",
                        backdropFilter: "blur(5.8px)",
                        fontWeight: 800,
                        userSelect: "none",
                        textShadow: "0px 5px 6px #FFFFFF;",
                      }}
                      xs={12}
                    >
                      ${product.price}
                    </Grid>
                  )}
                </Grid>
              }
            />
          </Grid>
        ))}
      </Grid>
    </FormGroup>
  );
};
